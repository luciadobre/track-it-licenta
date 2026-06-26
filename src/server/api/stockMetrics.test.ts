import {
  calcMetrics,
  groupChangesByItemId,
  stockFillClass,
  stockStatus,
} from "./stockMetrics";
import type { StockChange } from "@prisma/client";

const change = (
  itemId: number,
  oldQuantity: number,
  newQuantity: number,
  day: number,
) => {
  return {
    id: day,
    itemId,
    oldQuantity,
    newQuantity,
    changedAt: new Date(`2026-05-${String(day).padStart(2, "0")}T00:00:00Z`),
  } satisfies StockChange;
};

describe("stockMetrics", () => {
  it("returns zero metrics without usage", () => {
    expect(calcMetrics([], 7, 10)).toMatchObject({
      safetyStock: 0,
      reorderPoint: 0,
      averageDailyDemand: 0,
      daysLeft: 0,
      needsRestock: false,
    });
  });

  it("calculates usage metrics", () => {
    const metrics = calcMetrics(
      [change(1, 20, 10, 1), change(1, 10, 5, 6)],
      3,
      30,
    );

    expect(metrics.averageDailyDemand).toBe(3);
    expect(metrics.daysLeft).toBe(10);
    expect(metrics.reorderPoint).toBeGreaterThan(0);
  });

  it("groups changes by item id", () => {
    const grouped = groupChangesByItemId([
      change(1, 5, 3, 1),
      change(2, 7, 4, 2),
    ]);

    expect(grouped.get(1)).toHaveLength(1);
    expect(grouped.get(2)).toHaveLength(1);
  });

  it("returns stock status and chart fill classes", () => {
    expect(stockStatus(0, 5).label).toBe("Fara stoc");
    expect(stockStatus(3, 5).color).toBe("text-secondary-base");
    expect(stockStatus(10, 5).color).toBe("text-success-base");
    expect(stockFillClass(true)).toBe("fill-fail-base");
  });
});
