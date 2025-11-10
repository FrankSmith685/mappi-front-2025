import { useReducer, type ReactNode } from "react";
import { AppContext } from "./appContext";
import { appReducer } from "./appReducer";
import type { AppState } from "../interfaces/appStateInterface";
import { ImagePreloaderProvider } from "../hooks/useImageHooks/imagePreloaderProvider";
import { NotificationProvider } from "../hooks/useNotificacionHooks/notificacionProvider";
import { SET_LOGOUT } from "../types/actionTypes";
import { setLogoutFunction } from "../helpers/logoutHelper";
import { LocationProvider } from "../hooks/useLocationHooks/locationProvider";
// import { VideoPreloaderProvider } from "../hooks/useVideoHooks/videoPreloaderProvider";

interface Props {
  children: ReactNode;
}

const initialState: AppState = {
  
  registerUser: null,
  mode: null,
  modal: false,
  modeLogin: 'login_one',
  authLoginForm:{
    correo: '',
    contraseña: '',
  },
  authRegisterForm:{
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
  },
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: null,
  loadingUser: false,
  menuOpen:false,
  progressProperty: {
    step: 1,
    totalSteps: 4,
    currentPath: "/panel/publicador/principales",
  },
  newInmueble:{
    cod_inmueble:"",
    cod_usuario:"",
    titulo:null,
    descripcion:null,
    cod_tipo_inmueble:0,
    cod_subtipo_inmueble:0,
    cod_ubigeo:null,
    cod_estado_inmueble:0,
    operaciones:[],
    caracteristicas:null,
    generales:null,
    amoblamientos:null,
    multimedias:null,
    precios:null
  },
  progressPrincipalProperty:{
    step: 1,
    totalSteps: 2,
    currentPath: "/panel/publicador/principales/perfilnegocio",
  },
  changePasswordToken:localStorage.getItem("changePassowordToken") || null,
  menuOpenUser:false,
  profileType:null,
  selectedPerfil:'independiente',
  departamentos:[],
  provincias:[],
  distritos:[],
  ubigeo_usuario:{
    cod_ubigeo:null,
    latitud:0,
    longitud:0,
    departamento:null,
    provincia:null,
    distrito:null,
    direccion:null
  },
  progressPrincipalService:{
    step: 1,
    totalSteps: 2,
    currentPath: "/panel/publicador/principales/perfilnegocio",
  },
  company:null,
  modifiedUser: null,
  modifiedCompany: null,
  categoria:[],
  subCategoria:[],
  service: null,
  modifiedService: null,
  progressService:{
    step: 1,
    totalSteps: 4,
    currentPath: "/panel/publicador/principales",
  },
  multimediaService:null,
  direccionService:null,
  filtroAvisos: [],
  isArchivado: false,
  seleccionadosAvisos: [],
  listaAvisos:{
    avisos:[],
    consultas_pendientes:0,
    avisos_incompletos:0,
    avisos_duplicados:0,
    reportes_pendientes:0,
    planes_disponibles:0,
  },
  isServiceEdit: false,
  idAviso: 0,
  idsDeleteMultimedia:null,
  serviciosActivos: [],
  serviciosFilterActivos: [],
  isShowFilterService: false,
  servicioSeleccionado: null,
  isExpanded:false,
  categoriaSeleccionada:null,
  multimediaAvisosPreview: null,
  activeIniciarSesionResena: false,
  modalResena: false
}


export const AppProvider = ({ children }: Props) => {
  const [appState, dispatch] = useReducer(appReducer, initialState);

  const logout = () => {
    dispatch({ type: SET_LOGOUT });
  };

  setLogoutFunction(logout);

  return (
    <AppContext.Provider value={{ appState, dispatch, logout }}>
      <LocationProvider>
        <NotificationProvider>
        <ImagePreloaderProvider>
          {/* <VideoPreloaderProvider> */}
            {children}
          {/* </VideoPreloaderProvider> */}
          </ImagePreloaderProvider>
          </NotificationProvider>
         </LocationProvider>
    </AppContext.Provider>
  );
};
