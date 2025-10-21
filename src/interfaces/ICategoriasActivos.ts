export interface CategoriaActiva {
    codigo_categoria: number;
    categoria: string;
    total_servicios: number;
}

export interface CategoriasActivasResponse {
  success: boolean;
  message: string;
  data: CategoriaActiva[];
}
