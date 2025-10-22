import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { Curso, CursoResponse, GuardarProgresoResponse, ModuloCurso } from "../interfaces/ICurso";

export const useCurso = () => {
  //  Obtener todos los cursos (no requiere autenticación)
  const getAllCursos = async (
    callback?: (cursos: Curso[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<CursoResponse>("/cursos/obtener-cursos");
      const { data, success } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron cursos.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  //  Obtener cursos por tipo (audio o video) y usuario autenticado
  const getCursosByTipo = async (
    tipo: "audio" | "video",
    callback?: (cursos: Curso[]) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<CursoResponse>(`/cursos/obtener-cursos/${tipo}`);

      const { data, success, message } = response.data;

      if (success && data) {
        callback?.(data);
      } else {
        console.warn("No se encontraron cursos:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  //  Obtener módulos de un curso (si lo usas en otra parte)
  const getModulosByCurso = async (
    cursoId: number,
    callback?: (modulos: ModuloCurso[]) => void
  ): Promise<void> => {
    try {
      const response = await api.get<CursoResponse>(`/curso/${cursoId}`);
      const { data, success } = response.data;

      if (success && data && data.length > 0) {
        const modulos = data[0].ModulosCursos ?? [];
        callback?.(modulos);
      } else {
        console.warn("No se encontraron módulos para este curso.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const guardarProgreso = async ({
    CURS_Id,
    MODU_Id,
    porcentajeModulo,
    completadoModulo,
    tiempoActual,
  }: {
    CURS_Id: number;
    MODU_Id: number;
    porcentajeModulo: number;
    completadoModulo: boolean;
    tiempoActual: number;
  }): Promise<GuardarProgresoResponse | null> => {
    try {
      const response = await apiWithAuth.post<GuardarProgresoResponse>(
        "/cursos/guardar-progreso",
        {
          CURS_Id,
          MODU_Id,
          porcentajeModulo,
          completadoModulo,
          tiempoActual, //  enviamos el tiempo actual
        }
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  };

  return {
    getAllCursos,
    getCursosByTipo,
    getModulosByCurso,
    guardarProgreso
  };
};
