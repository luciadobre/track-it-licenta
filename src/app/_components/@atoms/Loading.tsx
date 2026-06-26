const Loading = ({ message = "Se incarca" }: { message?: string }) => (
  <p className="animate-pulse text-sm text-text-secondary">{message}</p>
);

export default Loading;
