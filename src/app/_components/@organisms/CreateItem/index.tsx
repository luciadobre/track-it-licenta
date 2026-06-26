"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAutorenew } from "react-icons/md";
import Image from "next/image";
import { skipToken } from "@tanstack/react-query";
import { api } from "~/trpc/react";
import Button from "../../@atoms/Button";
import IconButton from "../../@atoms/IconButton";
import Input from "../../@atoms/Input";
import ItemQRCode from "../ItemDisplay/ItemQRCode";
import FormSection from "./FormSection";
import FormField from "./FormField";
import { type ItemData, type FormState } from "./types";
import {
  createInitialFormState,
  convertFileToBase64,
} from "./utils";

interface CreateItemProps {
  init?: ItemData;
}

export function CreateItem({ init }: CreateItemProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(createInitialFormState(init));
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: locationOptions } = api.location.options.useQuery();
  const { refetch: fetchNextItemNumber } = api.item.getNextItemNumber.useQuery(skipToken);
  const create = api.item.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setForm(createInitialFormState());
    },
  });
  const update = api.item.update.useMutation({
    onSuccess: () => router.refresh(),
  });

  const autoGenerateItemNumber = async () => {
    const { data } = await fetchNextItemNumber();
    if (data !== undefined) setForm((prev) => ({ ...prev, itemNumber: String(data) }));
  };

  const optInt = (s: string) => (s !== "" ? parseInt(s, 10) : undefined);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let image = init?.image ?? "";
    if (imageFile) image = await convertFileToBase64(imageFile);

    const data = {
      itemNumber: form.itemNumber,
      itemName: form.itemName,
      UOM: form.UOM,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      quantity: parseInt(form.quantity, 10),
      description: form.description,
      locationId: optInt(form.locationId),
      leadTime: optInt(form.leadTime),
      image,
    };

    if (init?.id) {
      update.mutate({ ...data, id: init.id });
    } else {
      create.mutate(data);
    }
  };

  const isPending = create.isPending || update.isPending;
  const isEditMode = Boolean(init);
  const control = { form, setForm };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="border-border bg-panel rounded-lg border p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">
              {isEditMode ? "Editeaza articolul" : "Articol nou"}
            </h2>
            <p className="text-text-secondary mt-2 text-sm">
              {isEditMode
                ? "Modifica datele articolului."
                : "Adauga datele de baza, stocul si imaginea."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <FormSection title="Date articol">
              <div className="flex gap-4">
                <div className="w-full space-y-4">
                  <div>
                    <label className="text-text-base mb-2 block text-sm font-medium">
                      Cod articol <span className="text-fail-base">*</span>
                    </label>
                    <div className="flex gap-3">
                      <Input
                        name="itemNumber"
                        placeholder="Cod articol"
                        value={form.itemNumber}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            itemNumber: e.target.value,
                          }))
                        }
                      />
                      {!isEditMode && (
                        <IconButton
                          type="button"
                          label="Genereaza cod"
                          onClick={autoGenerateItemNumber}
                        >
                          <MdAutorenew className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />
                        </IconButton>
                      )}
                    </div>
                  </div>
                  <FormField
                    label="Nume articol"
                    field="itemName"
                    control={control}
                    placeholder="Nume articol"
                    required
                  />
                </div>
                {init?.image && (
                  <div className="shrink-0 pt-9">
                    <div className="border-border bg-box-background-light relative h-32 w-32 overflow-hidden rounded-md border">
                      <Image
                        src={init.image}
                        alt="Previzualizare"
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="Preturi si unitate">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  label="Unitate de masura"
                  field="UOM"
                  control={control}
                  placeholder="ex: buc, kg, lb"
                  required
                />
                <FormField
                  label="Pret"
                  field="price"
                  control={control}
                  type="number"
                  placeholder="0.00"
                  required
                />
                <FormField
                  label="Cost"
                  field="cost"
                  control={control}
                  type="number"
                  placeholder="0.00"
                  required
                />
              </div>
            </FormSection>

            <FormSection title="Stoc si livrare">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  label="Cantitate"
                  field="quantity"
                  control={control}
                  type="number"
                  placeholder="0"
                  required
                />
                <FormField
                  label="Locatie"
                  field="locationId"
                  control={control}
                  placeholder="Alege locatia"
                  select
                  options={locationOptions}
                />
                <FormField
                  label="Termen de livrare (zile)"
                  field="leadTime"
                  control={control}
                  type="number"
                  placeholder="ex: 3"
                />
              </div>
            </FormSection>

            <FormSection title="Detalii">
              <FormField
                label="Descriere"
                field="description"
                control={control}
                placeholder="Descriere scurta"
                textarea
              />
            </FormSection>

            <FormSection title="Imagine">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </FormSection>

            {isEditMode && init?.id && (
              <FormSection title="Cod QR">
                <div className="flex justify-center rounded-lg bg-white p-6">
                  <ItemQRCode itemId={init.id} />
                </div>
              </FormSection>
            )}

            <Button
              type="submit"
              text={isEditMode ? "Salveaza articolul" : "Adauga articol"}
              disabled={isPending}
              className="w-full"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
