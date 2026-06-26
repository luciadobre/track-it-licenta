"use client";
import { api } from "~/trpc/react";
import Loading from "../../@atoms/Loading";
import NoResults from "../../@atoms/NoResults";
import StockChangeRow from "./StockChangeRow";

type StockChangeItem = {
  id: number;
  oldQuantity: number;
  newQuantity: number;
  changedAt: Date;
  item: { itemName: string };
};

const groupByMonth = (changes: StockChangeItem[]) => {
  const grouped: Record<string, StockChangeItem[]> = {};
  for (const change of changes) {
    const monthYear = new Date(change.changedAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    grouped[monthYear] ??= [];
    grouped[monthYear].push(change);
  }
  return grouped;
};

const StockChangesList = () => {
  const { data: stockChanges, isLoading } = api.stockChanges.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (!stockChanges?.length)
    return <NoResults message="Nu ai miscari de stoc inregistrate." />;

  return (
    <div className="space-y-8">
      {Object.entries(groupByMonth(stockChanges)).map(([monthYear, changes]) => (
        <div key={monthYear}>
          <h3 className="text-text-base mb-4 text-lg font-bold">{monthYear}</h3>
          <div className="space-y-4">
            {changes.map((change) => (
              <StockChangeRow key={change.id} change={change} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockChangesList;
