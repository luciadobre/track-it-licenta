interface InputProps {
  value?: string;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  accept?: string;
  min?: number | string;
  max?: number | string;
  name?: string;
  className?: string;
  autoFocus?: boolean;
}

const Input = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  type = "text",
  accept,
  min,
  max,
  name,
  className = "",
  autoFocus = false,
}: InputProps) => (
  <div className={`flex flex-col ${className}`}>
    <div className="border-border bg-box-background-light focus-within:border-accent hover:bg-box-background-hover relative flex items-center rounded-md border px-3 py-2 transition-colors">
      <input
        type={type}
        name={name}
        accept={accept}
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="text-text-base placeholder:text-text-secondary w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  </div>
);

export default Input;
