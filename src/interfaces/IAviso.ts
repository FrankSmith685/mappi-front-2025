// 🔹 Cuando envías un aviso al backend
export interface AvisoRequest {
  AVIS_Estado: "borrador" | "publicado";
  EMPR_Interno: string | null;
  isCompleted: number;
  SERV_Interno?: string | null;
}


export interface SubcategoriaData {
  SUBC_Id: number;
  SUBC_Nombre: string;
  SUBC_Descripcion: string | null;
}

export interface ArchivoData {
  ARCH_Ruta: string;
}


// 🔹 Estructura del servicio relacionado que viene dentro de cada aviso
export interface ServicioData {
  SERV_Interno: string;
  SERV_Nombre: string;
  SERV_Descripcion: string;
  SERV_Estado: boolean;
  SERV_Archivado: boolean;
  SERV_FechaRegistro: string;
  USUA_Interno: string;
  SUBC_Id: number;
  SERV_Abierto24h: boolean;
  SERV_HoraInicio: string;
  SERV_HoraFin: string;
  SERV_Delivery: boolean;
  Subcategoria?: SubcategoriaData | null;
  Archivos?: ArchivoData[];
}

// 🔹 Datos de un aviso con la relación incluida
export interface AvisoData {
  AVIS_Id: number; // 👈 en tu JSON llega como número
  AVIS_Estado: "borrador" | "publicado" | "pausado" | "eliminado";
  AVIS_Progreso: number;
  AVIS_FechaRegistro: string;
  AVIS_FechaPublicacion?: string | null;
  SERV_Interno: string;
  USUA_Interno: string;
  EMPR_Interno: string | null;
  Servicio?: ServicioData; // 👈 relación con Servicio
}

// 🔹 Cuando obtienes un solo aviso
export interface AvisoResponse {
  success: boolean;
  message: string;
  data?: AvisoData;
}

// 🔹 Cuando obtienes todos los avisos
export interface GetAvisosResponse {
  success: boolean;
  message: string;
  data:AvisosDTO
}


export interface AvisosDTO{
    avisos: AvisoData[];
    avisos_incompletos: number;
    avisos_duplicados: number;
    consultas_pendientes: number;
    reportes_pendientes: number;
    planes_disponibles: number;
}