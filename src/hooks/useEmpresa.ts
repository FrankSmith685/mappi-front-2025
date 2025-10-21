import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { EmpresaResponse, EmpresaData, CreateEmpresaRequest, UpdateEmpresaRequest } from "../interfaces/IEmpresa";
import { useAppState } from "./useAppState";

export const useEmpresa = () => {
    const {setCompany, setModifiedCompany} = useAppState();

    const getEmpresa = async (
        callback?: (empresa: EmpresaData) => void
    ): Promise<void> => {
        try {
        const response = await apiWithAuth.get<EmpresaResponse>("/empresa/empresa-info");

        const { success, data, message } = response.data;

        if (success && data) {
            callback?.(data);
            setCompany(data);
            setModifiedCompany(data);
        } else {
            console.warn("No se encontró empresa:", message);
        }
        } catch (error) {
        handleApiError(error);
        }
    };

    const createEmpresa = async (
        data: CreateEmpresaRequest,
        callback?: (success: boolean, message: string, empresa?: EmpresaData) => void
    ): Promise<void> => {
        try {
        const response = await apiWithAuth.post<EmpresaResponse>("/empresa/create", data);
        const { success, message, data: empresa } = response.data;
        callback?.(success, message, empresa);
        } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al crear la empresa");
        }
    };

    const updateEmpresa = async (
        id: string,
        data: UpdateEmpresaRequest,
        callback?: (success: boolean, message: string, empresa?: EmpresaData) => void
    ): Promise<void> => {
        try {
        const response = await apiWithAuth.put<EmpresaResponse>(`/empresa/update/${id}`, data);
        const { success, message, data: empresa } = response.data;
        callback?.(success, message, empresa);
        } catch (error) {
        handleApiError(error);
        callback?.(false, "Error al actualizar la empresa");
        }
    };

  const deleteEmpresa = async (
    callback?: (success: boolean, message: string) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.delete<EmpresaResponse>("/empresa/delete-empresa");
      const { success, message } = response.data;
      callback?.(success, message);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al eliminar la empresa");
    }
  };

  return {
    getEmpresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
  };
};
