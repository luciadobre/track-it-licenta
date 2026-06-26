"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Button from "../../@atoms/Button";
import Input from "../../@atoms/Input";
import GoogleMap from "../GoogleMap";

type LocationForm = { name: string; address: string; items: [] };

const emptyForm: LocationForm = { name: "", address: "", items: [] };

export function CreateLocation() {
  const utils = api.useUtils();
  const [form, setForm] = useState(emptyForm);
  const [showMap, setShowMap] = useState(false);

  const createLocation = api.location.create.useMutation({
    onSuccess: async () => {
      await utils.location.getAll.invalidate();
      await utils.location.options.invalidate();
      setForm(emptyForm);
      setShowMap(false);
    },
    onError: (error) => alert(error.message),
  });

  const set = (patch: Partial<LocationForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    createLocation.mutate(form);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 p-4">
      <Input
        value={form.name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="Nume locatie"
      />
      <div className="flex gap-2">
        <Input
          value={form.address}
          onChange={(e) => set({ address: e.target.value })}
          placeholder="Adresa"
          className="flex-1"
        />
        <Button
          type="button"
          intent="secondary"
          text={showMap ? "Ascunde harta" : "Alege pe harta"}
          onClick={() => setShowMap((value) => !value)}
        />
      </div>
      {showMap && <GoogleMap onSelectAddress={(address) => set({ address })} />}
      <Button
        type="submit"
        disabled={createLocation.isPending}
        text={createLocation.isPending ? "Se salveaza..." : "Adauga locatia"}
      />
    </form>
  );
}
