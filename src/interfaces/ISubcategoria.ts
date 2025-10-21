export interface SubcategoriaAttributes {
  SUBC_Id: number;
  SUBC_Nombre: string;
  SUBC_Descripcion?: string | null;
  CATE_Id: number; // relación con Categoría
}

export type SubcategoriaCreationAttributes = Omit<SubcategoriaAttributes, "SUBC_Id">;