import { FiHelpCircle } from "react-icons/fi";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="w-80 rounded-lg border border-border bg-panel p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <FiHelpCircle className="text-text-base mx-auto mb-3 text-4xl" />
        <h2 className="text-text-base mb-2 text-lg font-bold">Esti sigur?</h2>
        <p className="text-text-secondary mb-5 text-sm">{message}</p>
        <div className="flex justify-center gap-3">
          <Button
            text="Confirma"
            intent="secondary"
            size="md"
            onClick={onConfirm}
          />
          <Button
            text="Anuleaza"
            intent="primary"
            size="md"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
