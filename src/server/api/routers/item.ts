import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  calcMetrics,
  groupChangesByItemId,
  stockStatus,
} from "../stockMetrics";
import type { db } from "~/server/db";

const itemSchema = z.object({
  itemNumber: z.string().min(1),
  itemName: z.string().min(1),
  UOM: z.string().min(1),
  price: z.number().min(0),
  cost: z.number().min(0),
  quantity: z.number().min(0),
  description: z.string().optional(),
  image: z.string().optional(),
  locationId: z.number().optional(),
  leadTime: z.number().int().min(0).optional(),
});

const itemIdInput = z.object({ itemId: z.number() });

const logTransaction = (
  tx: {
    transaction: {
      create: (args: {
        data: { description: string; userId: string };
      }) => Promise<unknown>;
    };
  },
  description: string,
  userId: string,
) => tx.transaction.create({ data: { description, userId } });

const itemListInput = z.object({
  itemNumber: z.string().optional(),
  itemName: z.string().optional(),
  locationId: z.number().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(6),
});

type ItemInput = z.infer<typeof itemSchema>;
type ItemFilters = Pick<
  z.infer<typeof itemListInput>,
  "itemNumber" | "itemName" | "locationId"
>;

const itemData = (input: ItemInput) => ({
  itemNumber: input.itemNumber,
  itemName: input.itemName,
  UOM: input.UOM,
  price: input.price,
  cost: input.cost,
  quantity: input.quantity,
  description: input.description ?? "",
  image: input.image,
  leadTime: input.leadTime,
});

const buildItemWhere = (
  userId: string,
  { itemNumber, itemName, locationId }: ItemFilters,
): Prisma.ItemWhereInput => {
  const where: Prisma.ItemWhereInput = { userId };

  if (itemNumber) {
    where.itemNumber = { contains: itemNumber, mode: "insensitive" };
  }

  if (itemName) {
    where.itemName = { contains: itemName, mode: "insensitive" };
  }

  if (locationId) {
    where.itemLocations = { some: { locationId } };
  }

  return where;
};

const itemOption = ({ id, itemName }: { id: number; itemName: string }) => ({
  label: itemName,
  value: String(id),
});

const itemExcelRow = (item: {
  itemNumber: string;
  itemName: string;
  UOM: string;
  price: number;
  cost: number;
  quantity: number;
  description: string;
}) => ({
  "Cod Articol": item.itemNumber,
  "Nume Articol": item.itemName,
  "Unitate Masura": item.UOM,
  Pret: item.price,
  Cost: item.cost,
  Cantitate: item.quantity,
  Descriere: item.description,
});

const stockMovementText = (isIncrease: boolean) => {
  if (isIncrease) return { verb: "Adaugat", preposition: "in", multiplier: 1 };
  return { verb: "Scos", preposition: "din", multiplier: -1 };
};

const assertOwnsItem = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  itemId: number,
) => {
  const item = await ctx.db.item.findFirst({
    where: { id: itemId, userId: ctx.session.user.id },
    select: { id: true },
  });

  if (!item) throw new TRPCError({ code: "NOT_FOUND" });
};

