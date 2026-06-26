"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import Button from "~/app/_components/@atoms/Button";
import ErrorMessage from "~/app/_components/@atoms/ErrorMessage";
import Input from "~/app/_components/@atoms/Input";
import Select from "~/app/_components/@atoms/Select";

const TYPE_OPTIONS = [
  { label: "Stoc", value: "Stock" },
  { label: "Vanzare", value: "Sale" },
];

const StatusMessage = ({
  message,
}: {
  message: { text: string; error: boolean } | null;
}) => {
  if (!message) return null;
  if (message.error)
    return <ErrorMessage message={message.text} className="mb-4" />;
  return <p className="text-success-base mb-4 text-sm">{message.text}</p>;
};

const AddPrice = () => {
  const [formData, setFormData] = useState({
    itemId: "",
    amount: "",
    type: "Stock",
    date: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);

  const { data: itemOptions = [] } = api.item.options.useQuery();

  const utils = api.useUtils();
  const updateQuantity = api.item.updateQuantity.useMutation({
    onSuccess: async () => {
      await utils.stockChanges.getAll.invalidate();
      await utils.transaction.getAll.invalidate();
      setMessage({ text: "Miscarea de stoc este salvata.", error: false });
      setFormData({ itemId: "", amount: "", type: "Stock", date: "" });
    },
    onError: (error) => {
      console.error("Eroare la actualizarea stocului:", error);
      setMessage({ text: "Nu am putut salva miscarea de stoc.", error: true });
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.itemId || !formData.amount || !formData.date) {
      setMessage({
        text: "Alege articolul, cantitatea si data.",
        error: true,
      });
      return;
    }
    updateQuantity.mutate({
      itemId: Number(formData.itemId),
      changeAmount: Number(formData.amount),
      isIncrease: formData.type === "Stock",
      date: formData.date,
    });
  };

  const setItemId = (itemId: string) => {
    setFormData((current) => ({ ...current, itemId }));
  };

  const setType = (type: string) => {
    setFormData((current) => ({ ...current, type }));
  };

  const setAmount = (amount: string) => {
    setFormData((current) => ({ ...current, amount }));
  };

  const setDate = (date: string) => {
    setFormData((current) => ({ ...current, date }));
  };

  return (
    <div>
      <StatusMessage message={message} />
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Select
          value={formData.itemId}
          onChange={setItemId}
          options={itemOptions}
        />
        <Select
          value={formData.type}
          onChange={setType}
          options={TYPE_OPTIONS}
        />
        <Input
          value={formData.amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantitate"
          type="number"
        />
        <Input
          value={formData.date}
          onChange={(e) => setDate(e.target.value)}
          type="datetime-local"
        />
        <Button
          intent="primary"
          text="Salveaza"
          type="submit"
          disabled={updateQuantity.isPending}
        />
      </form>
    </div>
  );
};

export default AddPrice;
