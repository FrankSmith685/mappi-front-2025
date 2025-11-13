import type { ModeLoginType } from "../../interfaces/appStateInterface";
import type { AuthLoginForm, AuthRegisterForm } from "../../interfaces/auth";
import type { AvisoData, AvisosDTO } from "../../interfaces/IAviso";
import type { CategoriaAttributes } from "../../interfaces/ICategoria";
import type { DireccionService } from "../../interfaces/IDireccion";
import type { EmpresaData } from "../../interfaces/IEmpresa";
import type { MultimediaAvisoPreview, MultimediaService, MultimediaServiceDelete } from "../../interfaces/IMultimedia";
import type { NewInmueble, ProgressPrincipalProperty, ProgressProperty } from "../../interfaces/inmueble";
import type { ProgressPrincipalService, ProgressService, ServicioActivoData, ServicioData } from "../../interfaces/IServicio";
import type { SubcategoriaAttributes } from "../../interfaces/ISubcategoria";
import type { ubigeo_usuario } from "../../interfaces/IUbigeos";
import type { ProfileType, SelectedPerfil, TypeUserAuth, UsuarioData } from "../../interfaces/IUser";
import { SET_ACCESSTOKEN, SET_ACTIVE_INICIAR_SESION_RESENA, SET_AUTHLOGINFORM, SET_AUTHREGISTERFORM, SET_CATEGORIA, SET_CATEGORIA_SELECCIONADA, SET_CHANGE_PASSWORD_TOKEN, SET_COMPANY, SET_DEPARTAMENTOS, SET_DIRECCIONSERVICE, SET_DISTRITOS, SET_FILTRO_AVISOS, SET_ID_AVISO, SET_IDS_DElETE_MULTIMEDIA, SET_IS_ARCHIVADO, SET_IS_EXPANDED, SET_IS_SERVICE_EDIT, SET_IS_SHOW_FILTER_SERVICE, SET_LISTA_AVISOS, SET_LOADING_USER, SET_MENU_OPEN, SET_MENU_OPEN_USER, SET_MODAL, SET_MODAL_RESENA, SET_MODE, SET_MODELOGIN, SET_MODIFIEDCOMPANY, SET_MODIFIEDSERVICE, SET_MODIFIEDUSER, SET_MULTIMEDIA_AVISOS_PREVIEW, SET_MULTIMEDIASERVICE, SET_NEW_INMUEBLE, SET_PROFILE_TYPE, SET_PROGRESS_PRINCIPAL_PROPERTY, SET_PROGRESS_PRINCIPAL_SERVICE, SET_PROGRESS_PROPERTY, SET_PROGRESS_SERVICE, SET_PROVINCIAS, SET_REFRESHTOKEN, SET_REGISTERUSER, SET_SELECCIONADOS_AVISOS, SET_SELECTED_PERFIL, SET_SERVICE, SET_SERVICIO_SELECCIONADO, SET_SERVICIOS_ACTIVOS, SET_SERVICIOS_FILTER_ACTIVOS, SET_SUBCATEGORIA, SET_TYPE_USER_AUTH, SET_UBIGEO_USUARIO, SET_USER } from "../../types/actionTypes";

export const setRegisterUser = (registerUser: string | null) => ({
  type: SET_REGISTERUSER,
  payload: registerUser,
});

export const setMode = (mode: string | null) => ({
  type: SET_MODE,
  payload: mode,
});

export const setModal = (modal: boolean) => ({
  type: SET_MODAL,
  payload: modal,
});

export const setModeLogin = (modeLogin: ModeLoginType) => ({
  type: SET_MODELOGIN,
  payload: modeLogin,
});

export const setAuthLoginForm = (authLoginForm: AuthLoginForm) => ({
  type: SET_AUTHLOGINFORM,
  payload: authLoginForm,
});


export const setAuthRegisterForm = (authRegisterForm: AuthRegisterForm) => ({
  type: SET_AUTHREGISTERFORM,
  payload: authRegisterForm,
});

export const setAccessToken = (accessToken: string | null) => ({
  type: SET_ACCESSTOKEN,
  payload: accessToken,
});

export const setRefreshtoken = (refreshToken: string | null) => ({
  type: SET_REFRESHTOKEN,
  payload: refreshToken,
});

export const setUser = (user: UsuarioData | null) => ({
  type: SET_USER,
  payload: user,
});


export const setLoadingUser = (loadingUser: boolean) => ({
  type: SET_LOADING_USER,
  payload: loadingUser,
});

export const setMenuOpen = (menuOpen: boolean) => ({
  type: SET_MENU_OPEN,
  payload: menuOpen,
});

export const setProgressProperty = (progressProperty: ProgressProperty) => ({
  type: SET_PROGRESS_PROPERTY,
  payload: progressProperty,
});

export const setNewInmueble = (newInmueble: NewInmueble) => ({
  type: SET_NEW_INMUEBLE,
  payload: newInmueble,
});

export const setProgressPrincipalProperty = (progressPrincipalProperty: ProgressPrincipalProperty) => ({
  type: SET_PROGRESS_PRINCIPAL_PROPERTY,
  payload: progressPrincipalProperty,
});


export const setChangePasswordToken = (changePasswordToken: string | null) => ({
  type: SET_CHANGE_PASSWORD_TOKEN,
  payload: changePasswordToken,
});

export const setMenuOpenUser = (menuOpenUser: boolean) => ({
  type: SET_MENU_OPEN_USER,
  payload: menuOpenUser,
});

