"use client";
import { useRouter } from "next/navigation";

const baseStyle =
  "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

const intentStyles = {
  primary: "bg-accent text-text-primary hover:bg-primary-light",
  "primary-light":
    "w-full justify-start text-text-secondary hover:bg-box-background-hover hover:text-text-base",
  secondary:
    "border border-border bg-box-background-light text-text-base hover:border-accent",
  textOnly: "bg-transparent text-text-secondary hover:text-text-base",
  gradient: "bg-accent text-text-primary hover:bg-primary-light",
};

const sizeStyles = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-2.5",
};

const animationStyles = {
  hoverScale: "hover:-translate-y-0.5",
  hoverBrightness: "hover:brightness-110",
  hoverAnimation: "hover:-translate-y-0.5",
  "hoverAnimation-light": "",
  none: "",
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  intent?: "primary" | "primary-light" | "secondary" | "textOnly" | "gradient";
  size?: "sm" | "md" | "lg";
  animation?:
    | "hoverScale"
    | "hoverBrightness"
    | "hoverAnimation"
    | "hoverAnimation-light"
    | "none";
  redirectPath?: string;
}

const Button = ({
  className,
  intent = "primary",
  size = "md",
  animation = "none",
  text,
  redirectPath,
  onClick,
  ...rest
}: ButtonProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (redirectPath) {
      e.preventDefault();
      router.push(redirectPath);
    }
    // Allow custom onClick to still fire
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={[
        baseStyle,
        intentStyles[intent],
        sizeStyles[size],
        animationStyles[animation],
        className,
      ].join(" ")}
      {...rest}
    >
      <span className="relative">{text}</span>
    </button>
  );
};

export default Button;
