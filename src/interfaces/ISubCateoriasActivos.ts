export interface SubcategoriaActiva {
  subcategoria: string;
  total_servicios: number;
}

export interface SubcategoriasActivasResponse {
  success: boolean;
  message: string;
  data: SubcategoriaActiva[];
}