const assertOwnsLocation = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  locationId: number,
) => {
  const location = await ctx.db.location.findFirst({
    where: { id: locationId, userId: ctx.session.user.id },
    select: { id: true },
  });

  if (!location) throw new TRPCError({ code: "NOT_FOUND" });
};

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(itemSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.locationId) await assertOwnsLocation(ctx, input.locationId);

      const existingItem = await ctx.db.item.findUnique({
        where: { itemNumber: input.itemNumber },
        select: { id: true },
      });

      if (existingItem) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Item number already exists.",
        });
      }

      return ctx.db.$transaction(async (tx) => {
        const item = await tx.item.create({
          data: {
            userId: ctx.session.user.id,
            ...itemData(input),
          },
        });

        if (input.locationId) {
          await tx.itemLocation.create({
            data: {
              itemId: item.id,
              locationId: input.locationId,
              quantity: input.quantity,
            },
          });
        }

        await logTransaction(
          tx,
          `Articol creat: ${input.itemName}`,
          ctx.session.user.id,
        );

        return item;
      });
    }),

  update: protectedProcedure
    .input(itemSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await assertOwnsItem(ctx, input.id);
      if (input.locationId) await assertOwnsLocation(ctx, input.locationId);

      return ctx.db.$transaction(async (tx) => {
        const item = await tx.item.update({
          where: { id: input.id },
          data: itemData(input),
        });

        await tx.itemLocation.deleteMany({
          where: { itemId: input.id },
        });

        if (input.locationId) {
          await tx.itemLocation.create({
            data: {
              itemId: input.id,
              locationId: input.locationId,
              quantity: input.quantity,
            },
          });
        }

        await logTransaction(
          tx,
          `Articol actualizat: ${input.itemName}`,
          ctx.session.user.id,
        );

        return item;
      });
    }),

  delete: protectedProcedure
    .input(itemIdInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const item = await tx.item.findFirst({
          where: { id: input.itemId, userId: ctx.session.user.id },
          select: { itemName: true },
        });

        if (!item) throw new TRPCError({ code: "NOT_FOUND" });

        await tx.item.delete({ where: { id: input.itemId } });

        await logTransaction(
          tx,
          `Articol sters: ${item.itemName}`,
          ctx.session.user.id,
        );

        return { id: input.itemId, itemName: item.itemName };
      });
    }),

  getNextItemNumber: protectedProcedure.query(async ({ ctx }) => {
    const item = await ctx.db.item.findFirst({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      select: { itemNumber: true },
    });
    const num = Number(item?.itemNumber);
    return isNaN(num) ? 1 : num + 1;
  }),

  options: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.item.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { itemName: "asc" },
      select: { id: true, itemName: true },
    });

    return [
      { label: "Alege articolul", value: "", disabled: true },
      ...items.map(itemOption),
    ];
  }),

  display: protectedProcedure
    .input(itemListInput)
    .query(async ({ ctx, input }) => {
      const where = buildItemWhere(ctx.session.user.id, input);

      const [items, total] = await ctx.db.$transaction([
        ctx.db.item.findMany({
          where,
          orderBy: { createdAt: "asc" },
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
        }),
        ctx.db.item.count({ where }),
      ]);

      const changes = await ctx.db.stockChange.findMany({
        where: {
          itemId: { in: items.map((item) => item.id) },
          item: { userId: ctx.session.user.id },
        },
      });
      const changesByItemId = groupChangesByItemId(changes);

      return {
        itemIds: items.map((item) => item.id),
        items: items.map((item) => {
          const itemChanges = changesByItemId.get(item.id);

          const metrics = calcMetrics(
            itemChanges ?? [],
            item.leadTime ?? 7,
            item.quantity,
          );

          return {
            ...item,
            ...metrics,
            stockStatus: stockStatus(item.quantity, metrics.reorderPoint),
            excelRow: itemExcelRow(item),
          };
        }),
        pagination: {
          currentPage: input.page,
          totalPages: Math.ceil(total / input.pageSize),
        },
      };
    }),

  getById: protectedProcedure
    .input(itemIdInput)
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.item.findFirst({
        where: { id: input.itemId, userId: ctx.session.user.id },
        include: {
          itemLocations: {
            include: {
              location: true,
            },
          },
        },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });
      return item;
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        changeAmount: z.number().positive(),
        isIncrease: z.boolean(),
        date: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const item = await tx.item.findFirst({
          where: { id: input.itemId, userId: ctx.session.user.id },
          select: { quantity: true },
        });

        if (!item) throw new TRPCError({ code: "NOT_FOUND" });

        const movement = stockMovementText(input.isIncrease);
        const newQuantity =
          item.quantity + input.changeAmount * movement.multiplier;

        if (newQuantity < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Quantity cannot be negative.",
          });
        }

        await tx.item.update({
          where: { id: input.itemId },
          data: { quantity: newQuantity },
        });

        await tx.stockChange.create({
          data: {
            itemId: input.itemId,
            oldQuantity: item.quantity,
            newQuantity,
            changedAt: new Date(input.date),
          },
        });

        await logTransaction(
          tx,
          `${movement.verb} ${input.changeAmount} ${movement.preposition} stoc`,
          ctx.session.user.id,
        );

        return { message: "Quantity updated." };
      });
    }),
});
