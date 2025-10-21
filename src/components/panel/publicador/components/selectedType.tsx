// src/components/panel/publicador/SelectedType.tsx
import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FaUserTie, FaBuilding } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tipo: "independiente" | "empresa") => void;
};

const SelectedType: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="480px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col gap-6 w-full text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Elige cómo quieres publicar tu Huarique
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Define el tipo de perfil con el que deseas mostrarte en nuestra
          plataforma
        </p>
        <span className="font-semibold text-primary text-sm">
          ¿Prefieres la independencia o representar a una empresa?
        </span>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <CustomButton
            type="button"
            size="lg"
            text="Soy Independiente"
            variant="primary"
            fontWeight={600}
            fontSize="14"
            icon={<FaUserTie className="text-lg" />}
            onClick={() => onSelect("independiente")}
          />
          <CustomButton
            type="button"
            size="lg"
            text="Soy Empresa"
            variant="secondary"
            fontWeight={600}
            fontSize="14"
            icon={<FaBuilding className="text-lg" />}
            onClick={() => onSelect("empresa")}
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Tranquilo, siempre podrás actualizar esta configuración más adelante.
        </p>
      </div>
    </CustomModal>
  );
};

export default SelectedType;
