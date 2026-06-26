import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { db } from "~/server/db";

const verifyLocationOwnership = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  locationId: number,
) => {
  const location = await ctx.db.location.findFirst({
    where: { id: locationId, userId: ctx.session.user.id },
    select: { id: true },
  });

  if (!location) throw new TRPCError({ code: "NOT_FOUND" });
};

const verifyItemOwnership = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  itemId: number,
) => {
  const item = await ctx.db.item.findFirst({
    where: { id: itemId, userId: ctx.session.user.id },
    select: { id: true },
  });

  if (!item) throw new TRPCError({ code: "NOT_FOUND" });
};

const verifyItemsOwnership = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  itemIds: number[],
) => {
  const uniqueIds = [...new Set(itemIds)];
  const ownedItems = await ctx.db.item.count({
    where: { id: { in: uniqueIds }, userId: ctx.session.user.id },
  });

  if (ownedItems !== uniqueIds.length) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
};

const locationOption = ({ id, name }: { id: number; name: string }) => ({
  label: name,
  value: String(id),
});

export const locationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        items: z
          .array(z.object({ itemId: z.number(), quantity: z.number().min(1) }))
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.items?.length) {
        await verifyItemsOwnership(
          ctx,
          input.items.map((item) => item.itemId),
        );
      }

      return ctx.db.$transaction(async (tx) => {
        const location = await tx.location.create({
          data: {
            name: input.name,
            address: input.address,
            userId: ctx.session.user.id,
          },
        });

        if (input.items?.length) {
          await tx.itemLocation.createMany({
            data: input.items.map((item) => ({
              itemId: item.itemId,
              locationId: location.id,
              quantity: item.quantity,
            })),
          });
        }

        return location;
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        locationId: z.number(),
        name: z.string().min(1),
        address: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyLocationOwnership(ctx, input.locationId);
      return ctx.db.location.update({
        where: { id: input.locationId },
        data: { name: input.name, address: input.address },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ locationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await verifyLocationOwnership(ctx, input.locationId);
      await ctx.db.itemLocation.deleteMany({
        where: { locationId: input.locationId },
      });
      return ctx.db.location.delete({
        where: { id: input.locationId },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const [locations, totals] = await ctx.db.$transaction([
      ctx.db.location.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          itemLocations: {
            include: {
              item: { select: { id: true, itemName: true, quantity: true } },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      ctx.db.itemLocation.groupBy({
        by: ["itemId"],
        where: { location: { userId: ctx.session.user.id } },
        _sum: { quantity: true },
        orderBy: { itemId: "asc" },
      }),
    ]);

    const allocatedByItemId = new Map(
      totals.map((t) => [t.itemId, t._sum?.quantity ?? 0]),
    );

    return locations.map((loc) => ({
      ...loc,
      itemLocations: loc.itemLocations.map((il) => ({
        ...il,
        available:
          il.item.quantity -
          (allocatedByItemId.get(il.itemId) ?? 0) +
          il.quantity,
      })),
    }));
  }),

  options: protectedProcedure.query(async ({ ctx }) => {
    const locations = await ctx.db.location.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    return [
      { label: "Alege locatia", value: "" },
      ...locations.map(locationOption),
    ];
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        locationId: z.number(),
        itemId: z.number(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyLocationOwnership(ctx, input.locationId);
      await verifyItemOwnership(ctx, input.itemId);

      const existing = await ctx.db.itemLocation.findFirst({
        where: { itemId: input.itemId, locationId: input.locationId },
      });

      if (existing) {
        return ctx.db.itemLocation.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + input.quantity },
        });
      }

      return ctx.db.itemLocation.create({
        data: {
          itemId: input.itemId,
          locationId: input.locationId,
          quantity: input.quantity,
        },
      });
    }),

  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        locationId: z.number(),
        quantity: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await verifyLocationOwnership(ctx, input.locationId);
      await verifyItemOwnership(ctx, input.itemId);

      const existing = await ctx.db.itemLocation.findFirst({
        where: { itemId: input.itemId, locationId: input.locationId },
      });

      if (input.quantity === 0) {
        if (existing) {
          return ctx.db.itemLocation.delete({ where: { id: existing.id } });
        }
        return null;
      }

      if (existing) {
        return ctx.db.itemLocation.update({
          where: { id: existing.id },
          data: { quantity: input.quantity },
        });
      }

      return ctx.db.itemLocation.create({
        data: {
          itemId: input.itemId,
          locationId: input.locationId,
          quantity: input.quantity,
        },
      });
    }),
});
