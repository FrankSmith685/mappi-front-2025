export interface ProgressPrincipalService {
  step: number;
  totalSteps: number;
  currentPath: string;
}

export interface ServicioData {
  cod_servicio?: string | null;      // SERV_Interno
  nombre?: string;                   // SERV_Nombre
  descripcion?: string | null;       // SERV_Descripcion
  estado?: boolean;                  // SERV_Estado
  fechaRegistro?: string;            // SERV_FechaRegistro
  cod_usuario?: string;              // USUA_Interno
  subcategoria?: {
    cod_subcategoria?: number;       // SUBC_Id
    nombre?: string;                 // SUBC_Nombre
    descripcion?: string | null;     // SUBC_Descripcion
  } | null;
  abierto24h?: boolean;              // SERV_Abierto24h
  horaInicio?: string | null;        // SERV_HoraInicio
  horaFin?: string | null;           // SERV_HoraFin
  delivery?: boolean;                // SERV_Delivery
  archivado?: boolean;
}


/** Respuesta de API para un solo servicio */
export interface ServicioResponse {
  success: boolean;
  message: string;
  data?: ServicioData;
}

/** Request para crear un servicio */
export interface CreateServicioRequest {
  SERV_Nombre: string;
  SERV_Descripcion?: string;
  SUBC_Id: number;
  SERV_Abierto24h?: boolean;
  SERV_HoraInicio?: string | null;
  SERV_HoraFin?: string | null;
  SERV_Delivery?: boolean;
  SERV_Estado?: boolean;
}

/** Request para actualizar un servicio */
export interface UpdateServicioRequest {
  SERV_Nombre?: string;
  SERV_Descripcion?: string;
  SUBC_Id?: number;
  SERV_Abierto24h?: boolean;
  SERV_HoraInicio?: string | null;
  SERV_HoraFin?: string | null;
  SERV_Delivery?: boolean;
  SERV_Estado?: boolean;
}


export interface ProgressService {
  step: number;
  totalSteps: number;
  currentPath: string;
}


export interface ObtenerServicioResponse {
  success: boolean;
  message?: string;
  data?: ServicioData[]; //  AQUÍ debe ser un arreglo
}


// 🏠 Dirección del servicio
export interface Direccion_Servicio {
  interno: number;
  codigo_ubigeo: string;
  direccion: string;
  referencia: string | null;
  tipo: string;
  predeterminada: boolean;
  tipo_entidad: "servicio";
  cod_entidad: string;
  latitud: string;
  longitud: string;
}

// 🏷️ Categoría del servicio
export interface Categoria_Servicio {
  cod_categoria: number;
  nombre: string;
  descripcion: string | null;
}

// 📂 Subcategoría del servicio (ahora con categoría incluida)
export interface Subcategoria_Servicio {
  cod_subcategoria: number;
  nombre: string;
  descripcion: string | null;
  categoria: Categoria_Servicio | null;
}

export interface Archivo_Servicio {
  id: string;
  tipo: "imagen" | "logo" | "portada" | "documento" | "video";
  nombreOriginal: string;
  ruta: string;
  fechaSubida: string;
}

// 💼 Datos del servicio activo
export interface ServicioActivoData {
  cod_servicio: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fechaRegistro: string;
  cod_usuario: string;
  subcategoria: Subcategoria_Servicio | null;
  direccion: Direccion_Servicio | null;
  archivos: Archivo_Servicio[];
  abierto24h: boolean;
  horaInicio: string | null;
  horaFin: string | null;
  delivery: boolean;
  archivado: boolean;
}

//  Respuesta general del endpoint
export interface ObtenerServicioActivoResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    servicios: ServicioActivoData[];
  };
}
