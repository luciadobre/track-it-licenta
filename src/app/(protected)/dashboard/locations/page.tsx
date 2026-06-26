import { CreateLocation } from "~/app/_components/@molecules/CreateLocation";
import DynamicLocationCard from "~/app/_components/@molecules/DynamicLocationCard";

const CreateLocationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Locatii</h1>
        <p className="text-sm text-text-secondary">
          Vezi unde sunt articolele si cate sunt in fiecare loc.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-panel p-6">
        <h2 className="mb-4 text-lg font-semibold">Locatie noua</h2>
        <CreateLocation />
      </div>

      <DynamicLocationCard />
    </div>
  );
};

export default CreateLocationPage;
