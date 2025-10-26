import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  limite: number;
  motivo?: string;
  esEdicion?: boolean; // Indica si el aviso está siendo editado
};

const ModalLimiteServicios: React.FC<Props> = ({
  isOpen,
  onClose,
  limite,
  motivo,
  esEdicion = false,
}) => {
  const handleClose = () => {
    onClose();
  };

  //  Texto dinámico según si es edición o creación
  const titulo = esEdicion ? "Edición no disponible" : "No puedes continuar";
  const mensajePrincipal = motivo
    ? motivo
    : esEdicion
    ? "Tu plan actual ha alcanzado el límite máximo de publicaciones activas. Para editar este aviso, primero debes actualizar tu plan o liberar espacio desactivando otro aviso."
    : "Has alcanzado el número máximo de servicios activos que permite tu plan.";

  const mensajeSecundario = esEdicion
    ? "Puedes actualizar tu plan para obtener más espacio o editar tus avisos activos."
    : "Para poder continuar, actualiza tu plan o elimina uno existente.";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      width="420px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-5">
        <FaExclamationTriangle className="text-yellow-500 text-4xl" />
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>

        <p className="text-gray-600 text-sm leading-relaxed">{mensajePrincipal}</p>

        <p className="text-sm text-gray-700">
          <strong>Límite actual:</strong> {limite} servicio
          {limite > 1 ? "s" : ""}
        </p>

        <p className="text-xs text-gray-500">{mensajeSecundario}</p>

        <div className="flex flex-col gap-3 w-full">
          {/*  Si no está editando, mostramos el botón "Ir a mis Avisos" */}
          {!esEdicion && (
            <CustomButton
              type="button"
              size="lg"
              text="Ir a mis Avisos"
              variant="primary"
              fontWeight={600}
              fontSize="14"
              onClick={handleClose}
            />
          )}

          <CustomButton
            type="button"
            size="lg"
            text="Salir"
            variant="secondary"
            fontWeight={600}
            fontSize="14"
            onClick={handleClose}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalLimiteServicios;
