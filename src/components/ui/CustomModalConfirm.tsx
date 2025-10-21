import CustomModal from "./CustomModal";
import { CustomButton } from "./CustomButton";
import type { FC, ReactNode } from "react";

interface CustomModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  children?: ReactNode;
}


export const CustomModalConfirm: FC<CustomModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  children,
}) => {

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} width="400px" height="auto" containerClassName="!p-0 h-full flex items-center justify-center">
        <div className="flex flex-col space-y-4 items-center w-full text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>

            {children}

            <div className="flex gap-4">
            <CustomButton
                type="button"
                text={cancelText}
                variant="primary-outline"
                size="md"
                onClick={onClose}
            />
            <CustomButton
                type="button"
                text={confirmText}
                variant="primary"
                size="md"
                onClick={onConfirm}
                loading={loading}
            />
            </div>
        </div>
    </CustomModal>
  );
};
