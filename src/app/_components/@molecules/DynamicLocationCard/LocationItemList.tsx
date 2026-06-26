import Input from "../../@atoms/Input";
import NoResults from "../../@atoms/NoResults";

type ItemLocationEntry = {
  id: number;
  item: { id: number; itemName: string };
  quantity: number;
  available: number;
};

type LocationItemListProps = {
  itemLocations: ItemLocationEntry[];
  onUpdateQty: (itemId: number, quantity: number) => void;
};

const LocationItemList = ({
  itemLocations,
  onUpdateQty,
}: LocationItemListProps) => {
  if (!itemLocations.length)
    return <NoResults message="Nu sunt articole in locatia asta." />;

  const updateQuantity = (
    event: React.FocusEvent<HTMLInputElement>,
    itemId: number,
    available: number,
  ) => {
    const typedValue = Number(event.target.value);
    let quantity = typedValue;

    if (Number.isNaN(quantity) || quantity < 0) {
      quantity = 0;
    }

    if (quantity > available) {
      quantity = available;
      event.target.value = String(available);
    }

    onUpdateQty(itemId, quantity);
  };

  return (
    <>
      {itemLocations.map(({ id: ilId, item, quantity, available }) => (
        <div
          key={ilId}
          className="mb-2 flex items-center justify-between gap-3"
        >
          <span>
            {item.itemName}
            <span className="text-text-secondary ml-1 text-xs">
              ({available} disponibile)
            </span>
          </span>
          <Input
            type="number"
            min={0}
            max={available}
            defaultValue={quantity}
            placeholder=""
            onBlur={(event) => updateQuantity(event, item.id, available)}
            className="w-24"
          />
        </div>
      ))}
    </>
  );
};

export default LocationItemList;
