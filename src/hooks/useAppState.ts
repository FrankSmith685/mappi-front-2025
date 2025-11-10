import { useContext } from "react";
import { AppContext } from "../context/appContext";

import { 
  setMode,
  setRegisterUser,
  setModal,
  setModeLogin,
  setAuthLoginForm,
  setAuthRegisterForm,
  setAccessToken,
  setRefreshtoken,
  setUser,
  setLoadingUser,
  setMenuOpen,
  setNewInmueble,
  setProgressPrincipalProperty,
  setChangePasswordToken,
  setMenuOpenUser,
  setProfileType,
  setSelectedPerfil,
  setDepartamentos,
  setProvincias,
  setDistritos,
  setUbigeo_Usuario,
  setProgressPrincipalService,
  setCompany,
  setModifiedUser,
  setModifiedCompany,
  setCategoria,
  setSubCategoria,
  setService,
  setModifiedService,
  setProgressService,
  setMultimediaService,
  setDireccionService,
  setFiltroAvisos,
  setIsArchivado,
  setSeleccionadosAvisos,
  setListaAvisos,
  setIsServiceEdit,
  setIdAviso,
  setIdsDeleteMultimedia,
  setServiciosActivos,
  setServiciosFilterActivos,
  setiIsShowFilterService,
  setServicioSeleccionado, 
  setIsExpanded,
  setCategoriaSeleccionada,
  setMultimediaAvisoPreview,
  setActiveInciarSesionResena,
  setModalResena
} from "../context/actions/actions";
import type { ModeLoginType } from "../interfaces/appStateInterface";
import type { AuthLoginForm, AuthRegisterForm } from "../interfaces/auth";
import type { ProfileType, SelectedPerfil, UsuarioData } from "../interfaces/IUser";
import type { NewInmueble, ProgressPrincipalProperty } from "../interfaces/inmueble";
import type { ubigeo_usuario } from "../interfaces/IUbigeos";
import type { ProgressPrincipalService, ProgressService, ServicioActivoData, ServicioData } from "../interfaces/IServicio";
import type { EmpresaData } from "../interfaces/IEmpresa";
import type { CategoriaAttributes } from "../interfaces/ICategoria";
import type { SubcategoriaAttributes } from "../interfaces/ISubcategoria";
import type { MultimediaAvisoPreview, MultimediaService, MultimediaServiceDelete } from "../interfaces/IMultimedia";
import type { DireccionService } from "../interfaces/IDireccion";
import type { AvisoData, AvisosDTO } from "../interfaces/IAviso";


