"use client";
import AddPrice from "./AddPrice";
import StockChangesList from "./StockChangesList";

const StockSales = () => (
  <div className="space-y-6">
    <AddPrice />
    <StockChangesList />
  </div>
);

export default StockSales;
