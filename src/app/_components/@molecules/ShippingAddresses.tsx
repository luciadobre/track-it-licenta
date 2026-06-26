"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Button from "../@atoms/Button";
import Input from "../@atoms/Input";
import AddressList, { type AddressEditor } from "./AddressList";
import type { AddressEditForm } from "./AddressRowContent";

const emptyForm = { name: "", address: "" };

const ShippingAddresses = () => {
  const { data: company, refetch } = api.company.getCompany.useQuery();
  const [newForm, setNewForm] = useState<AddressEditForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AddressEditForm>(emptyForm);

  const refresh = async () => {
    await refetch();
  };

  const add = api.company.addShippingAddress.useMutation({
    onSuccess: async () => {
      await refresh();
      setNewForm(emptyForm);
    },
  });
  const update = api.company.updateShippingAddress.useMutation({
    onSuccess: async () => {
      await refresh();
      setEditingId(null);
    },
  });
  const remove = api.company.deleteShippingAddress.useMutation({
    onSuccess: refresh,
  });

  const commitEdit = () => {
    if (!editingId || !editForm.name.trim() || !editForm.address.trim()) return;
    update.mutate({ id: editingId, ...editForm });
  };

  const editor: AddressEditor = {
    editingId,
    form: editForm,
    start: (id, name, address) => {
      setEditingId(id);
      setEditForm({ name, address });
    },
    change: (field, value) =>
      setEditForm((current) => ({ ...current, [field]: value })),
    commit: commitEdit,
    cancel: () => setEditingId(null),
  };

  return (
    <div className="rounded shadow">
      <h2 className="text-text-base mb-4 text-xl font-bold">
        Adrese furnizori
      </h2>
      <AddressList
        addresses={company?.shippingAddresses ?? []}
        editor={editor}
        onDelete={(id) => remove.mutate({ id })}
      />
      <div className="mt-4 space-y-2">
        <Input
          placeholder="Nume"
          value={newForm.name}
          onChange={(e) =>
            setNewForm((current) => ({ ...current, name: e.target.value }))
          }
        />
        <Input
          placeholder="Adresa"
          value={newForm.address}
          onChange={(e) =>
            setNewForm((current) => ({ ...current, address: e.target.value }))
          }
        />
        <Button text="Salveaza adresa" onClick={() => add.mutate(newForm)} />
      </div>
    </div>
  );
};

export default ShippingAddresses;
