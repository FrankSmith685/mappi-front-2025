export interface ModuloCurso {
  MODU_Id: number;
  MODU_Titulo: string;
  MODU_Descripcion?: string;
  MODU_Orden: number;
  MODU_UrlContenido: string;

  //  Nuevos campos agregados por la API
  desbloqueado: boolean;
  completado: boolean;
  porcentaje: number;
}

export interface Curso {
  CURS_Id: number;
  CURS_Titulo: string;
  CURS_Descripcion?: string;
  CURS_Tipo: "audio" | "video";
  CURS_Autor: string;
  CURS_Avatar?: string;
  CURS_Estado: boolean;

  //  Nuevos campos de estado del curso
  desbloqueado: boolean;
  completado: boolean;
  porcentaje: number;
  imagen?: string;

  //  Relación original de Sequelize (sin estados)
  ModulosCursos?: ModuloCurso[];

  //  Nueva lista de módulos con estados calculados
  modulos?: ModuloCurso[];
}

export interface CursoResponse {
  success: boolean;
  message: string;
  data: Curso[];
}

export type CursoData = Curso;



export interface ProgresoModulo {
  MODU_Id: number;
  porcentaje: number;
  completado: boolean;
  tiempoActual: number;
}

export interface ProgresoCurso {
  CURS_Id: number;
  porcentaje: string;
  completado: boolean;
}

export interface GuardarProgresoResponse {
  success: boolean;
  message: string;
  data: {
    curso: ProgresoCurso;
    modulo: ProgresoModulo;
  };
}

