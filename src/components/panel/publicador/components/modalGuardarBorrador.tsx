// src/components/panel/publicador/ModalGuardarBorrador.tsx
import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FaRegSave, FaSignOutAlt } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode?: "borrador" | "salir"; // 👈 nuevo
};

const ModalGuardarBorrador: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  mode = "borrador",
}) => {
  // 👇 definimos el contenido según el modo
  const config = {
    borrador: {
      icon: <FaRegSave className="text-blue-500 text-4xl" />,
      title: "¿Guardar como borrador?",
      description:
        "Puedes continuar editando más tarde desde la sección de Avisos.",
      confirmText: "Sí, guardar y salir",
    },
    salir: {
      icon: <FaSignOutAlt className="text-blue-500 text-4xl" />,
      title: "¿Salir sin guardar?",
      description:
        "Si sales ahora, se perderán los cambios no guardados. ¿Deseas continuar?",
      confirmText: "Sí, salir sin guardar",
    },
  }[mode];

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="400px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-5">
        {config.icon}
        <h2 className="text-xl font-semibold text-gray-800">{config.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{config.description}</p>

        <div className="flex flex-col gap-3 w-full mt-2">
          <CustomButton
            type="button"
            size="lg"
            text={config.confirmText}
            variant="primary"
            fontWeight={600}
            fontSize="14"
            onClick={onConfirm}
          />
          <CustomButton
            type="button"
            size="lg"
            text="Cancelar"
            variant="secondary-outline"
            fontWeight={600}
            fontSize="14"
            onClick={onClose}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalGuardarBorrador;
