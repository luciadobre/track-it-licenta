import Input from "../@atoms/Input";

type CompanyFieldProps = {
  value: string | undefined;
  isEditing: boolean;
  editValue: string;
  onStartEdit: () => void;
  onEditChange: (value: string) => void;
  onCommit: () => void;
  onCancelEdit: () => void;
};

const CompanyField = ({
  value,
  isEditing,
  editValue,
  onStartEdit,
  onEditChange,
  onCommit,
  onCancelEdit,
}: CompanyFieldProps) => {
  if (isEditing) {
    return (
      <Input
        autoFocus
        value={editValue}
        onChange={(e) => onEditChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit();
          if (e.key === "Escape") onCancelEdit();
        }}
        className="flex-1"
      />
    );
  }

  return (
    <span
      title="Dublu-clic ca sa editezi"
      onDoubleClick={onStartEdit}
      className={`hover:bg-box-background-light flex-1 cursor-text rounded px-2 py-1 ${
        value ? "text-text-base" : "text-text-secondary italic"
      }`}
    >
      {value ?? "-"}
    </span>
  );
};

export default CompanyField;
