import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FaTrashAlt } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  avisoNombre?: string;
};

const ModalEliminarAviso: React.FC<Props> = ({ isOpen, onClose, onConfirm, avisoNombre }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="400px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <FaTrashAlt className="text-red-500 text-4xl" />
        <h2 className="text-xl font-semibold text-gray-800">
          Eliminar aviso
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          ¿Estás seguro de que deseas eliminar el aviso{" "}
          <span className="font-semibold text-gray-800">"{avisoNombre}"</span>?
        </p>

        <p className="text-xs text-gray-500">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <div className="w-full">
            <CustomButton
              type="button"
              size="lg"
              text="Cancelar"
              variant="secondary"
              fontWeight={600}
              fontSize="14"
              onClick={onClose}
              fullWidth={true}
            />
          </div>
          <div className="w-full">
            <CustomButton
              type="button"
              size="lg"
              text="Eliminar"
              variant="primary"
              fontWeight={600}
              fontSize="14"
              onClick={onConfirm}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalEliminarAviso;
