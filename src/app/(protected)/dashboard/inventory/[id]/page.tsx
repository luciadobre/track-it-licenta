import Link from "next/link";
import { api } from "~/trpc/server";
import { CreateItem } from "~/app/_components/@organisms/CreateItem";

const ItemEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const item = await api.item.getById({ itemId: parseInt(id) });

  if (!item) return <p className="text-text-secondary">Articol negasit.</p>;

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/inventory"
        className="text-text-secondary hover:text-text-base inline-flex items-center gap-1 text-sm"
      >
        {"<- Inapoi la inventar"}
      </Link>
      <CreateItem init={{ ...item, image: item.image ?? undefined }} />
    </div>
  );
};

export default ItemEditPage;
