interface IconButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({
  label,
  type = "button",
  disabled,
  className = "",
  children,
  onClick,
}: IconButtonProps) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`bg-accent text-text-primary hover:bg-primary-light flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export default IconButton;
