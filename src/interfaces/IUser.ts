export interface TypeUser {
  cod_tipo_usuario: number;
  descripcion: string;
}

export interface TypeUserResponse {
  success: boolean;
  message: string;
  data: TypeUser[];
}

type MetodoLogin = "correo" | "google" | "facebook";

export interface UsuarioData {
  cod_usuario?: string;
  correo?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  dni?: string;
  fotoPerfil?: string;
  estado?: boolean;
  fechaRegistro?:Date;
  ultimaSesion?:Date;
  tipo_usuario?: {
    cod_tipo_usuario: number;
    descripcion: string;
  };
  metodosLogin?:MetodoLogin[];
  tieneEmpresa?: boolean;
  tieneServicio?:boolean;
  idUbigeo?: string;
  tienePlan?: string | null;
  planActivo?: {
    PLUS_Id: number;
    PLUS_EstadoPlan: string;
    PLAN_Id: number;
    PLAN_TipoUsuario: string;
  } | null;
  limiteServicios?: number;
  serviciosActivos?: number;
  limitePromocional?: number;
  tieneVideoPromocional?: boolean;
  tieneAviso?: boolean;
}

export interface UsuarioResponse {
  success:boolean,
  message: string,
  data:UsuarioData
}

export interface UpdateUsuarioCompleto {
  USUA_Interno?: string;
  USUA_Nombre?: string;
  USUA_Apellido?: string;
  USUA_Telefono?: string;
  USUA_Dni?: string;
  USUA_IdUbigeo?: string,
  USUA_Direccion?: string,
  USUA_Latitud?: number,
  USUA_Longitud?: number,
}

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export interface ChangeEmailRequest {
  currentEmail: string;
  newEmail: string;
}

export interface ChangeEmailResponse {
  success: boolean;
  message: string;
}

export type ProfileType = "independiente" | "empresa" | null;

export type SelectedPerfil = "independiente" | "empresa";

// export type ProfileType = {
//   currentPassword: string;
//   newPassword: string;
// };