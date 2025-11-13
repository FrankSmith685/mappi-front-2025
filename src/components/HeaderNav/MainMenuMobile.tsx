import { CustomButton } from "../ui/CustomButton";
import { quickAccess } from "./data/menuData";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const MainMenuMobile = () => {
  const { 
    user,
    setMenuOpen, 
    setProgressService, 
    progressService,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setMultimediaService,  
    setDireccionService,
    setIsServiceEdit,
    setMultimediaAvisoPreview
  } = useAppState();
  const {logout} = useAuth();
  const navigate = useNavigate();
  const {getUserInfo} = useUser();
   const location = useLocation();
  const isPanelPublicadorRoute = location.pathname.startsWith("/panel/publicador");


  const handleClickIngresar = (): void => {
    navigate("/iniciar")
  };

  const handleClickPublicar = async() => {
    navigate("/panel/publicador");
    setMenuOpen(false);
    setProgressService({
      ...progressService,
      currentPath:"/panel/publicador/principales",
      step:1,
    });
    setService(null);
    setModifiedService(null);
    setProgressPrincipalService({
        ...progressPrincipalService,
        step: 1,
        currentPath: "/panel/publicador/principales/perfilnegocio",
    });
    setMultimediaService(null);
    setDireccionService(null);
    await getUserInfo();
    setIsServiceEdit(false);
    setMultimediaAvisoPreview(null);
  };

   const initials = `${(user?.nombre || user?.correo || "").charAt(0)}${(user?.apellido || "").charAt(0)}`
    .toUpperCase()
    .trim();

  const quickAccessToShow = user
  ? quickAccess.filter(item => item.isActive !== false)
  : quickAccess.filter(
      item =>
        item.isActive !== false &&
        item.label !== "Ayudar" &&
        item.label !== "Cerrar sesión"
    );


  const onLogout=()=>{
    logout();
    setMenuOpen(false);
  }

  const handleClickNavigateUserActions = (path: string) => {
    if(user){
      navigate(path);
      setMenuOpen(false);
    }else{
      navigate("/iniciar")
    }
    
  };

  return (
    <div className={`space-y-4 w-full px-4 py-4 h-full`}>
      {/* Botón publicar */}
      {
        !isPanelPublicadorRoute && user?.tipo_usuario?.[0]?.cod_tipo_usuario !== 4 && (
          <div className={`pt-0 pb-4 space-y-2 border-b-[1px] border-b-gray-200`}>
            <p className="text-sm text-gray-700">
              ¿Tienes un huarique que quieras compartir? Publícalo y deja que más personas lo descubran.
            </p>
            <CustomButton
              type="button"
              variant="primary-outline"
              size="md"
              fontSize="14px"
              fontWeight={400}
              fullWidth={true}
              text="Publicar"
              onClick={handleClickPublicar}
            />
          </div>
        )
      }
      {/* Header login */}
      <div className={`pb-2 space-y-2 border-b-[1px]  border-b-gray-200  `}>
        <p className="text-sm text-gray-700">
          Ingresa y accede a los avisos que contactaste, tus favoritos y las búsquedas guardadas
        </p>
        {user ? (
          <div className="w-full flex items-center justify-between hover:cursor-pointer">
            <div className="flex items-center justify-start gap-4 w-full">
              <div className="flex items-center gap-1 cursor-pointer h-full">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-orange-700 flex items-center justify-center text-white text-sm">
                  {user?.fotoPerfil ? (
                    <img
                      src={user.fotoPerfil}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                
              </div>
              <div className="w-full gap-0 flex flex-col">
                <p className="text-gray-800 font-semibold">{user?.nombre}</p>
                <p className={`${user?.nombre != null ? 'text-gray-800 text-base' : 'font-semibold text-gray-700 text-base'}`}>{user?.correo}</p>
              </div>
            </div>
          </div>
        ): (
          <CustomButton
            type="button"
            variant="primary"
            size="md"
            fontSize="14px"
            fontWeight={400}
            fullWidth={true}
            text="Ingresar"
            onClick={handleClickIngresar}
          />
        )}
      </div>
      <div
          className={`
            bg-white rounded-md
            overflow-hidden transition-all duration-300 h-auto opacity-100 py-0
          `}
        >
          <ul className="divide-y divide-gray-200 text-sm text-gray-800 pb-4">
            {quickAccessToShow.map((item, index) => (
              <li     
                key={index}
                className={`p-3 flex items-center gap-2 transition-colors cursor-pointer 
                  ${item.label === "Cerrar sesión" ? "text-red-800 hover:bg-red-100" : "hover:bg-primary"}
                `}
                onClick={item.isLogout ? onLogout : ()=>handleClickNavigateUserActions(item.path || "")}
              >
                {item.icon && <item.icon className={`${item.label === "Cerrar sesión" ? "text-red-700 hover:bg-red-100" : "hover:bg-primary"}`}/>}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default MainMenuMobile;
