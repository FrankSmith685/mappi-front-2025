/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { PlanResponse } from "../interfaces/IPlanes";

export const usePlanes = () => {

  const getTodosLosPlanes = async (
    callback?: (success: boolean, message: string, data?: any) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<PlanResponse>("/planes/obtener-planes");

      const { success, message, data } = response.data;

      if (callback) callback(success, message, data);
    } catch (error) {
      handleApiError(error);
      if (callback) callback(false, "Error al obtener todos los planes");
    }
  };

  const getPlanesPorTipo = async (
    tipo: "empresa" | "independiente",
    callback?: (success: boolean, message: string, data?: any) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<PlanResponse>(
        `/planes/obtener-planes?tipo=${tipo}`
      );

      const { success, message, data } = response.data;

      if (callback) callback(success, message, data);
    } catch (error) {
      handleApiError(error);
      if (callback) callback(false, `Error al obtener los planes de tipo ${tipo}`);
    }
  };

  return {
    getTodosLosPlanes,
    getPlanesPorTipo,
  };
};
