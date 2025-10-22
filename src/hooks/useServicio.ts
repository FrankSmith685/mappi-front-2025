import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type {
  ServicioResponse,
  ServicioData,
  CreateServicioRequest,
  ObtenerServicioResponse,
  ServicioActivoData,
  ObtenerServicioActivoResponse,
} from "../interfaces/IServicio";

import type {
  ObtenerServicioActivoResponseDetail,
  ServicioActivoDataDetail
} from "../interfaces/IServicioIDDetal";
import type { ObtenerServicioActivoChevereResponse, ServicioActivoDataChevere } from "../interfaces/IServicioPlanChevere";
import type { ObtenerServicioActivoPremiumResponse, ServicioActivoDataPremium } from "../interfaces/IServicioPremium";


export const useServicio = () => {

  const getServiciosUsuario = async (
    callback?: (success: boolean, message: string, servicios?: ServicioData[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<ObtenerServicioResponse>("/servicio/mis-servicios");
      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(true, message || "Servicios cargados correctamente", data);
      } else {
        callback?.(false, message || "No se encontraron servicios del usuario");
      }
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al obtener los servicios del usuario");
    }
  };

  const createServicio = async (
    data: CreateServicioRequest,
    callback?: (success: boolean, message: string, servicio?: ServicioData) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.post<ServicioResponse>("/servicio/create-servicio", data);
      const { success, message, data: servicio } = response.data;
      callback?.(success, message, servicio);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al crear el servicio");
    }
  };




  const archivarServicio = async (
    servicioIds: string | string[],
    archivado: boolean
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiWithAuth.put("/servicio/archivar", {
        servicioIds,
        archivado,
      });

      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      handleApiError(error);
      return {
        success: false,
        message: "Error al archivar/desarchivar el servicio",
      };
    }
  };

  const getServicioById = async (
    servicioId: string,
    callback?: (success: boolean, message: string, servicio?: ServicioData) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<ServicioResponse>(`/servicio/${servicioId}`);
      const { success, data, message } = response.data;
      callback?.(success, message || "Servicio obtenido correctamente", data);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al obtener el servicio");
    }
  };

  const updateServicio = async (
    servicioId: string,
    data: Partial<CreateServicioRequest>,
    callback?: (success: boolean, message: string, servicio?: ServicioData) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.put<ServicioResponse>(
        `/servicio/update-servicio/${servicioId}`,
        data
      );

      const { success, message, data: servicio } = response.data;
      callback?.(success, message, servicio);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al actualizar el servicio");
    }
  };

  const getServiciosActivos = async (
    callback?: (
      success: boolean,
      message: string,
      data?: { total: number; servicios: ServicioActivoData[] }
    ) => void
  ): Promise<void> => {
    try {
      const response = await api.get<ObtenerServicioActivoResponse>("/servicio/activos");
      const { success, data, message } = response.data;

      if (success && data) {
        callback?.(true, message || "Servicios activos obtenidos correctamente", data);
      } else {
        callback?.(false, message || "No se encontraron servicios activos");
      }
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al obtener los servicios activos");
    }
  };

    const getServicioActivoById = async (
      servicioId: string,
      callback?: (
        success: boolean,
        message: string,
        servicio?: ServicioActivoDataDetail
      ) => void
    ): Promise<void> => {
      try {
        const response = await api.get<ObtenerServicioActivoResponseDetail>(
          `/servicio/activo/${servicioId}`
        );
        const { success, message, data } = response.data;

        callback?.(success, message || "Servicio activo obtenido correctamente", data);
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al obtener el servicio activo");
      }
    };

    const getServiciosActivosChevere = async (
      callback?: (
        success: boolean,
        message: string,
        data?: ServicioActivoDataChevere[]
      ) => void
    ): Promise<void> => {
      try {
        const response = await api.get<ObtenerServicioActivoChevereResponse>(
          "/servicio/activos/chevere"
        );

        const { success, message, data } = response.data;

        if (success && data) {
          callback?.(true, message || "Servicios activos con plan Chévere obtenidos correctamente", data);
        } else {
          callback?.(false, message || "No se encontraron servicios con plan Chévere");
        }
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al obtener los servicios con plan Chévere");
      }
    };

    const getServiciosActivosPremium = async (
      callback?: (
        success: boolean,
        message: string,
        data?: ServicioActivoDataPremium[]
      ) => void
    ): Promise<void> => {
      try {
        const response = await api.get<ObtenerServicioActivoPremiumResponse>(
          "/servicio/activos/premium"
        );

        const { success, message, data } = response.data;

        if (success && data) {
          callback?.(true, message || "Servicios activos con plan Premium obtenidos correctamente", data);
        } else {
          callback?.(false, message || "No se encontraron servicios con plan Premium");
        }
      } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al obtener los servicios con plan Premium");
      }
    };





  return {
    createServicio,
    getServiciosUsuario,
    archivarServicio,
    getServicioById,
    updateServicio,
    getServiciosActivos,
    getServicioActivoById,
    getServiciosActivosChevere,
    getServiciosActivosPremium
  };
};
