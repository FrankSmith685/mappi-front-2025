/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import { FiMessageSquare } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../../config/firebase";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../../hooks/useNotificacionHooks/useNotification";
import { useAppState } from "../../../../hooks/useAppState";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalComentarioLogin: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginOrRegisterUser } = useAuth();
  const {setActiveInciarSesionResena, setModalResena, typeUserAuth } = useAppState();
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  /**
   * 🔹 Iniciar sesión o registrar con Google
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Datos a enviar al backend
      const data = {
        correo: String(user.email),
        contrasena: result.user.uid, // UID de Firebase como clave
        proveedor: "google" as const,
        nombre: user.displayName?.split(" ")[0] || "",
        apellido: user.displayName?.split(" ")[1] || "",
        type_user: typeUserAuth ? (typeUserAuth == 'comensal' ? 4 : 5 ) : 2
      };

      // Llamar al backend (unificado)
      await loginOrRegisterUser(data, (res) => {
        if (res.success) {
          showMessage("Sesión iniciada correctamente con Google", "success");
          setModalResena(true);
          onClose();
        } else {
          showMessage(res.message || "Error al iniciar sesión con Google", "error");
        }
      });
    } catch (error: any) {
      console.error("Error al iniciar/registrar con Google:", error);
      showMessage("No se pudo iniciar sesión con Google.", "error");
    }
  };

  const handleCorreoLogin=()=>{
    setActiveInciarSesionResena(true);
    navigate("/iniciar");
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      width="500px"
      height="auto"
      closable={false}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <FiMessageSquare className="text-primary text-4xl" />
        <h2 className="text-xl font-semibold text-gray-800">
          ¡Queremos saber tu opinión!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Nos encantaría conocer tu opinión. Inicia sesión para publicar tu reseña.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          {/* 🔹 Botón Google */}
          <div className="w-full">
            <CustomButton
              text="Iniciar Sesión con Google"
              type="button"
              fullWidth
              fontSize="14px"
              fontWeight={400}
              variant="warning"
              onClick={handleGoogleLogin}
            />
          </div>

          {/* 🔹 Botón Correo (puedes agregar un modal o redirección aquí) */}
          <div className="w-full">
            <CustomButton
              type="button"
              size="lg"
              text="Iniciar sesión con correo"
              variant="secondary"
              fontWeight={400}
              fontSize="14"
              onClick={handleCorreoLogin}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalComentarioLogin;
