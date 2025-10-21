export interface ServicioActivoDataDetail {
  cod_servicio: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fechaRegistro: string;
  cod_usuario: string;
  subcategoria: {
    cod_subcategoria: number;
    nombre: string;
    descripcion: string | null;
    categoria: {
      cod_categoria: number;
      nombre: string;
      descripcion: string | null;
    } | null;
  } | null;
  direccion: {
    interno: number;
    codigo_ubigeo: string;
    direccion: string;
    referencia: string | null;
    tipo: string;
    predeterminada: boolean;
    tipo_entidad: string;
    cod_entidad: string;
    latitud: string;
    longitud: string;
  } | null;
  archivos: {
    id: string;
    tipo: string;
    nombreOriginal: string;
    ruta: string;
    fechaSubida: string;
  }[];
  usuario: {
    cod_usuario: string;
    telefono: string | null;
  } | null;
  empresa: {
    cod_empresa: string;
    razonSocial: string;
    telefono: string | null;
  } | null;
  abierto24h: boolean;
  horaInicio: string | null;
  horaFin: string | null;
  delivery: boolean;
  archivado: boolean;
}

export interface ObtenerServicioActivoResponseDetail {
  success: boolean;
  message: string;
  data: ServicioActivoDataDetail;
}
