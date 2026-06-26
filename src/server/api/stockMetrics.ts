import type { StockChange } from "@prisma/client";

export const calcMetrics = (
  changes: StockChange[],
  leadTime: number,
  quantity: number,
) => {
  const usage: StockChange[] = [];

  for (const change of changes) {
    if (change.newQuantity < change.oldQuantity) {
      usage.push(change);
    }
  }

  if (usage.length === 0) {
    return {
      safetyStock: 0,
      reorderPoint: 0,
      averageDailyDemand: 0,
      daysLeft: 0,
      needsRestock: false,
    };
  }

  let totalUsed = 0;
  let firstDate = new Date(usage[0]!.changedAt).getTime();
  let lastDate = firstDate;

  for (const change of usage) {
    totalUsed += Math.abs(change.oldQuantity - change.newQuantity);

    const changeDate = new Date(change.changedAt).getTime();
    if (changeDate < firstDate) firstDate = changeDate;
    if (changeDate > lastDate) lastDate = changeDate;
  }

  const days = Math.max(Math.ceil((lastDate - firstDate) / 86400000), 1);
  const avgDailyDemand = totalUsed / days;
  const safetyStock = Math.ceil(1.65 * Math.sqrt(leadTime) * avgDailyDemand);
  const reorderPoint = Math.ceil(safetyStock + leadTime * avgDailyDemand);
  let daysLeft = 0;

  if (avgDailyDemand > 0) {
    daysLeft = Math.floor(quantity / avgDailyDemand);
  }

  return {
    safetyStock,
    reorderPoint,
    averageDailyDemand: Math.round(avgDailyDemand * 100) / 100,
    daysLeft,
    needsRestock: reorderPoint > 0 && quantity <= reorderPoint,
  };
};

export const groupChangesByItemId = (changes: StockChange[]) => {
  const grouped = new Map<number, StockChange[]>();

  for (const change of changes) {
    const itemChanges = grouped.get(change.itemId);

    if (itemChanges) {
      itemChanges.push(change);
    } else {
      grouped.set(change.itemId, [change]);
    }
  }

  return grouped;
};

export const stockStatus = (quantity: number, reorderPoint: number) => {
  if (quantity <= 0) return { label: "Fara stoc", color: "text-fail-base" };
  if (quantity <= reorderPoint)
    return { label: "De reaprovizionat", color: "text-secondary-base" };
  return { label: "Stoc ok", color: "text-success-base" };
};

export const stockFillClass = (needsRestock: boolean) => {
  if (needsRestock) return "fill-fail-base";
  return "fill-secondary-base";
};
