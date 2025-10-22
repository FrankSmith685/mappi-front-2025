import { type TipoPlanAttributes } from "./ITiposPlanes";
import { type PlanBeneficioAttributes } from "./IPlanesBeneficios";

/**
 *  Atributos principales del modelo Planes
 */
export interface PlanAttributes {
  PLAN_Id: number;
  TIPL_Id: number;
  PLAN_TipoUsuario: "independiente" | "empresa";
  PLAN_Precio: number;
  PLAN_DuracionMeses: number;
  PLAN_Moneda: string;
  PLAN_Estado: boolean;

  // Relaciones opcionales
  TipoPlan?: TipoPlanAttributes;
  Beneficios?: PlanBeneficioAttributes[];
}

/**
 *  Atributos necesarios para crear un plan (sin el ID autoincremental)
 */
export type PlanCreationAttributes = Omit<
  PlanAttributes,
  "PLAN_Id" | "TipoPlan" | "Beneficios"
>;

/**
 *  Estructura de la respuesta que devuelve la API
 */
export interface PlanResponse {
  success: boolean;
  message: string;
  data: PlanAttributes[];
}


export interface PlanProrrateo {
  saldoRestante: string;
  diasRestantes: number;
}

export interface PlanConProrrateo {
  PLAN_Id: number;
  PLAN_Precio: number;
  PLAN_Moneda: string;
  PLAN_DuracionMeses: number;
  PLAN_TipoUsuario: string;
  esPlanActual: boolean;
  prorrateo: PlanProrrateo | null;
  precioConProrrateo: number;
}

export interface PlanesConProrrateoResponse {
  success: boolean;
  message: string;
  data: PlanConProrrateo[];
}