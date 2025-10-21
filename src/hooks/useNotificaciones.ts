import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

export interface TipoNotificacion {
  TINO_Codigo: number;
  TINO_Nombre: string;
  TINO_Descripcion?: string;
}

export interface UsuarioTipoNotificacion {
  UTNO_Id: number;
  USUA_Interno: string;
  TINO_Id: number;
  UTNO_Activo: boolean;
  TipoNotificacion?: TipoNotificacion;
}

export const useNotificaciones = () => {
  // Obtener todos los tipos de notificaciones disponibles
  const getTiposNotificaciones = async (
    callback?: (tipos: TipoNotificacion[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get(`/notificaciones/tipos`);
      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("Error al obtener tipos:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener configuraciones del usuario logueado
  const getNotificacionesUsuario = async (
    callback?: (notifs: UsuarioTipoNotificacion[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get(`/notificaciones/usuario`);
      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("Error al obtener notificaciones del usuario:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Actualizar estado de una notificación
  const updateEstadoNotificacion = async (
    tipoId: number,
    activo: boolean,
    callback?: (success: boolean, message: string) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put(`/notificaciones/usuario/${tipoId}`, {
        activo,
      });
      const { success, message } = response.data;

      if (callback) callback(success, message);
    } catch (error) {
      handleApiError(error);
      if (callback) callback(false, "Error al actualizar notificación");
    }
  };

  return {
    getTiposNotificaciones,
    getNotificacionesUsuario,
    updateEstadoNotificacion,
  };
};
