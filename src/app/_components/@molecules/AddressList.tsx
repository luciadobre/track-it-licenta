import Button from "../@atoms/Button";
import NoResults from "../@atoms/NoResults";
import AddressRowContent, { type AddressEditForm } from "./AddressRowContent";

type Address = { id: number; name: string; address: string };

export type AddressEditor = {
  editingId: number | null;
  form: AddressEditForm;
  start: (id: number, name: string, address: string) => void;
  change: (field: keyof AddressEditForm, value: string) => void;
  commit: () => void;
  cancel: () => void;
};

type AddressListProps = {
  addresses: Address[];
  editor: AddressEditor;
  onDelete: (id: number) => void;
};

const AddressList = ({ addresses, editor, onDelete }: AddressListProps) => {
  if (!addresses.length)
    return <NoResults message="Nu ai adrese de furnizor salvate." />;

  return (
    <div className="space-y-2">
      {addresses.map(({ id, name, address }) => (
        <div
          key={id}
          onDoubleClick={() => editor.start(id, name, address)}
          title="Dublu-clic ca sa editezi"
          className="bg-box-background-light border-border group flex items-start justify-between gap-3 rounded border p-2"
        >
          <AddressRowContent
            name={name}
            address={address}
            isEditing={editor.editingId === id}
            editForm={editor.form}
            onEditChange={editor.change}
            onCommit={editor.commit}
            onCancelEdit={editor.cancel}
          />
          <Button
            type="button"
            intent="textOnly"
            size="sm"
            text="x"
            title="Sterge adresa"
            onClick={() => onDelete(id)}
            className="text-fail-base hover:text-fail-light mt-0.5 shrink-0 opacity-0 group-hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
};

export default AddressList;
