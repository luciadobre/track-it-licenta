import Input from "../@atoms/Input";

export type AddressEditForm = { name: string; address: string };

type AddressRowContentProps = {
  name: string;
  address: string;
  isEditing: boolean;
  editForm: AddressEditForm;
  onEditChange: (field: keyof AddressEditForm, value: string) => void;
  onCommit: () => void;
  onCancelEdit: () => void;
};

const AddressRowContent = ({
  name,
  address,
  isEditing,
  editForm,
  onEditChange,
  onCommit,
  onCancelEdit,
}: AddressRowContentProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-1 flex-col gap-2">
        <Input
          autoFocus
          value={editForm.name}
          onChange={(e) => onEditChange("name", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onCancelEdit();
          }}
          placeholder="Nume"
        />
        <Input
          value={editForm.address}
          onChange={(e) => onEditChange("address", e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            if (e.key === "Escape") onCancelEdit();
          }}
          placeholder="Adresa"
        />
      </div>
    );
  }

  return (
    <p className="text-text-base flex-1 cursor-text">
      <strong>{name}:</strong> {address}
    </p>
  );
};

export default AddressRowContent;