export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState debe ser usado dentro de un AppProvider");
  }

  const { appState, dispatch } = context;

  return {
    ...appState,
    setRegisterUser: (registerUser: string | null) => dispatch(setRegisterUser(registerUser)),
    setMode: (mode: string | null) => dispatch(setMode(mode)),
    setModal: (modal: boolean) => dispatch(setModal(modal)),
    setModeLogin: (modeLogin: ModeLoginType) => dispatch(setModeLogin(modeLogin)),
    setAuthLoginForm: (authLoginForm: AuthLoginForm) => dispatch(setAuthLoginForm(authLoginForm)),
    setAuthRegisterForm: (authRegisterForm: AuthRegisterForm) => dispatch(setAuthRegisterForm(authRegisterForm)),
    setAccessToken: (accessToken: string | null) => dispatch(setAccessToken(accessToken)),
    setRefreshtoken: (refreshToken: string | null) => dispatch(setRefreshtoken(refreshToken)),
    setUser: (user: UsuarioData | null) => dispatch(setUser(user)),
    setLoadingUser: (loadingUser: boolean) => dispatch(setLoadingUser(loadingUser)),
    setMenuOpen: (menuOpen: boolean) => dispatch(setMenuOpen(menuOpen)),
    setNewInmueble: (newInmueble: NewInmueble) => dispatch(setNewInmueble(newInmueble)),
    setProgressPrincipalProperty: (progressPrincipalProperty: ProgressPrincipalProperty) => dispatch(setProgressPrincipalProperty(progressPrincipalProperty)),

    setChangePasswordToken: (changePasswordToken: string | null) => dispatch(setChangePasswordToken(changePasswordToken)),
    setMenuOpenUser: (menuOpenUser: boolean) => dispatch(setMenuOpenUser(menuOpenUser)),
    setProfileType: (profileType: ProfileType) => dispatch(setProfileType(profileType)),
    setSelectedPerfil: (selectedPerfil: SelectedPerfil) => dispatch(setSelectedPerfil(selectedPerfil)),
    setDepartamentos: (departamentos: string[]) => dispatch(setDepartamentos(departamentos)),
    setProvincias: (provincias: string[]) => dispatch(setProvincias(provincias)),
    setDistritos: (distritos: string[]) => dispatch(setDistritos(distritos)),
    setUbigeo_Usuario: (ubigeo_usuario: ubigeo_usuario) => dispatch(setUbigeo_Usuario(ubigeo_usuario)),
    setProgressPrincipalService: (progressPrincipalService: ProgressPrincipalService) => dispatch(setProgressPrincipalService(progressPrincipalService)),
    setCompany: (company: EmpresaData | null) => dispatch(setCompany(company)),
    setModifiedUser: (modifiedUser: UsuarioData | null) => dispatch(setModifiedUser(modifiedUser)),
    setModifiedCompany: (modifiedCompany: EmpresaData | null) => dispatch(setModifiedCompany(modifiedCompany)),
    setCategoria: (categoria: CategoriaAttributes[]) => dispatch(setCategoria(categoria)),
    setSubCategoria: (subCategoria: SubcategoriaAttributes[]) => dispatch(setSubCategoria(subCategoria)),
    setService: (service: ServicioData | null) => dispatch(setService(service)),
    setModifiedService: (modifiedService: ServicioData | null) => dispatch(setModifiedService(modifiedService)),
    setProgressService: (progressService: ProgressService) => dispatch(setProgressService(progressService)),
    setMultimediaService: (multimediaService: MultimediaService | null) => dispatch(setMultimediaService(multimediaService)),
    setDireccionService: (direccionService: DireccionService | null) => dispatch(setDireccionService(direccionService)),
    setFiltroAvisos: (filtroAvisos: AvisoData[]) => dispatch(setFiltroAvisos(filtroAvisos)),
    setIsArchivado: (isArchivado: boolean) => dispatch(setIsArchivado(isArchivado)),
    setSeleccionadosAvisos: (seleccionadosAvisos: AvisoData[]) => dispatch(setSeleccionadosAvisos(seleccionadosAvisos)),
    setListaAvisos: (listaAvisos: AvisosDTO) => dispatch(setListaAvisos(listaAvisos)),
    setIsServiceEdit: (serviceEdit: boolean) => dispatch(setIsServiceEdit(serviceEdit)),
    setIdAviso: (idAviso: number) => dispatch(setIdAviso(idAviso)),
    setIdsDeleteMultimedia: (idsDeleteMultimedia: MultimediaServiceDelete | null) => dispatch(setIdsDeleteMultimedia(idsDeleteMultimedia)),
    setServiciosActivos: (serviciosActivos: ServicioActivoData[]) => dispatch(setServiciosActivos(serviciosActivos)),
    setServiciosFilterActivos: (serviciosFilterActivos: ServicioActivoData[]) => dispatch(setServiciosFilterActivos(serviciosFilterActivos)),
    setiIsShowFilterService: (isShowFilterService: boolean) => dispatch(setiIsShowFilterService(isShowFilterService)),
    setServicioSeleccionado: (servicioSeleccionado: ServicioActivoData | null) => dispatch(setServicioSeleccionado(servicioSeleccionado)),
    setIsExpanded: (isExpanded: boolean) => dispatch(setIsExpanded(isExpanded)),
    setCategoriaSeleccionada: (categoriaSeleccionada: string | null) => dispatch(setCategoriaSeleccionada(categoriaSeleccionada)),
    setMultimediaAvisoPreview: (multimediaAvisosPreview: MultimediaAvisoPreview | null) => dispatch(setMultimediaAvisoPreview(multimediaAvisosPreview)),
    setActiveInciarSesionResena: (activeIniciarSesionResena: boolean) => dispatch(setActiveInciarSesionResena(activeIniciarSesionResena)),
    setModalResena: (modalResena: boolean) => dispatch(setModalResena(modalResena)),
  
    
  };
};
