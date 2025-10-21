// Representa un archivo almacenado
export interface Archivo {
  ARCH_ID: string;
  ARCH_Entidad: string;
  ARCH_EntidadId: string;
  ARCH_Tipo: string;
  ARCH_NombreOriginal: string;
  ARCH_Ruta: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArchivoResponse<T = Archivo | Archivo[]> {
  success: boolean;
  message: string;
  data: T;
}
