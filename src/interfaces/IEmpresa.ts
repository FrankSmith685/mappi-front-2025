export interface EmpresaData {
  cod_empresa?: string | null;
  razon_social?: string;
  ruc?: string;
  telefono?: string;
  estado?: boolean;
  fechaRegistro?: string;
  cod_usuario?: string;
  direccion?: {
    direccion?: string | null;
    referencia?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    idUbigeo?: string | null;
  } | null;
}

export interface EmpresaResponse {
  success: boolean;
  message: string;
  data?: EmpresaData;
}

export interface CreateEmpresaRequest {
  EMPR_RazonSocial: string;
  EMPR_Ruc: string;
  EMPR_Telefono?: string;
  DIUS_Direccion?: string;
  DIUS_Referencia?: string;
  DIUS_Latitud?: number;
  DIUS_Longitud?: number;
  DIUS_CodigoUbigeo?: string;
}

export interface UpdateEmpresaRequest extends Partial<CreateEmpresaRequest> {
  EMPR_Interno: string;
}
