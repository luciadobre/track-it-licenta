import { FaBoxOpen } from "react-icons/fa";

const NoResults = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-3 py-6 text-text-secondary">
    <FaBoxOpen className="text-3xl opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

export default NoResults;
