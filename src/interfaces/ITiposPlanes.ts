export interface TipoPlanAttributes {
  TIPL_Id: number;
  TIPL_Nombre: string;
  TIPL_Descripcion?: string;
  TIPL_Estado: boolean;
}

export type TipoPlanCreationAttributes = Omit<TipoPlanAttributes, "TIPL_Id">;
