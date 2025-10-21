// src/components/panel/publicador/modals/ModalLimiteServicios.tsx
import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  limite: number;
  motivo?: string;
};

const ModalLimiteServicios: React.FC<Props> = ({ isOpen, onClose, limite, motivo }) => {

  const handleGoToAvisos = () => {
    onClose();
  };

  const handleGoToHome = () => {
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleGoToHome}
      width="420px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-5">
        <FaExclamationTriangle className="text-yellow-500 text-4xl" />
        <h2 className="text-xl font-semibold text-gray-800">
          No puedes continuar
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {motivo || "Has alcanzado el número máximo de servicios activos que permite tu plan."}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Límite actual:</strong> {limite} servicio
          {limite > 1 ? "s" : ""}
        </p>

        <p className="text-xs text-gray-500">
          Para poder continuar, actualiza tu plan o elimina uno existente.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <CustomButton
            type="button"
            size="lg"
            text="Ir a mis Avisos"
            variant="primary"
            fontWeight={600}
            fontSize="14"
            onClick={handleGoToAvisos}
          />
          <CustomButton
            type="button"
            size="lg"
            text="Salir"
            variant="secondary"
            fontWeight={600}
            fontSize="14"
            onClick={handleGoToHome}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalLimiteServicios;
