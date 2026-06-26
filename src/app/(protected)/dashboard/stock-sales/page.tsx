import StockSales from "~/app/_components/@organisms/StockSales";

const StockSalesPage = () => {
  return (
    <div className="flex">
      <div className="flex-grow p-6">
        <h1 className="mb-4 text-2xl font-bold">Miscari stoc</h1>
        <StockSales />
      </div>
    </div>
  );
};

export default StockSalesPage;
