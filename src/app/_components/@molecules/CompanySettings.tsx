"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import CompanyField from "./CompanyField";

type Field = "name" | "address" | "phone";

const LABELS: Record<Field, string> = {
  name: "Nume",
  address: "Adresa",
  phone: "Telefon",
};

const fields: Field[] = ["name", "address", "phone"];

const CompanySettings = () => {
  const { data: company, refetch } = api.company.getCompany.useQuery();
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  const save = api.company.createOrUpdateCompany.useMutation({
    onSuccess: async () => {
      await refetch();
      setEditingField(null);
    },
  });

  const startEdit = (field: Field) => {
    setEditingField(field);
    setFieldValue(company?.[field] ?? "");
  };

  const commit = () => {
    if (!editingField || !fieldValue.trim()) return;
    const data = {
      name: company?.name ?? "",
      address: company?.address ?? "",
      phone: company?.phone ?? "",
      [editingField]: fieldValue,
    };
    save.mutate(data);
  };

  return (
    <div className="rounded shadow">
      <h2 className="text-text-base mb-4 text-xl font-bold">
        Date firma
      </h2>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field} className="flex items-center gap-2">
            <span className="text-text-secondary w-20 text-sm">
              {LABELS[field]}:
            </span>
            <CompanyField
              value={company?.[field]}
              isEditing={editingField === field}
              editValue={fieldValue}
              onStartEdit={() => startEdit(field)}
              onEditChange={setFieldValue}
              onCommit={commit}
              onCancelEdit={() => setEditingField(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanySettings;
