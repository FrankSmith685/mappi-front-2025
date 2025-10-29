import { FaBell, FaMapMarkedAlt, FaRegCommentDots, FaSpinner } from 'react-icons/fa';
import { CustomButton } from '../ui/CustomButton';
import { Tooltip } from '@mui/material';
import type { UserActionsProps } from '../../interfaces/menuHeaderInterface';
import { useAppState } from '../../hooks/useAppState';
import { UserAvatarMenu } from './UserAvatarMenu';
import { useNotification } from '../../hooks/useNotificacionHooks/useNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

const UserActions = ({ menuOpen }: UserActionsProps) => {
  const { showMessage } = useNotification();
  const { 
    user, 
    loadingUser,
    setMenuOpen, 
    progressService, 
    setProgressService,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setMultimediaService,  
    setDireccionService,
    setIsServiceEdit,
    setMultimediaAvisoPreview
  } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const isPanelRoute = location.pathname.startsWith("/panel");
  const isPanelPublicadorRoute = location.pathname.startsWith("/panel/publicador");

  const isHomeRoute = location.pathname === "/";
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("m"); // puede ser 'map', 'list', etc.
  const isServiciosMapOrList = location.pathname === "/servicios" && (mode === "map" || mode === "list");


  const {getUserInfo} = useUser();

  const handleClickIngresar = (): void => {
    navigate("/iniciar");
    setMenuOpen(true);
  };

  const handleClickPublicar = async() => {
    if(!user){
      navigate("/iniciar")
      setMenuOpen(true);
    }
    navigate("/panel/publicador");
    setMenuOpen(true);
    setProgressService({
      ...progressService,
      currentPath:"/panel/publicador/principales",
      step:1,
    })
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
  

  return (
    <div className='items-center gap-4 lg:gap-4 text-sm flex flex-row'>
      {/* Ir al Mapa */}
      {!isHomeRoute && !isServiciosMapOrList && (
        <Tooltip title='Explorar en el mapa' arrow>
          <div
            className='group rounded-full transition-all cursor-pointer hover:shadow-sm hover:scale-105'
            onClick={() => navigate("/servicios?m=map")}
          >
            <FaMapMarkedAlt className='text-2xl transition-colors text-white' />
          </div>
        </Tooltip>
      )}

      {/* Notificaciones */}
      <Tooltip
        title='Notificaciones'
        arrow
        className={`${menuOpen ? 'hidden' : ''}`}
        onClick={() => !user ? navigate("/iniciar") : showMessage('¡Éxito total!', 'success')}
      >
        <div className='group rounded-full transition-all cursor-pointer hover:shadow-sm hover:scale-105'>
          <FaBell className='text-xl lg:text-lg transition-colors text-white' onClick={()=> !user ? navigate("/iniciar") : null}/>
        </div>
      </Tooltip>
      {/* Contactos */}
      {
        !isPanelRoute && (
          <>
            <div
              className={`group hidden lg:flex items-center gap-1 p-3 rounded-md cursor-pointer transition-all hover:shadow-sm hover:scale-[1.02]`}
              onClick={()=>!user ? navigate("/iniciar") : navigate("/panel/actividad/contactos")}>
              <FaRegCommentDots className='text-white text-lg transition-colors' />
              <span className='text-white transition-colors text-sm'>
                Mis contactos
              </span>
            </div>
            <Tooltip title='Mis contactos' arrow className={`${menuOpen ? 'hidden' : ''}`}>
            <div onClick={()=>!user ? navigate("/iniciar") : navigate("/panel/actividad/contactos")} className='group lg:hidden rounded-full transition-all cursor-pointer hover:bg-primary hover:shadow-sm hover:scale-105'>
              <FaRegCommentDots className='text-white text-xl lg:text-lg transition-colors' />
            </div>
          </Tooltip>
          </>
        )
      }

      {/* Publicar */}
      {
        !isPanelPublicadorRoute && (
          <div className='hidden lg:flex'>
            <CustomButton
              type='button'
              variant='primary-outline-white'
              size='md'
              fontSize='14px'
              fontWeight={400}
              text='Publicar'
              onClick={handleClickPublicar}
            />
          </div>
        )
      }

      {/* Ingresar o Usuario */}
      {!user ? (
        <div className='hidden lg:flex'>
          {
            loadingUser ? (
              <div className="flex items-center justify-center px-3 py-2">
                <FaSpinner className="animate-spin text-white text-xl" />
              </div>
            ):(
                <div className='hidden lg:flex'>
                  <CustomButton
                    type='button'
                    variant='primary'
                    size='md'
                    fontSize='14px'
                    fontWeight={400}
                    text='Ingresar'
                    onClick={handleClickIngresar}
                  />
                </div>
            )
          }
        </div>
      ) : (
        <div className='hidden lg:flex'>
          <UserAvatarMenu/>
        </div>
      )}
    </div>
  );
};

export default UserActions;
