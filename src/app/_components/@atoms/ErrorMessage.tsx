type ErrorMessageProps = {
  message: string;
  className?: string;
};

const ErrorMessage = ({ message, className = "" }: ErrorMessageProps) => (
  <p className={`text-fail-base text-sm ${className}`}>{message}</p>
);

export default ErrorMessage;
