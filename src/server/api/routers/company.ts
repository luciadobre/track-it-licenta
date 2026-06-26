import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { db } from "~/server/db";

const shippingAddressInput = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
});

const getOwnedShippingAddress = async (
  ctx: { db: typeof db; session: { user: { id: string } } },
  id: number,
) => {
  const address = await ctx.db.shippingAddress.findUnique({
    where: { id },
    select: { company: { select: { userId: true } } },
  });

  if (!address) throw new TRPCError({ code: "NOT_FOUND" });
  if (address.company.userId !== ctx.session.user.id)
    throw new TRPCError({ code: "FORBIDDEN" });

  return address;
};

export const companyRouter = createTRPCRouter({
  getCompany: protectedProcedure.query(({ ctx }) =>
    ctx.db.company.findUnique({
      where: { userId: ctx.session.user.id },
      include: { shippingAddresses: true },
    }),
  ),

  createOrUpdateCompany: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        phone: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.company.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: { ...input, userId: ctx.session.user.id },
      }),
    ),

  addShippingAddress: protectedProcedure
    .input(shippingAddressInput)
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });
      if (!company) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Adauga intai datele firmei.",
        });
      }
      return ctx.db.shippingAddress.create({
        data: { ...input, companyId: company.id },
      });
    }),

  updateShippingAddress: protectedProcedure
    .input(shippingAddressInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnedShippingAddress(ctx, input.id);
      return ctx.db.shippingAddress.update({
        where: { id: input.id },
        data: { name: input.name, address: input.address },
      });
    }),

  deleteShippingAddress: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnedShippingAddress(ctx, input.id);
      return ctx.db.shippingAddress.delete({ where: { id: input.id } });
    }),
});
