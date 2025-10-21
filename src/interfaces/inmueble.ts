// Progreso de inmueble
export interface ProgressProperty {
  step: number;
  totalSteps: number;
  currentPath: string;
}

export interface ProgressPrincipalProperty {
  step: number;
  totalSteps: number;
  currentPath: string;
}

// Operaciones Inmueble
export interface Operacion{
  cod_operacion: number;
  nombre: string;
}

export interface OperacionResponse {
  success: boolean;
  message: string;
  data: Operacion[];
}

// tipo de inmueble
export interface TipoInmueble {
  cod_tipo_inmueble: number;
  nombre: string;
}

export interface TipoInmuebleResponse {
  success: boolean;
  message: string;
  data: TipoInmueble[];
}

// sub tipo de inmueble
export interface SubtipoInmueble {
  cod_subtipo_inmueble: number;
  nombre: string;
  cod_tipo_inmueble: number;
}

export interface SubtipoInmuebleResponse {
  success: boolean;
  message: string;
  data: SubtipoInmueble[];
}


export interface CaracteristicaInmuebleDTO {
  cod_caracteristica: number;
  valor: string;
  estado: string;
}

export interface GeneralInmuebleDTO {
  cod_general: number;
  valor: string;
  estado: string;
}

export interface AmoblamientoInmuebleDTO {
  cod_amoblamiento: number;
  cantidad: string;
  estado: string;
}

export interface MultimediaInmuebleDTO {
  cod_multimedia?: number;
  ruta?: string;
  tipo?: string;
  descripcion?: string;
  fecha_subida?: Date;
}

export interface PrecioInmuebleDTO {
  cod_precio?: number;
  cod_operacion: number;
  valor: number;
  moneda: string;
  tipo_precio?: string;
  desde?: Date;
  hasta?: Date;
}

export interface RegisterInmueble {
  cod_inmueble?: string;
  cod_usuario?: string;
  titulo: string | null;
  descripcion: string | null;
  cod_tipo_inmueble: number;
  cod_subtipo_inmueble: number;
  cod_ubigeo: number | null;
  cod_estado_inmueble?: number;
  operaciones: number[];
  caracteristicas: CaracteristicaInmuebleDTO[] | null;
  generales: GeneralInmuebleDTO[] | null;
  amoblamientos: AmoblamientoInmuebleDTO[] | null;
  multimedias: MultimediaInmuebleDTO[] | null;
  precios: PrecioInmuebleDTO[] | null;
}

export interface NewInmueble {
  cod_inmueble: string;
  cod_usuario: string;
  titulo: string | null;
  descripcion: string | null;
  cod_tipo_inmueble: number;
  cod_subtipo_inmueble: number;
  cod_ubigeo: number | null;
  cod_estado_inmueble: number;
  operaciones: number[];
  caracteristicas: CaracteristicaInmuebleDTO[] | null;
  generales: GeneralInmuebleDTO[] | null;
  amoblamientos: AmoblamientoInmuebleDTO[] | null;
  multimedias: MultimediaInmuebleDTO[] | null;
  precios: PrecioInmuebleDTO[] | null;
}