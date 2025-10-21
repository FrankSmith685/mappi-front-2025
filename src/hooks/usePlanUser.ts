import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { PlanConProrrateo, PlanesConProrrateoResponse } from "../interfaces/IPlanes";
import type { CreatePlanUserRequest, PlanUserResponse, PlanUserData, PlanUserResponseCreate } from "../interfaces/IPlanUser";
// import { useAppState } from "./useAppState";

export const usePlanUser = () => {
//   const { setUserPlan } = useAppState();

  /**
   * 📘 Obtener el plan activo del usuario autenticado
   */
  const getPlanUser = async (
    callback?: (planes: PlanUserData[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<PlanUserResponse>("/planes-usuario/activos");
      const { success, data, message } = response.data;

      if (success && data && data.length > 0) {
        callback?.(data);
        // setUserPlan?.(data[0]); // 👉 si solo quieres guardar el primero
      } else {
        console.warn("No se encontraron planes activos:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * 🟢 Crear un nuevo plan de usuario (gratuito o de pago)
   */
  const createPlanUser = async (
    data: CreatePlanUserRequest,
    callback?: (success: boolean, message: string, plan?: PlanUserData) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.post<PlanUserResponseCreate>("/planes-usuario/create", data);
      const { success, message, data: plan } = response.data;
      callback?.(success, message, plan);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al crear el plan del usuario");
    }
  };

  const getPlanesConProrrateo = async (
    tipoUsuario = "independiente",
    callback?: (planes: PlanConProrrateo[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<PlanesConProrrateoResponse>(
        `/planes-usuario/planes-con-prorrateo`,
        { params: { tipo_usuario: tipoUsuario } }
      );

      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se pudieron obtener los planes con prorrateo:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAllPlanesUsuario = async (
    callback?: (planes: PlanUserData[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<PlanUserResponse>(
        "/planes-usuario"
      );
      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron planes:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    getPlanUser,
    createPlanUser,
    getPlanesConProrrateo,
    getAllPlanesUsuario
  };
};
