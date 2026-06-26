import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api, type RouterOutputs } from "~/trpc/react";
import ConfirmModal from "../../@atoms/ConfirmModal";
import Button from "../../@atoms/Button";
import Checkbox from "../../@atoms/Checkbox";

type ItemImageProps = { image: string | null; itemName: string };

const ItemImage = ({ image, itemName }: ItemImageProps) => {
  if (!image)
    return <span className="text-text-secondary text-xs">Nu are imagine</span>;
  const src = image.startsWith("data:image")
    ? image
    : `data:image/jpeg;base64,${image}`;
  return (
    <Image
      src={src}
      alt={itemName}
      width={80}
      height={80}
      className="h-full w-full object-cover"
      unoptimized
    />
  );
};

interface ItemCardProps {
  item: RouterOutputs["item"]["display"]["items"][number];
  selection: {
    active: boolean;
    selected: boolean;
    toggle: (itemId: number) => void;
  };
}

const ItemCard = ({ item, selection }: ItemCardProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const [isModalOpen, setModalOpen] = useState(false);
  const deleteItem = api.item.delete.useMutation({
    onSuccess: () => void utils.item.display.invalidate(),
    onError: (error) => alert(error.message),
  });

  return (
    <article className="border-border bg-panel relative flex flex-col gap-4 rounded-lg border p-4">
      {selection.active && (
        <Checkbox
          checked={selection.selected}
          onChange={() => selection.toggle(item.id)}
          className="absolute top-3 right-3"
        />
      )}

      <div className="flex gap-4">
        <div className="bg-box-background-light flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md">
          <ItemImage image={item.image} itemName={item.itemName} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{item.itemName}</h3>
          <p className="text-text-secondary line-clamp-2 text-sm">
            {item.description || "Nu are descriere"}
          </p>
          <p className={`mt-1 text-xs font-medium ${item.stockStatus.color}`}>
            {item.stockStatus.label}
          </p>
        </div>
      </div>

      <div className="text-text-secondary grid grid-cols-2 gap-2 text-xs">
        <p>Cod: {item.itemNumber}</p>
        <p>Pret: ${item.price.toFixed(2)}</p>
        <p>UM: {item.UOM}</p>
        <p>Cost: ${item.cost.toFixed(2)}</p>
        <p>Cantitate: {item.quantity}</p>
        <p>Timp livrare: {item.leadTime ?? 7} zile</p>
      </div>

      <div className="border-border text-text-secondary grid grid-cols-2 gap-2 border-t pt-3 text-xs">
        <p>Stoc siguranta: {item.safetyStock}</p>
        <p>Recomandare: {item.reorderPoint}</p>
        <p>Consum zilnic: {item.averageDailyDemand.toFixed(1)}</p>
        <p>Zile ramase: {item.daysLeft || "n/a"}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
          text="Editeaza"
          intent="secondary"
          className="flex-1"
        />
        <Button
          onClick={() => setModalOpen(true)}
          text="Sterge"
          intent="textOnly"
          className="flex-1"
        />
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => {
          deleteItem.mutate({ itemId: item.id });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
        message={`Stergi articolul "${item.itemName}"?`}
      />
    </article>
  );
};

export default ItemCard;
