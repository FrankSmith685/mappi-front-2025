import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FiMessageSquare } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalOpinion: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="400px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <FiMessageSquare className="text-purple-600 text-4xl" />
        <h2 className="text-xl font-semibold text-gray-800">
          ¡Queremos saber tu opinión!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Nos encantaría conocer tu opinión. Inicia sesión para publicar tu reseña.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <div className="w-full">
            <CustomButton
              type="button"
              size="lg"
              text="Iniciar sesión con Google"
              variant="primary"
              fontWeight={600}
              fontSize="14"
              onClick={() => {
                /* lógica de login con Google */
              }}
              fullWidth={true}
            />
          </div>
          <div className="w-full">
            <CustomButton
              type="button"
              size="lg"
              text="Iniciar sesión con correo"
              variant="secondary"
              fontWeight={600}
              fontSize="14"
              onClick={() => {
                /* lógica de login con correo */
              }}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalOpinion;
