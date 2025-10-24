import type { ModeLoginType } from "../interfaces/appStateInterface";
import type { AuthLoginForm, AuthRegisterForm } from "../interfaces/auth";
import type { AvisoData, AvisosDTO } from "../interfaces/IAviso";
import type { CategoriaAttributes } from "../interfaces/ICategoria";
import type { DireccionService } from "../interfaces/IDireccion";
import type { EmpresaData } from "../interfaces/IEmpresa";
import type { MultimediaAvisoPreview, MultimediaService, MultimediaServiceDelete } from "../interfaces/IMultimedia";
import type { NewInmueble, ProgressProperty, ProgressPrincipalProperty } from "../interfaces/inmueble";
import type { ProgressPrincipalService, ProgressService, ServicioActivoData, ServicioData } from "../interfaces/IServicio";
import type { SubcategoriaAttributes } from "../interfaces/ISubcategoria";
import type { ubigeo_usuario } from "../interfaces/IUbigeos";
import type { ProfileType, SelectedPerfil, UsuarioData } from "../interfaces/IUser";

export const SET_REGISTERUSER = "SET_REGISTERUSER" as const;
export const SET_MODE = "SET_MODE" as const;
export const SET_MODAL = "SET_MODAL" as const;
export const SET_MODELOGIN = "SET_MODELOGIN" as const;
export const SET_AUTHLOGINFORM = "SET_AUTHLOGINFORM" as const;
export const SET_AUTHREGISTERFORM = "SET_AUTHREGISTERFORM" as const;
export const SET_ACCESSTOKEN = "SET_ACCESSTOKEN" as const;
export const SET_REFRESHTOKEN = "SET_REFRESHTOKEN" as const;
export const SET_USER = "SET_USER" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;
export const SET_LOADING_USER = "SET_LOADING_USER" as const;
export const SET_MENU_OPEN = "SET_MENU_OPEN" as const;
export const SET_PROGRESS_PROPERTY = "SET_PROGRESS_PROPERTY" as const;
export const SET_NEW_INMUEBLE = "SET_NEW_INMUEBLE" as const;
export const SET_PROGRESS_PRINCIPAL_PROPERTY = "SET_PROGRESS_PRINCIPAL_PROPERTY" as const;

export const SET_CHANGE_PASSWORD_TOKEN = "SET_CHANGE_PASSWORD_TOKEN" as const;
export const SET_MENU_OPEN_USER = "SET_MENU_OPEN_USER" as const;
export const SET_PROFILE_TYPE = "SET_PROFILE_TYPE" as const;
export const SET_SELECTED_PERFIL = "SET_SELECTED_PERFIL" as const;
export const SET_DEPARTAMENTOS = "SET_DEPARTAMENTOS" as const;
export const SET_PROVINCIAS = "SET_PROVINCIAS" as const;
export const SET_DISTRITOS = "SET_DISTRITOS" as const;
export const SET_UBIGEO_USUARIO = "SET_UBIGEO_USUARIO" as const;
export const SET_PROGRESS_PRINCIPAL_SERVICE = "SET_PROGRESS_PRINCIPAL_SERVICE" as const;
export const SET_COMPANY = "SET_COMPANY" as const;
export const SET_MODIFIEDUSER = "SET_MODIFIEDUSER" as const;
export const SET_MODIFIEDCOMPANY = "SET_MODIFIEDCOMPANY" as const;
export const SET_CATEGORIA = "SET_CATEGORIA" as const;
export const SET_SUBCATEGORIA = "SET_SUBCATEGORIA" as const;
export const SET_SERVICE = "SET_SERVICE" as const;
export const SET_MODIFIEDSERVICE = "SET_MODIFIEDSERVICE" as const;
export const SET_PROGRESS_SERVICE = "SET_PROGRESS_SERVICE" as const;
export const SET_MULTIMEDIASERVICE = "SET_MULTIMEDIASERVICE" as const;
export const SET_DIRECCIONSERVICE = "SET_DIRECCIONSERVICE" as const;
export const SET_FILTRO_AVISOS = "SET_FILTRO_AVISOS" as const;
export const SET_IS_ARCHIVADO = "SET_IS_ARCHIVADO" as const;
export const SET_SELECCIONADOS_AVISOS = "SET_SELECCIONADOS_AVISOS" as const;
export const SET_LISTA_AVISOS = "SET_LISTA_AVISOS" as const;
export const SET_IS_SERVICE_EDIT = "SET_IS_SERVICE_EDIT" as const;
export const SET_ID_AVISO = "SET_ID_AVISO" as const;
export const SET_IDS_DElETE_MULTIMEDIA = "SET_IDS_DElETE_MULTIMEDIA" as const;
export const SET_SERVICIOS_ACTIVOS = "SET_SERVICIOS_ACTIVOS" as const;
export const SET_SERVICIOS_FILTER_ACTIVOS = "SET_SERVICIOS_FILTER_ACTIVOS" as const;
export const SET_IS_SHOW_FILTER_SERVICE = "SET_IS_SHOW_FILTER_SERVICE" as const;
export const SET_SERVICIO_SELECCIONADO = "SET_SERVICIO_SELECCIONADO" as const;
export const SET_IS_EXPANDED = "SET_IS_EXPANDED" as const;
export const SET_CATEGORIA_SELECCIONADA = "SET_CATEGORIA_SELECCIONADA" as const;
export const SET_MULTIMEDIA_AVISOS_PREVIEW = "SET_MULTIMEDIA_AVISOS_PREVIEW" as const;


