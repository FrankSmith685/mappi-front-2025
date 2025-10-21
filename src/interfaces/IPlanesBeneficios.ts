export interface PlanBeneficioAttributes {
  PLBE_Id: number;
  PLAN_Id: number;
  PLBE_Descripcion: string;
}

export type PlanBeneficioCreationAttributes = Omit<PlanBeneficioAttributes, "PLBE_Id">;
