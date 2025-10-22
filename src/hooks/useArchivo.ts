import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { Archivo, ArchivoResponse } from "../interfaces/IArchivo";

export const useArchivo = () => {
  //Subir archivo
  const subirArchivo = async (
    entidad: string,
    entidadId: string,
    tipo: string,
    file: File,
    callback?: (archivo: Archivo, message: string) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);
      formData.append("tipo", tipo);

      const response = await apiWithAuth.post<ArchivoResponse<Archivo>>(
        "/archivos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, message, data } = response.data;

      if (success) {
        callback?.(data, message);
      } else {
        console.warn("Error al subir archivo:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  //Actualiar archivo
  const actualizarArchivo = async (
    entidad: string,
    entidadId: string,
    tipo: string,
    file: File,
    callback?: (archivo: Archivo, message: string) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);
      formData.append("tipo", tipo);

      const response = await apiWithAuth.put<ArchivoResponse<Archivo>>(
        "/archivos/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { success, message, data } = response.data;
      if (success) {
        callback?.(data, message);
      } else {
        console.warn("Error al actualizar archivo:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };




  //Obtener archivos de una entidad
  const getArchivos = async (
    entidad: string,
    entidadId: string,
    callback?: (
      success: boolean,
      message: string,
      archivos?: Archivo[]
    ) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get<ArchivoResponse<Archivo[]>>(
        `/archivos/${entidad}/${entidadId}`
      );

      const { success, message, data } = response.data;
      callback?.(success, message, data);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al obtener archivos");
    }
  };



  const subirArchivosMultiples = async (
    entidad: string,
    entidadId: string,
    archivos: {
      logo?: File;
      portada?: File;
      imagenes?: File[];
      video?: File | string;
      documento?: File;
    },
    callback?: (success: boolean, archivos: Archivo[], message: string) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);

      if (archivos.logo) formData.append("logo", archivos.logo);
      if (archivos.portada) formData.append("portada", archivos.portada);

      //  Diferenciar si el video es archivo o URL
      if (archivos.video) {
        if (archivos.video instanceof File) {
          formData.append("video", archivos.video); // archivo
        } else if (typeof archivos.video === "string") {
          formData.append("videoUrl", archivos.video); // URL
        }
      }

      if (archivos.documento) formData.append("documento", archivos.documento);

      if (archivos.imagenes && archivos.imagenes.length > 0) {
        archivos.imagenes.forEach((img) => {
          formData.append("imagen", img);
        });
      }

      const response = await apiWithAuth.post<ArchivoResponse<Archivo[]>>(
        "/archivos/upload-multiple",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { success, message, data } = response.data;
      if (success) {
        callback?.(success, data, message);
      } else {
        console.warn("Error al subir archivos múltiples:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const actualizarArchivosMultiples = async (
    entidad: string,
    entidadId: string,
    archivos: {
      logo?: File;
      portada?: File;
      imagenes?: File[];
      video?: File | string;
      documento?: File;
    },
    callback?: (success: boolean, archivos: Archivo[], message: string) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);

      if (archivos.logo) formData.append("logo", archivos.logo);
      if (archivos.portada) formData.append("portada", archivos.portada);

      // 📹 Si el video es archivo o URL
      if (archivos.video) {
        if (archivos.video instanceof File) {
          formData.append("video", archivos.video);
        } else if (typeof archivos.video === "string") {
          formData.append("videoUrl", archivos.video);
        }
      }

      if (archivos.documento) formData.append("documento", archivos.documento);

      if (archivos.imagenes && archivos.imagenes.length > 0) {
        archivos.imagenes.forEach((img) => {
          formData.append("imagen", img);
        });
      }

      const response = await apiWithAuth.put<ArchivoResponse<Archivo[]>>(
        "/archivos/update-multiple",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { success, message, data } = response.data;
      if (success) {
        callback?.(success, data, message);
      } else {
        console.warn("Error al actualizar archivos múltiples:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const eliminarArchivo = async (
    archivoId: string,
    callback?: (success: boolean, message: string) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.delete<ArchivoResponse<null>>(
        `/archivos/${archivoId}`
      );
      const { success, message } = response.data;
      callback?.(success, message);
    } catch (error) {
      handleApiError(error);
      callback?.(false, "Error al eliminar archivo");
    }
  };

  // 🗑️ Eliminar múltiples archivos
 const eliminarArchivosMultiples = async (
  archivoIds: string[],
  callback?: (success: boolean, message: string) => void
): Promise<void> => {
  try {
    const response = await apiWithAuth.delete<ArchivoResponse<null>>(
      "/archivos/delete-multiple",
      {
        data: { ids: archivoIds }, //  el body va dentro de "data"
      }
    );

    const { success, message } = response.data;
    callback?.(success, message);
  } catch (error) {
    handleApiError(error);
    callback?.(false, "Error al eliminar archivos múltiples");
  }
};



  

  return {
    subirArchivo,
    actualizarArchivo,
    getArchivos,
    subirArchivosMultiples,
    actualizarArchivosMultiples,
    eliminarArchivo,
    eliminarArchivosMultiples
  };
};