export type ActionTypes =
  | { type: typeof SET_REGISTERUSER; payload: string | null }
  | { type: typeof SET_MODE; payload: string | null }
  | { type: typeof SET_MODAL; payload: boolean }
  | { type: typeof SET_MODELOGIN; payload: ModeLoginType }
  | { type: typeof SET_AUTHLOGINFORM; payload: AuthLoginForm }
  | { type: typeof SET_AUTHREGISTERFORM; payload: AuthRegisterForm }
  | { type: typeof SET_ACCESSTOKEN; payload: string | null }
  | { type: typeof SET_REFRESHTOKEN; payload: string | null }
  | { type: typeof SET_USER; payload: UsuarioData | null }
  | { type: typeof SET_LOGOUT}
  | { type: typeof SET_LOADING_USER; payload: boolean }
  | { type: typeof SET_MENU_OPEN; payload: boolean }
  | { type: typeof SET_PROGRESS_PROPERTY; payload: ProgressProperty }
  | { type: typeof SET_NEW_INMUEBLE; payload: NewInmueble }
  | { type: typeof SET_PROGRESS_PRINCIPAL_PROPERTY; payload: ProgressPrincipalProperty }

  | { type: typeof SET_CHANGE_PASSWORD_TOKEN; payload: string | null }
  | { type: typeof SET_MENU_OPEN_USER; payload: boolean }
  | { type: typeof SET_PROFILE_TYPE; payload: ProfileType }
  | { type: typeof SET_SELECTED_PERFIL; payload: SelectedPerfil }
  | { type: typeof SET_DEPARTAMENTOS; payload: string[] }
  | { type: typeof SET_PROVINCIAS; payload: string[] }
  | { type: typeof SET_DISTRITOS; payload: string[] }
  | { type: typeof SET_UBIGEO_USUARIO; payload: ubigeo_usuario }
  | { type: typeof SET_PROGRESS_PRINCIPAL_SERVICE; payload: ProgressPrincipalService }
  | { type: typeof SET_COMPANY; payload: EmpresaData | null }
  | { type: typeof SET_MODIFIEDUSER; payload: UsuarioData | null }
  | { type: typeof SET_MODIFIEDCOMPANY; payload: EmpresaData | null }
  | { type: typeof SET_CATEGORIA; payload: CategoriaAttributes[] }
  | { type: typeof SET_SUBCATEGORIA; payload: SubcategoriaAttributes[] }
  | { type: typeof SET_SERVICE; payload: ServicioData | null }
  | { type: typeof SET_MODIFIEDSERVICE; payload: ServicioData | null }
  | { type: typeof SET_PROGRESS_SERVICE; payload: ProgressService }
  | { type: typeof SET_MULTIMEDIASERVICE; payload: MultimediaService | null }
  | { type: typeof SET_DIRECCIONSERVICE; payload: DireccionService | null }
  | { type: typeof SET_FILTRO_AVISOS; payload: AvisoData[] }
  | { type: typeof SET_IS_ARCHIVADO; payload: boolean }
  | { type: typeof SET_SELECCIONADOS_AVISOS; payload: AvisoData[] }
  | { type: typeof SET_LISTA_AVISOS; payload: AvisosDTO }
  | { type: typeof SET_IS_SERVICE_EDIT; payload: boolean }
  | { type: typeof SET_ID_AVISO; payload: number }
  | { type: typeof SET_IDS_DElETE_MULTIMEDIA; payload:  MultimediaServiceDelete | null }
  | { type: typeof SET_SERVICIOS_ACTIVOS; payload:  ServicioActivoData[]}
  | { type: typeof SET_SERVICIOS_FILTER_ACTIVOS; payload:  ServicioActivoData[]}
  | { type: typeof SET_IS_SHOW_FILTER_SERVICE; payload:  boolean}
  | { type: typeof SET_SERVICIO_SELECCIONADO; payload:  ServicioActivoData | null}
  | { type: typeof SET_IS_EXPANDED; payload:  boolean}
  | { type: typeof SET_CATEGORIA_SELECCIONADA; payload:  string | null}
  | { type: typeof SET_MULTIMEDIA_AVISOS_PREVIEW; payload:  MultimediaAvisoPreview | null }