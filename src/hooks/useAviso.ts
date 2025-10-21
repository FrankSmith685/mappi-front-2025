/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { AvisoRequest, AvisoResponse, AvisosDTO, GetAvisosResponse } from "../interfaces/IAviso";

export const useAviso = () => {
  
  const createAviso = async (
    data: AvisoRequest,
    callback?: (success: boolean, message: string, data?: any) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.post<AvisoResponse>(
        "/aviso/create-aviso",
        data
      );

      const { success, message, data: avisoData } = response.data;

      if (callback) callback(success, message, avisoData);
    } catch (error) {
      handleApiError(error);
      if (callback) callback(false, "Error al crear el aviso");
    }
  };

    const getAvisos = async (
      callback?: (
        success: boolean,
        message: string,
        data?: AvisosDTO
      ) => void
    ): Promise<void> => {
      try {
        const response = await apiWithAuth.get<GetAvisosResponse>(
          "/aviso/obtener-avisos"
        );

        const { success, message, data } = response.data;

        if (callback) callback(success, message, data);
      } catch (error) {
        handleApiError(error);
        if (callback) callback(false, "Error al obtener los avisos");
      }
    };

    const updateAviso = async (
      id: number,
      data: Partial<AvisoRequest>,
      callback?: (success: boolean, message: string, data?: any) => void
    ): Promise<void> => {
      try {
        const response = await apiWithAuth.put<AvisoResponse>(
          `/aviso/update-aviso/${id}`,
          data
        );
        const { success, message, data: avisoActualizado } = response.data;
        callback?.(success, message, avisoActualizado);
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al actualizar el aviso");
      }
    };

    const deleteAviso = async (
      id: number,
      callback?: (success: boolean, message: string) => void
    ): Promise<void> => {
      try {
        const response = await apiWithAuth.delete<{ success: boolean; message: string }>(
          `/aviso/delete-aviso/${id}`
        );

        const { success, message } = response.data;
        callback?.(success, message);
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al eliminar el aviso");
      }
    };




  return {
    createAviso,
    getAvisos,
    updateAviso,
    deleteAviso
  };
};
