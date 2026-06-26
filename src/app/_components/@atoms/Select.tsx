export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

const Select = ({
  options,
  value,
  onChange,
  label,
  error,
  className = "",
}: SelectProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-text-base mb-1 text-sm font-medium">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-box-background-light px-3 py-2 text-sm text-text-base focus:border-accent focus:outline-none"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-fail-base mt-1 text-xs">{error}</span>}
    </div>
  );
};

export default Select;
