import React from "react";
import CustomModal from "../../ui/CustomModal";

type ModalSinServiciosProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: "nearby" | "department" | "all"; //  nuevo prop
};

const ModalSinServicios: React.FC<ModalSinServiciosProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = "nearby",
}) => {
  let title = "No hay servicios disponibles";
  let message = "";
  let confirmText = "";

  switch (type) {
    case "nearby":
      title = "No hay servicios cercanos";
      message =
        "No encontramos servicios de esta categoría cerca de tu ubicación.\n¿Deseas ver los servicios del departamento completo?";
      confirmText = "Sí, mostrar del departamento";
      break;

    case "department":
      title = "No hay servicios en este departamento";
      message =
        "No encontramos servicios activos en este departamento.\n¿Deseas ver todos los servicios disponibles?";
      confirmText = "Sí, mostrar todos";
      break;

    case "all":
      title = "No hay servicios disponibles";
      message =
        "Actualmente no se encontraron servicios activos.\nPor favor, intenta más tarde.";
      confirmText = "Cerrar";
      break;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="420px"
      height="auto"
      mainClassName="!justify-center !items-center bg-white rounded-2xl"
      containerClassName="!p-8 !text-center"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 text-sm mb-6 whitespace-pre-line">{message}</p>

      <div className="flex justify-center gap-3">
        {type !== "all" && (
          <button
            onClick={onConfirm}
            className="bg-primary text-white px-5 py-2 rounded-md font-medium hover:bg-primary/90 transition-all"
          >
            {confirmText}
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition-all"
        >
          {type === "all" ? "Aceptar" : "No"}
        </button>
      </div>
    </CustomModal>
  );
};

export default ModalSinServicios;
