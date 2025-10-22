import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { CategoriaAttributes } from "../interfaces/ICategoria";
import type { CategoriasActivasResponse } from "../interfaces/ICategoriasActivos";
import type { SubcategoriaAttributes } from "../interfaces/ISubcategoria";
import type { SubcategoriasActivasResponse } from "../interfaces/ISubCateoriasActivos";
import { useAppState } from "./useAppState";
// import { useAppState } from "../store/appState"; //  tu store global

// Respuesta tipada del backend
interface CategoriaResponse {
  success: boolean;
  message: string;
  data: (CategoriaAttributes & { Subcategorias: SubcategoriaAttributes[] })[];
}

export const useCategoria = () => {
  const { setCategoria, setSubCategoria } = useAppState();

  // Obtener todas las categorías con sus subcategorías
  const getAllCategorias = async (
    callback?: (
      categorias: (CategoriaAttributes & { Subcategorias: SubcategoriaAttributes[] })[]
    ) => void
  ): Promise<void> => {
    try {
      const response = await api.get<CategoriaResponse>("/categoria/obtener-categorias");
      const { data, success } = response.data;

      if (success && data) {
        setCategoria(data); // guardamos en estado global
        callback?.(data);
      } else {
        console.warn("No se encontraron categorías.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Obtener solo subcategorías de una categoría
  const getSubcategoriasByCategoria = async (
    categoriaId: number,
    callback?: (subcategorias: SubcategoriaAttributes[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<CategoriaResponse>(`/categorias/${categoriaId}`);
      const { data, success } = response.data;

      if (success && data && data.length > 0) {
        const subcategorias = data[0].Subcategorias;
        setSubCategoria(subcategorias); // guardamos en estado global
        callback?.(subcategorias);
      } else {
        console.warn("No se encontraron subcategorías para esta categoría.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getCategoriasActivasPorDepartamento = async (
    codDepartamento: string,
    callback?: (categorias: { value: string; label: string }[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<CategoriasActivasResponse>(
        `/categoria/obtener-categorias/activos/${codDepartamento}`
      );

      const { data, success } = response.data;

      if (success && data) {
        const categoriasFormat = data.map((cat) => ({
          value: String(cat.codigo_categoria),
          label: `${cat.categoria} (${cat.total_servicios})`,
        }));

        callback?.(categoriasFormat);
      } else {
        console.warn("No se encontraron categorías activas en este departamento.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const getSubcategoriasActivasPorDepartamentoYCategoria = async (
    codDepartamento: string,
    cateId: number,
    callback?: (subcategorias: { value: string; label: string }[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<SubcategoriasActivasResponse>(
        `/categoria/obtener-subcategorias/activos/${codDepartamento}/${cateId}`
      );

      const { data, success } = response.data;

      if (success && data) {
        const subcategoriasFormat = data.map((sub) => ({
          value: sub.subcategoria,
          label: `${sub.subcategoria} (${sub.total_servicios})`,
        }));

        callback?.(subcategoriasFormat);
      } else {
        console.warn("No se encontraron subcategorías activas para esta categoría y departamento.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    getAllCategorias,
    getSubcategoriasByCategoria,
    getCategoriasActivasPorDepartamento,
    getSubcategoriasActivasPorDepartamentoYCategoria
  };
};
