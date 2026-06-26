"use client";

import { api } from "~/trpc/react";
import InventoryChart from "./InventoryChart";

const InventoryCharts = () => {
  const { data } = api.stockChanges.getChartData.useQuery();

  if (!data?.lowStock.length) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <InventoryChart
        title="Stoc scazut"
        data={data.lowStock}
        dataKey="quantity"
      />
      <InventoryChart
        title="Zile ramase"
        data={data.daysLeft}
        dataKey="daysLeft"
      />
    </div>
  );
};

export default InventoryCharts;
