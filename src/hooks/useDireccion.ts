import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type {
  DireccionAttributes,
  DireccionRequest,
} from "../interfaces/IDireccion";

interface DireccionResponse {
  success: boolean;
  message: string;
  data?: DireccionAttributes;
}

export const useDireccion = () => {

    const createDireccion = async (
        data: DireccionRequest,
        callback?: (success: boolean, message: string, direccion?: DireccionAttributes) => void
    ): Promise<void> => {
        try {
        const response = await apiWithAuth.post<DireccionResponse>("/direcciones/create", data);
        const { success, message } = response.data;

        callback?.(success, message);
        } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al crear la dirección");
        }
    };

    const getDireccionByEntidad = async (
      tipo_entidad: string,
      cod_entidad: string,
      callback?: (
        success: boolean,
        message: string,
        direccion?: DireccionAttributes
      ) => void
    ): Promise<void> => {
      try {
        const response = await apiWithAuth.get<DireccionResponse>(
          `/direcciones/${tipo_entidad}/${cod_entidad}`
        );

        const { success, message, data } = response.data;
        callback?.(success, message, data);
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al obtener la dirección");
      }
    };

    const updateDireccion = async (
      data: Partial<DireccionRequest>,
      callback?: (success: boolean, message: string, direccion?: DireccionAttributes) => void
    ): Promise<void> => {
      try {
        const response = await apiWithAuth.put<DireccionResponse>("/direcciones/update", data);
        const { success, message, data: direccion } = response.data;
        callback?.(success, message, direccion);
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al actualizar la dirección");
      }
    };

  return {
    createDireccion,
    getDireccionByEntidad,
    updateDireccion
  };
};
