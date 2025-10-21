/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { DepartamentosActivosResponse } from "../interfaces/IDepartamentosActivos";
// import { cleanUbigeoParts } from "../helpers/normalizeString";
import type { UbigeoResponse } from "../interfaces/IUbigeos";

export const useUbigeo = () => {

  // Obtener Departamentos
  const getDepartamentos = async (
    callback?: (departamentos: string[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<UbigeoResponse>("/ubigeos/departamentos");
      const { data, success } = response.data;
      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron departamentos.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener Provincias de un departamento
  const getProvincias = async (
    departamento: string,
    callback?: (provincias: string[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<UbigeoResponse>(`/ubigeos/provincias/${departamento}`);
      const { data, success } = response.data;
      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron provincias.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener Distritos de una provincia
  const getDistritos = async (
    departamento: string,
    provincia: string,
    callback?: (distritos: string[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<UbigeoResponse>(`/ubigeos/distritos/${departamento}/${provincia}`);
      const { data, success } = response.data;
      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron distritos.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener Ubigeo por coordenadas
  const getUbigeoByCoords = async (
    lat: number,
    lng: number,
    onSuccess?: (dep: string, prov: string, dist: string, direccion?: string) => void,
    onError?: (error: any) => void
  ): Promise<void> => {
    try {
      const response = await api.get(`/ubigeos/obtener-ubigeo-por-coordenadas`, {
        params: { lat, lng },
      });

      const { data, success } = response.data;

      if (success && data) {
        onSuccess?.(data.dep, data.prov, data.dist, data.direccion);
      } else {
        console.warn("No se encontró ubigeo para esas coordenadas.");
        onError?.(new Error("No se encontró ubigeo para esas coordenadas."));
      }
    } catch (error: any) {
      handleApiError(error);
      onError?.(error);
    }
  };


    // Obtener coordenadas por Ubigeo
    const getCoordsByUbigeo = async (
        dep: string,
        prov: string,
        dist: string,
        callback?: (coords: { lat: number; lng: number }) => void

        ): Promise<void> => {
        try {
            const response = await api.get(`/ubigeos/obtener-coordenadas-por-ubigeo`, {
            params: { dep, prov, dist },
            });
            const { data, success } = response.data;
            if (success && data) {
            callback?.({ lat: data.lat, lng: data.lng });
            } else {
            console.warn("No se encontraron coordenadas para ese ubigeo.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Buscar direcciones (autocomplete)
    const searchDirecciones = async (
        query: string,
        dep: string,
        dist: string,
        callback?: (direcciones: any[]) => void
        ): Promise<void> => {
        try {
            const response = await api.get(`/ubigeos/buscar-direcciones`, {
            params: { query, dep, dist },
            });
            const { data, success } = response.data;
            if (success && data) {
            callback?.(data);
            } else {
            console.warn("No se encontraron direcciones.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Obtener coordenadas por dirección
    const getCoordsByDireccion = async (
        s: string,
        dep: string,
        dist: string,
        callback?: (coords: { lat: number; lng: number }) => void
        ): Promise<void> => {
        try {
            const response = await api.get(`/ubigeos/obtener-coordenadas-por-direccion`, {
            params: { s, dep, dist },
            });
            const { data, success } = response.data;
            if (success && data) {
            callback?.(data);
            } else {
            console.warn("No se encontraron coordenadas para esa dirección.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Obtener cod_ubigeo por dep, prov, dist
  const getCodUbigeo = async (
    dep: string,
    prov: string,
    dist: string,
    callback?: (codUbigeo: string) => void
  ): Promise<void> => {
    try {
      const response = await api.get(`/ubigeos/obtener-cod-ubigeo`, {
        params: { dep, prov, dist },
      });

      const { data, success } = response.data;
      if (success && data) {
        callback?.(data.cod_ubigeo);
      } else {
        console.warn("No se encontró cod_ubigeo.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener dep, prov, dist por cod_ubigeo
  const getUbigeoByCodigo = async (
    codigo: string,
    callback?: (dep: string, prov: string, dist: string) => void
  ): Promise<void> => {
    try {
      const response = await api.get(`/ubigeos/obtener-ubigeo-por-codigo`, {
        params: { codigo },
      });

      const { data, success } = response.data;
      if (success && data) {
        callback?.(data.departamento, data.provincia, data.distrito);
      } else {
        console.warn("No se encontró ubigeo con ese código.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener departamentos con servicios activos
  const getDepartamentosActivos = async (
    callback?: (departamentos: { 
      codigo_ubigeo: string;
      departamento: string; 
      total_servicios: number; 
    }[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<DepartamentosActivosResponse>("/ubigeos/departamentos/activos");
      const { data, success } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron departamentos con servicios activos.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };



  return {
    getDepartamentos,
    getProvincias,
    getDistritos,
    getUbigeoByCoords,
    getCoordsByUbigeo,
    searchDirecciones,
    getCoordsByDireccion,
    getCodUbigeo,
    getUbigeoByCodigo,
    getDepartamentosActivos
  };
};
