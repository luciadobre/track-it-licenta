"use client";
import { api } from "~/trpc/react";
import ErrorMessage from "../@atoms/ErrorMessage";
import Loading from "../@atoms/Loading";
import NoResults from "../@atoms/NoResults";

type Transaction = {
  id: number;
  description: string;
  createdAt: Date;
  user?: { email: string | null };
};

const TransactionRow = ({ transaction }: { transaction: Transaction }) => (
  <div className="border-border flex items-center justify-between rounded-md border p-4 shadow-sm">
    <div>
      <div className="font-medium">{transaction.description}</div>
      <div className="text-text-secondary text-sm">
        De la {transaction.user?.email ?? "utilizator necunoscut"}
      </div>
    </div>
    <div className="text-text-secondary text-sm">
      {new Date(transaction.createdAt).toLocaleString()}
    </div>
  </div>
);

const TransactionList = () => {
  const {
    data: transactions,
    isLoading,
    error,
  } = api.transaction.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!transactions?.length)
    return <NoResults message="Nu ai activitate inca." />;

  return (
    <div>
      <div className="space-y-4">
        {transactions?.map((transaction: Transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
