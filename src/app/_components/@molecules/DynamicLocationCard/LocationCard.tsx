"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Button from "../../@atoms/Button";
import ConfirmModal from "../../@atoms/ConfirmModal";
import Select from "../../@atoms/Select";
import LocationItemList from "./LocationItemList";

const LocationCard = () => {
  const utils = api.useUtils();
  const { data: locations } = api.location.getAll.useQuery();
  const { data: itemOptions = [] } = api.item.options.useQuery();
  const [confirm, setConfirm] = useState<{
    locationId: number;
    name: string;
  } | null>(null);

  const refresh = () => void utils.location.getAll.invalidate();

  const addItem = api.location.addItem.useMutation({ onSuccess: refresh });
  const deleteLocation = api.location.delete.useMutation({
    onSuccess: () => {
      refresh();
      setConfirm(null);
    },
  });
  const updateQty = api.location.updateItemQuantity.useMutation({
    onSuccess: refresh,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Locatii salvate</h2>
        <Button
          type="button"
          intent="textOnly"
          size="sm"
          text="Actualizeaza"
          onClick={refresh}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {locations?.map(({ id, name, address, itemLocations }) => (
          <div
            key={id}
            className="border-border bg-panel relative flex w-full flex-col justify-between rounded-lg border p-4"
          >
            <Button
              type="button"
              intent="textOnly"
              size="sm"
              text="x"
              title="Sterge locatia"
              onClick={() => setConfirm({ locationId: id, name })}
              className="text-fail-base hover:text-fail-light absolute top-2 right-2 text-xl"
            />

            <div>
              <div className="mb-2 text-xl font-semibold">{name}</div>
              <p className="text-text-secondary wrap-break-word">{address}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Articole</h3>
                <LocationItemList
                  itemLocations={itemLocations}
                  onUpdateQty={(itemId, quantity) =>
                    updateQty.mutate({ locationId: id, itemId, quantity })
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <Select
                value=""
                options={itemOptions}
                onChange={(itemId) =>
                  itemId && addItem.mutate({ locationId: id, itemId: +itemId })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        message={`Stergi locatia "${confirm?.name}"?`}
        onConfirm={() =>
          confirm && deleteLocation.mutate({ locationId: confirm.locationId })
        }
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default LocationCard;
