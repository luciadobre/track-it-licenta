import Input from "../../@atoms/Input";
import Textarea from "../../@atoms/Textarea";
import Select, { type Option } from "../../@atoms/Select";
import type { FormState } from "./types";

export type FormControl = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

interface FormFieldProps {
  label: string;
  field: keyof FormState;
  control: FormControl;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  select?: boolean;
  options?: Option[];
}

export default function FormField({
  label,
  field,
  control,
  type = "text",
  placeholder,
  required,
  textarea,
  select,
  options,
}: FormFieldProps) {
  const value = control.form[field];
  const setValue = (value: string) =>
    control.setForm((current) => ({ ...current, [field]: value }));

  if (select) {
    return (
      <div>
        <label className="text-text-base mb-2 block text-sm font-medium">
          {label} {required && <span className="text-fail-base">*</span>}
        </label>
        <Select
          value={value}
          onChange={setValue}
          options={
            options ?? [{ label: placeholder ?? "Alege...", value: "" }]
          }
        />
      </div>
    );
  }

  const Component = textarea ? Textarea : Input;
  return (
    <div>
      <label className="text-text-base mb-2 block text-sm font-medium">
        {label} {required && <span className="text-fail-base">*</span>}
      </label>
      <Component
        name={field}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setValue(e.target.value)}
      />
    </div>
  );
}
