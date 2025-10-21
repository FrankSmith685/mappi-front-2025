export interface UbigeoResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface ubigeo_usuario{
  cod_ubigeo: string | null;
  latitud: number;
  longitud: number;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  direccion: string | null;
}


