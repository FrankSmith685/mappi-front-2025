export interface TipoPlanData {
  TIPL_Id: number;
  TIPL_Nombre: string;
}

export interface PlanUserData {
  PLUS_Id: number;
  USUA_Interno: string;
  PLAN_Id: number;
  TIPL_Id: number;
  PLUS_TokenPago: string | null;
  PLUS_MontoPagado: string;
  PLUS_Moneda: string;
  PLUS_FechaInicio: string;
  PLUS_FechaExpiracion: string;
  PLUS_EsPremium: boolean;
  PLUS_EstadoPago: string;
  PLUS_EstadoPlan: string;
  PLAN?: {
    PLAN_Id: number;
    TIPL_Id: number;
    PLAN_Precio: string;
    PLAN_Moneda: string;
    PLAN_DuracionMeses: number;
    PLAN_TipoUsuario: string;
    PLAN_Estado: boolean;
    TipoPlan?: TipoPlanData | null;
  };
}

export interface PlanUserResponse {
  success: boolean;
  message: string;
  data?: PlanUserData[]; // 👈 ahora es un array
}

export interface PlanUserResponseCreate {
  success: boolean;
  message: string;
  data?: PlanUserData; // 👈 ahora es un array
}

export interface CreatePlanUserRequest {
  PLAN_Id: number;
  TIPL_Id: number;
  PLAN_Tipo_Usuario: string; // "empresa" o "independiente"
  PLUS_TokenPago?: string;
  PLUS_Moneda?: string;
  PLUS_EsPremium?: boolean;
  PLUS_EstadoPago?: string;
}

