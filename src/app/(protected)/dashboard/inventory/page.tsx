import Button from "~/app/_components/@atoms/Button";
import ItemsDisplay from "~/app/_components/@organisms/ItemDisplay";

const InventoryPage = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventar</h1>
          <p className="text-sm text-text-secondary">
            Articolele si stocul, la zi.
          </p>
        </div>
        <Button
          size="lg"
          intent="primary"
          text="Adauga articol"
          redirectPath="/dashboard/create-item"
        />
      </div>
      <ItemsDisplay />
    </section>
  );
};

export default InventoryPage;
