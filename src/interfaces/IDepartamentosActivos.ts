export interface DepartamentoActivo {
  codigo_ubigeo: string;
  departamento: string;
  total_servicios: number;
}

export interface DepartamentosActivosResponse {
  success: boolean;
  message: string;
  data: DepartamentoActivo[];
}
