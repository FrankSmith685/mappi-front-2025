import type { AppState } from "../interfaces/appStateInterface";
import { SET_ACCESSTOKEN, SET_AUTHLOGINFORM, SET_AUTHREGISTERFORM, SET_CATEGORIA, SET_CATEGORIA_SELECCIONADA, SET_CHANGE_PASSWORD_TOKEN, SET_COMPANY, SET_DEPARTAMENTOS, SET_DIRECCIONSERVICE, SET_DISTRITOS, SET_FILTRO_AVISOS, SET_ID_AVISO, SET_IDS_DElETE_MULTIMEDIA, SET_IS_ARCHIVADO, SET_IS_EXPANDED, SET_IS_SERVICE_EDIT, SET_IS_SHOW_FILTER_SERVICE, SET_LISTA_AVISOS, SET_LOADING_USER, SET_LOGOUT, SET_MENU_OPEN, SET_MENU_OPEN_USER, SET_MODAL, SET_MODE, SET_MODELOGIN, SET_MODIFIEDCOMPANY, SET_MODIFIEDSERVICE, SET_MODIFIEDUSER, SET_MULTIMEDIASERVICE, SET_NEW_INMUEBLE, SET_PROFILE_TYPE, SET_PROGRESS_PRINCIPAL_PROPERTY, SET_PROGRESS_PRINCIPAL_SERVICE, SET_PROGRESS_PROPERTY, SET_PROGRESS_SERVICE, SET_PROVINCIAS, SET_REFRESHTOKEN, SET_REGISTERUSER, SET_SELECCIONADOS_AVISOS, SET_SELECTED_PERFIL, SET_SERVICE, SET_SERVICIO_SELECCIONADO, SET_SERVICIOS_ACTIVOS, SET_SERVICIOS_FILTER_ACTIVOS, SET_SUBCATEGORIA, SET_UBIGEO_USUARIO, SET_USER, type ActionTypes } from "../types/actionTypes";

export const appReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case SET_REGISTERUSER:
      return { ...state, registerUser: action.payload };
    case SET_MODE:
      return { ...state, mode: action.payload };
    case SET_MODAL:
      return { ...state, modal: action.payload };
    case SET_MODELOGIN:
      return { ...state, modeLogin: action.payload };
    case SET_AUTHLOGINFORM:
      return { ...state, authLoginForm: action.payload };
    case SET_AUTHREGISTERFORM:
      return { ...state, authRegisterForm: action.payload };
    case SET_ACCESSTOKEN:
      if (action.payload !== null) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        localStorage.removeItem('accessToken');
      }
      return { ...state, accessToken: action.payload };
    case SET_REFRESHTOKEN:
      if (action.payload !== null) {
        localStorage.setItem('refreshToken', action.payload);
      } else {
        localStorage.removeItem('refreshToken');
      }
      return { ...state, refreshToken: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_LOGOUT:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {
      ...state,
      accessToken: null,
      refreshToken: null,
      user: null,
      modal: true,
      modeLogin: "login_one",
      mode: 'login',
      authLoginForm: {
        correo: '',
        contraseña: '',
      },
      authRegisterForm: {
        tipoUsuario: 0,
        correo: '',
        contraseña: '',
        nombre: '',
        apellido: '',
        razon_social: null,
        tipoDocumento: 0,
        nroDocumento: '',
        telefono: '',
        telefono_movil: '',
      }
    }
    case SET_LOADING_USER:
      return { ...state, loadingUser: action.payload };
    case SET_MENU_OPEN:
      return { ...state, menuOpen: action.payload };
    case SET_PROGRESS_PROPERTY:
      return { ...state, progressProperty: action.payload };
    case SET_NEW_INMUEBLE:
      return { ...state, newInmueble: action.payload };
    case SET_PROGRESS_PRINCIPAL_PROPERTY:
      return { ...state, progressPrincipalProperty: action.payload };
    case SET_CHANGE_PASSWORD_TOKEN:
      if (action.payload !== null) {
        localStorage.setItem('changePassowordToken', action.payload);
      } else {
        localStorage.removeItem('changePassowordToken');
      }
      return { ...state, changePasswordToken: action.payload };
    case SET_MENU_OPEN_USER:
      return { ...state, menuOpenUser: action.payload };
    case SET_PROFILE_TYPE:
      return { ...state, profileType: action.payload };
    case SET_SELECTED_PERFIL:
      return { ...state, selectedPerfil: action.payload };
    case SET_DEPARTAMENTOS:
      return { ...state, departamentos: action.payload };
    case SET_PROVINCIAS:
      return { ...state, provincias: action.payload };
    case SET_DISTRITOS:
      return { ...state, distritos: action.payload };
    case SET_UBIGEO_USUARIO:
      return { ...state, ubigeo_usuario: action.payload };
    case SET_PROGRESS_PRINCIPAL_SERVICE:
      return { ...state, progressPrincipalService: action.payload };
    case SET_COMPANY:
      return { ...state, company: action.payload };
    case SET_MODIFIEDUSER:
      return { ...state, modifiedUser: action.payload };
    case SET_MODIFIEDCOMPANY:
      return { ...state, modifiedCompany: action.payload };
    case SET_CATEGORIA:
      return { ...state, categoria: action.payload };
    case SET_SUBCATEGORIA:
      return { ...state, subCategoria: action.payload };
    case SET_SERVICE:
      return { ...state, service: action.payload };
    case SET_MODIFIEDSERVICE:
      return { ...state, modifiedService: action.payload };
    case SET_PROGRESS_SERVICE:
      return { ...state, progressService: action.payload };
    case SET_MULTIMEDIASERVICE:
      return { ...state, multimediaService: action.payload };
    case SET_DIRECCIONSERVICE:
      return { ...state, direccionService: action.payload };
    case SET_FILTRO_AVISOS:
      return { ...state, filtroAvisos: action.payload };
    case SET_IS_ARCHIVADO:
      return { ...state, isArchivado: action.payload };
    case SET_SELECCIONADOS_AVISOS:
      return { ...state, seleccionadosAvisos: action.payload };
    case SET_LISTA_AVISOS:
      return { ...state, listaAvisos: action.payload };
    case SET_IS_SERVICE_EDIT:
      return { ...state, isServiceEdit: action.payload };
    case SET_ID_AVISO:
      return { ...state, idAviso: action.payload };
    case SET_IDS_DElETE_MULTIMEDIA:
      return { ...state, idsDeleteMultimedia: action.payload };
    case SET_SERVICIOS_ACTIVOS:
      return { ...state, serviciosActivos: action.payload };
    case SET_SERVICIOS_FILTER_ACTIVOS:
      return { ...state, serviciosFilterActivos: action.payload };
    case SET_IS_SHOW_FILTER_SERVICE:
      return { ...state, isShowFilterService: action.payload };
    case SET_SERVICIO_SELECCIONADO:
      return { ...state, servicioSeleccionado: action.payload };
    case SET_IS_EXPANDED:
      return { ...state, isExpanded: action.payload };
    case SET_CATEGORIA_SELECCIONADA:
      return { ...state, categoriaSeleccionada: action.payload };
    default:
      return state;
  }
};
