type StockChangeItem = {
  id: number;
  oldQuantity: number;
  newQuantity: number;
  changedAt: Date;
  item: { itemName: string };
};

type Props = { change: StockChangeItem };

const movement = (isIncrease: boolean) => {
  if (isIncrease) {
    return {
      border: "border-l-success-base",
      color: "text-success-base",
      label: "reaprovizionare",
      sign: "+",
    };
  }

  return {
    border: "border-l-fail-base",
    color: "text-fail-base",
    label: "vanzare",
    sign: "-",
  };
};

const StockChangeRow = ({ change }: Props) => {
  const delta = Math.abs(change.newQuantity - change.oldQuantity);
  const style = movement(change.newQuantity > change.oldQuantity);

  return (
    <div
      className={`bg-panel flex items-center justify-between rounded-md border-l-4 p-4 shadow-sm ${style.border}`}
    >
      <div>
        <div className="text-text-base font-medium">{change.item.itemName}</div>
        <div className={`text-sm font-medium ${style.color}`}>
          {style.sign}
          {delta} &middot; {style.label}
        </div>
      </div>
      <div className="text-text-secondary text-sm">
        {new Date(change.changedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default StockChangeRow;
