
 // src/interfaces/IDireccion.ts
export interface UbigeoAttributes {
  UBIG_Codigo: string;
  UBIG_Departamento: string;
  UBIG_Provincia: string;
  UBIG_Distrito: string;
}

// export interface DireccionRequest {
//   DIUS_CodigoUbigeo: string;
//   DIUS_Direccion: string;
//   DIUS_Tipo: string;
//   DIUS_Tipo_Entidad: string;
//   DIUS_Cod_Entidad: string;
//   DIUS_Latitud?: string;
//   DIUS_Longitud?: string;
//   DIUS_Referencia?: string;
//   DIUS_Predeterminada?: boolean;
// }



// --- Representa cómo está en la base de datos ---
export interface DireccionAttributes {
  DIUS_Interno: number;
  DIUS_Tipo: string;
  DIUS_Tipo_Entidad: "usuario" | "empresa" | "servicio";
  DIUS_Cod_Entidad: string;
  DIUS_Direccion: string;
  DIUS_Referencia?: string | null;
  DIUS_Latitud?: number | null;
  DIUS_Longitud?: number | null;
  DIUS_CodigoUbigeo: string;
  DIUS_Predeterminada?: boolean;
  Ubigeo?: UbigeoAttributes;

}

// --- Representa cómo se envía o recibe desde el frontend ---
export interface DireccionRequest {
  cod_entidad?: string; // opcional (el backend lo infiere si no se manda)
  tipo_entidad?: "usuario" | "empresa" | "servicio";
  direccion: string;
  referencia?: string | null;
  latitud?: number;
  longitud?: number;
  codigoUbigeo: string;
  predeterminado?: boolean;
}

// --- Respuesta del backend al guardar una dirección ---
export interface DireccionResponse {
  success: boolean;
  message: string;
  data?: DireccionAttributes;
}


export interface DireccionService {
  departamento?: string;
  provincia?: string;
  distrito?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}
