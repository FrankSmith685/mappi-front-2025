import type { SubcategoriaAttributes } from "./ISubcategoria";

export interface CategoriaAttributes {
  CATE_Id: number;
  CATE_Nombre: string;
  CATE_Descripcion?: string | null;
}

export type CategoriaCreationAttributes = Omit<CategoriaAttributes, "CATE_Id">;

export type CategoriaWithSubcategorias = CategoriaAttributes & {
  Subcategorias: SubcategoriaAttributes[];
};