export const setProfileType = (profileType: ProfileType) => ({
  type: SET_PROFILE_TYPE,
  payload: profileType,
});

export const setSelectedPerfil = (selectedPerfil: SelectedPerfil) => ({
  type: SET_SELECTED_PERFIL,
  payload: selectedPerfil,
});

export const setDepartamentos = (departamentos: string[]) => ({
  type: SET_DEPARTAMENTOS,
  payload: departamentos,
});

export const setProvincias = (provincias: string[]) => ({
  type: SET_PROVINCIAS,
  payload: provincias,
});

export const setDistritos = (distritos: string[]) => ({
  type: SET_DISTRITOS,
  payload: distritos,
});

export const setUbigeo_Usuario = (ubigeo_usuario: ubigeo_usuario) => ({
  type: SET_UBIGEO_USUARIO,
  payload: ubigeo_usuario,
});

export const setProgressPrincipalService = (progressPrincipalService: ProgressPrincipalService) => ({
  type: SET_PROGRESS_PRINCIPAL_SERVICE,
  payload: progressPrincipalService,
});

export const setCompany = (company: EmpresaData | null) => ({
  type: SET_COMPANY,
  payload: company,
});

export const setModifiedUser = (modifiedUser: UsuarioData | null) => ({
  type: SET_MODIFIEDUSER,
  payload: modifiedUser,
});

export const setModifiedCompany = (modifiedCompany: EmpresaData | null) => ({
  type: SET_MODIFIEDCOMPANY,
  payload: modifiedCompany,
});


export const setCategoria = (categoria: CategoriaAttributes[]) => ({
  type: SET_CATEGORIA,
  payload: categoria,
});

export const setSubCategoria = (subCategoria: SubcategoriaAttributes[]) => ({
  type: SET_SUBCATEGORIA,
  payload: subCategoria,
});

export const setService = (service: ServicioData | null) => ({
  type: SET_SERVICE,
  payload: service,
});

export const setModifiedService = (modifiedService: ServicioData | null) => ({
  type: SET_MODIFIEDSERVICE,
  payload: modifiedService,
});

export const setProgressService = (progressService: ProgressService) => ({
  type: SET_PROGRESS_SERVICE,
  payload: progressService,
});

export const setMultimediaService = (multimediaService: MultimediaService | null) => ({
  type: SET_MULTIMEDIASERVICE,
  payload: multimediaService,
});

export const setDireccionService = (direccionService: DireccionService | null) => ({
  type: SET_DIRECCIONSERVICE,
  payload: direccionService,
});

export const setFiltroAvisos = (filtroAvisos: AvisoData[]) => ({
  type: SET_FILTRO_AVISOS,
  payload: filtroAvisos,
});

export const setIsArchivado = (isArchivado: boolean) => ({
  type: SET_IS_ARCHIVADO,
  payload: isArchivado,
});

export const setSeleccionadosAvisos = (seleccionadosAvisos: AvisoData[]) => ({
  type: SET_SELECCIONADOS_AVISOS,
  payload: seleccionadosAvisos,
});

export const setListaAvisos = (listaAvisos: AvisosDTO) => ({
  type: SET_LISTA_AVISOS,
  payload: listaAvisos,
});

export const setIsServiceEdit = (isServiceEdit: boolean) => ({
  type: SET_IS_SERVICE_EDIT,
  payload: isServiceEdit,
});

export const setIdAviso = (idAviso: number) => ({
  type: SET_ID_AVISO,
  payload: idAviso,
});

export const setIdsDeleteMultimedia = (idsDeleteMultimedia: MultimediaServiceDelete | null) => ({
  type: SET_IDS_DElETE_MULTIMEDIA,
  payload: idsDeleteMultimedia,
});


export const setServiciosActivos = (serviciosActivo: ServicioActivoData[]) => ({
  type: SET_SERVICIOS_ACTIVOS,
  payload: serviciosActivo,
});


export const setServiciosFilterActivos = (serviciosFilterActivo: ServicioActivoData[]) => ({
  type: SET_SERVICIOS_FILTER_ACTIVOS,
  payload: serviciosFilterActivo,
});

export const setiIsShowFilterService = (isShowFilterService: boolean) => ({
  type: SET_IS_SHOW_FILTER_SERVICE,
  payload: isShowFilterService,
});

export const setServicioSeleccionado = (servicioSeleccionado: ServicioActivoData | null) => ({
  type: SET_SERVICIO_SELECCIONADO,
  payload: servicioSeleccionado,
});


export const setIsExpanded = (isExpanded: boolean) => ({
  type: SET_IS_EXPANDED,
  payload: isExpanded,
});

export const setCategoriaSeleccionada = (categoriaSeleccionada: string | null) => ({
  type: SET_CATEGORIA_SELECCIONADA,
  payload: categoriaSeleccionada,
});

export const setMultimediaAvisoPreview = (multimediaAvisosPreview: MultimediaAvisoPreview | null) => ({
  type: SET_MULTIMEDIA_AVISOS_PREVIEW,
  payload: multimediaAvisosPreview,
});

export const setActiveInciarSesionResena = (activeInciarSesionResena: boolean) => ({
  type: SET_ACTIVE_INICIAR_SESION_RESENA,
  payload: activeInciarSesionResena,
});

export const setModalResena = (modalResena: boolean) => ({
  type: SET_MODAL_RESENA,
  payload: modalResena,
});

export const setTypeUserAuth = (typeUserAuth: TypeUserAuth) => ({
  type: SET_TYPE_USER_AUTH,
  payload: typeUserAuth,
});









