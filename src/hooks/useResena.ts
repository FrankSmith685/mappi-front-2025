/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

export interface DireccionData {
  DIUS_Direccion?: string;
  DIUS_Referencia?: string;
  DIUS_Latitud?: number | null;
  DIUS_Longitud?: number | null;
  DIUS_CodigoUbigeo?: string | null;
  DIUS_Predeterminada?: boolean;
}

export interface ServicioDataMinimal {
  SERV_Nombre?: string;
  SERV_Descripcion?: string;
  SERV_Estado?: boolean;
  SUBC_Id?: number;
  SERV_Abierto24h?: boolean;
  SERV_Archivado?: boolean;
  SERV_Delivery?: boolean;
  SERV_HoraInicio?: string;
  SERV_HoraFin?: string;
}

export interface CreateResenaRequest {
  RESE_Titulo: string;
  RESE_Texto: string;
  RESE_Rating: number;
  RESE_Anonimo?: boolean;
  SERV_Interno?: string;
  servicio?: ServicioDataMinimal; // si no existe el servicio
  direccion?: DireccionData;
  archivos?: File[];
}

export interface UpdateResenaRequest {
  RESE_Titulo?: string;
  RESE_Texto?: string;
  RESE_Rating?: number;
  RESE_Anonimo?: boolean;
  servicio?: { SERV_Nombre?: string; SERV_Descripcion?: string };
  archivos?: File[];
  eliminarArchivos?: number[];
}


export interface ResenaResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useResena = () => {
  const createResena = async (
    data: CreateResenaRequest,
    callback?: (success: boolean, message: string, resena?: any) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();

      // Campos básicos
      formData.append("RESE_Titulo", data.RESE_Titulo);
      formData.append("RESE_Texto", data.RESE_Texto);
      formData.append("RESE_Rating", String(data.RESE_Rating));
      formData.append("RESE_Anonimo", String(data.RESE_Anonimo ?? false));

      // Si ya existe el servicio
      if (data.SERV_Interno) {
        formData.append("SERV_Interno", data.SERV_Interno);
      }

      // Si el servicio es nuevo (se envía plano)
      if (data.servicio) {
        if (data.servicio.SERV_Nombre)
          formData.append("SERV_Nombre", data.servicio.SERV_Nombre);
        if (data.servicio.SERV_Descripcion)
          formData.append("SERV_Descripcion", data.servicio.SERV_Descripcion);
      }

      // Si hay dirección
      if (data.direccion) {
        if (data.direccion.DIUS_Direccion)
          formData.append("DIUS_Direccion", data.direccion.DIUS_Direccion);
        if (data.direccion.DIUS_Referencia)
          formData.append("DIUS_Referencia", data.direccion.DIUS_Referencia);
        if (data.direccion.DIUS_Latitud !== undefined)
          formData.append("DIUS_Latitud", String(data.direccion.DIUS_Latitud));
        if (data.direccion.DIUS_Longitud !== undefined)
          formData.append("DIUS_Longitud", String(data.direccion.DIUS_Longitud));
        if (data.direccion.DIUS_CodigoUbigeo)
          formData.append("DIUS_CodigoUbigeo", data.direccion.DIUS_CodigoUbigeo);
      }

      // Archivos
      if (data.archivos && data.archivos.length > 0) {
        data.archivos.forEach((file) => {
          formData.append("archivos", file);
        });
      }

      // Enviar al backend
      const response = await apiWithAuth.post<ResenaResponse>(
        "/resena/create-resena",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { success, message, data: resena } = response.data;
      callback?.(success, message, resena);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al crear la reseña");
    }
  };

  const updateResena = async (
    reseñaId: number,
    data: UpdateResenaRequest,
    callback?: (success: boolean, message: string) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();

      // Campos básicos
      if (data.RESE_Titulo)
        formData.append("RESE_Titulo", data.RESE_Titulo);
      if (data.RESE_Texto)
        formData.append("RESE_Texto", data.RESE_Texto);
      if (data.RESE_Rating !== undefined)
        formData.append("RESE_Rating", String(data.RESE_Rating));
      if (data.RESE_Anonimo !== undefined)
        formData.append("RESE_Anonimo", String(data.RESE_Anonimo));

      // Servicio (solo si se envía)
      if (data.servicio) {
        Object.entries(data.servicio).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(`servicio[${key}]`, String(value));
          }
        });
      }

      // Archivos nuevos
      if (data.archivos?.length) {
        data.archivos.forEach((file) => formData.append("archivos", file));
      }

      // Archivos a eliminar (IDs)
      if (data.eliminarArchivos?.length) {
        formData.append("eliminarArchivos", JSON.stringify(data.eliminarArchivos));
      }

      // Enviar petición PUT
      const response = await apiWithAuth.put<ResenaResponse>(
        `/resena/update-resena/${reseñaId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { success, message } = response.data;
      callback?.(success, message);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al actualizar la reseña");
    }
  };

  return { createResena, updateResena };
};
