import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  calcMetrics,
  groupChangesByItemId,
  stockFillClass,
} from "../stockMetrics";

type ChartItem = {
  name: string;
  quantity: number;
  daysLeft: number;
  fillClass: string;
  safetyStock: number;
  reorderPoint: number;
  averageDailyDemand: number;
  needsRestock: boolean;
};

const lowStockItems = (items: ChartItem[]) => {
  const sortedItems = [...items];
  sortedItems.sort((a, b) => a.quantity - b.quantity);
  return sortedItems.slice(0, 8);
};

const daysLeftItems = (items: ChartItem[]) => {
  const sortedItems = [...items];
  sortedItems.sort((a, b) => a.daysLeft - b.daysLeft);
  return sortedItems.slice(0, 8);
};

export const stockChangesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.stockChange.findMany({
      where: { item: { userId: ctx.session.user.id } },
      include: { item: { select: { itemName: true } } },
      orderBy: { changedAt: "desc" },
    }),
  ),

  getByItemId: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.db.stockChange.findMany({
        where: {
          itemId: input.itemId,
          item: { userId: ctx.session.user.id },
        },
        select: {
          id: true,
          oldQuantity: true,
          newQuantity: true,
          changedAt: true,
        },
        orderBy: { changedAt: "desc" },
      }),
    ),

  getChartData: protectedProcedure.query(async ({ ctx }) => {
    const [items, changes] = await ctx.db.$transaction([
      ctx.db.item.findMany({
        where: { userId: ctx.session.user.id },
        select: { id: true, itemName: true, quantity: true, leadTime: true },
      }),
      ctx.db.stockChange.findMany({
        where: { item: { userId: ctx.session.user.id } },
      }),
    ]);

    const changesByItemId = groupChangesByItemId(changes);

    const chartItems = items.map((item) => {
      const changesForItem = changesByItemId.get(item.id);
      const itemChanges = changesForItem ?? [];
      const metrics = calcMetrics(
        itemChanges,
        item.leadTime ?? 7,
        item.quantity,
      );
      return {
        name: item.itemName,
        quantity: item.quantity,
        fillClass: stockFillClass(metrics.needsRestock),
        ...metrics,
      };
    });

    return {
      lowStock: lowStockItems(chartItems),
      daysLeft: daysLeftItems(chartItems),
    };
  }),
});
