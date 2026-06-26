interface TextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  name?: string;
}

const Textarea = ({
  value,
  onChange,
  placeholder = "",
  label,
  error,
  className = "",
  name,
}: TextareaProps) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1 text-sm">{label}</label>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-24 w-full rounded-md border border-border bg-box-background-light px-3 py-2 text-sm text-text-base placeholder:text-text-secondary focus:border-accent focus:outline-none"
    />
    {error && <span className="mt-1 text-xs text-fail-base">{error}</span>}
  </div>
);

export default Textarea;
