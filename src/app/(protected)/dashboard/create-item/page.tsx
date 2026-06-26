import Link from "next/link";
import { CreateItem } from "~/app/_components/@organisms/CreateItem";

const CreateItemPage = async () => {
  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/inventory"
        className="text-text-secondary hover:text-text-base inline-flex items-center gap-1 text-sm"
      >
        {"<- Inapoi la inventar"}
      </Link>
      <CreateItem />
    </div>
  );
};

export default CreateItemPage;
