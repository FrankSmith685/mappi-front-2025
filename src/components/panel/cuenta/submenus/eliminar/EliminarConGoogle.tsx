/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CustomButton } from "../../../../ui/CustomButton";
import { useUser } from "../../../../../hooks/useUser";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { useAuth } from "../../../../../hooks/useAuth";
import { getAuth, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";

const EliminarConGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteOwnAccountGoogle } = useUser();
  const { showMessage } = useNotification();
  const { logout } = useAuth();
  const auth = getAuth();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!auth.currentUser) {
        showMessage("No hay usuario autenticado", "error");
        return;
      }
      
      const provider = new GoogleAuthProvider();
      const result = await reauthenticateWithPopup(auth.currentUser, provider);
      const idToken = await result.user.uid;
      await deleteOwnAccountGoogle(idToken, (success: boolean, message?: string) => {
        if (success) {
          showMessage(message || "Cuenta eliminada correctamente", "success");
          logout();
        } else {
          showMessage(message || "Error al eliminar la cuenta", "error");
        }
      });

    } catch (error: any) {
      console.error("Error en reautenticación/eliminación:", error);
      showMessage("Error al confirmar con Google", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] space-y-4">
      <p className="text-sm text-gray-700">
        Al eliminar tu cuenta de mappi, se eliminará tu perfil y todos los datos de tus actividades.
      </p>
      <p className="text-sm text-gray-700 mt-2">
        Como tu cuenta está vinculada con Google, debes confirmar la acción antes de continuar.
      </p>

      <CustomButton
        text="Eliminar Cuenta con Google"
        type="button"
        fullWidth
        fontSize="14px"
        variant="warning-outline"
        disabled={isLoading}
        onClick={handleDelete}
      />
    </div>
  );
};

export default EliminarConGoogle;
