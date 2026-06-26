import TransactionList from "~/app/_components/@molecules/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="flex">
      <div className="flex-grow p-6">
        <h1 className="mb-4 text-2xl font-bold">Istoric</h1>
        <TransactionList />
      </div>
    </div>
  );
};

export default TransactionsPage;
