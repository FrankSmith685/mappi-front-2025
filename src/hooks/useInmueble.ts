import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { Operacion, OperacionResponse, RegisterInmueble, SubtipoInmueble, SubtipoInmuebleResponse, TipoInmueble, TipoInmuebleResponse } from "../interfaces/inmueble";

export const useInmueble = () => {

    const getOperaciones = async (
        callback?: (types: Operacion[]) => void
    ): Promise<void> => {
        try {
        const response = await api.get<OperacionResponse>("/inmuebles/obtener-operaciones");
        const { data, success } = response.data;
        if (success && data) {
            callback?.(data);
        } else {
            console.warn("No se encontraron operaciones.");
        }
        } catch (error) {
        handleApiError(error);
        }
    };

    const getTiposInmueble = async (
        callback?: (tipos: TipoInmueble[]) => void
    ): Promise<void> => {
        try {
        const response = await api.get<TipoInmuebleResponse>("/inmuebles/obtener-tipoinmueble");
        const { data, success } = response.data;
        if (success && data) {
            callback?.(data);
        } else {
            console.warn("No se encontraron tipos de inmueble.");
        }
        } catch (error) {
        handleApiError(error);
        }
    };
    
    const getSubtiposInmueble = async (
        callback?: (subtipos: SubtipoInmueble[]) => void
    ): Promise<void> => {
        try {
        const response = await api.get<SubtipoInmuebleResponse>(
            "/inmuebles/obtener-subtipoinmueble"
        );
        const { data, success } = response.data;
        if (success && data) {
            callback?.(data);
        } else {
            console.warn("No se encontraron subtipos de inmueble.");
        }
        } catch (error) {
        handleApiError(error);
        }
    };

    const registrarInmueble = async (
        payload: RegisterInmueble,
        callback?: (success: boolean) => void
        ): Promise<void> => {
        try {
            const response = await apiWithAuth.post("/inmuebles/registrar-inmueble", payload);
            const { success } = response.data;
            if (success) {
            callback?.(true);
            } else {
            callback?.(false);
            console.warn("Error al registrar inmueble:", response.data.message);
            }
        } catch (error) {
            handleApiError(error);
            callback?.(false);
        }
    };



  return {
    getOperaciones,
    getTiposInmueble,
    getSubtiposInmueble,
    registrarInmueble
  };
};
