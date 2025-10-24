/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Principales from "./submenus/principales/Principales";
import Multimedia from "./submenus/multimedia/Multimedia";
import Publicar from "./submenus/publicar/Publicar";

import { CustomStepProgressBar } from "../../ui/CustomStepProgressBar";
import { steps } from "./data/menuStepPublicador";
import { useAppState } from "../../../hooks/useAppState";
import { CustomSidebarSubMenu } from "../../ui/CustomSidebarSubMenuUser";
import { menuPrincipalesData } from "./submenus/principales/data/menuPrincipalesData";
import { FaUserCircle } from "react-icons/fa";
import CuentaSectionLayout from "../../ui/CustomCuentaSectionLayaout";
import { menuMultimediaData } from "./submenus/multimedia/menuMultimediaData";
import SelectedType from "./components/selectedType";
import { useUbigeo } from "../../../hooks/useUbigeo";
import Ubicacion from "./submenus/ubicacion/Ubicacion";
import { menuUbicacionData } from "./submenus/ubicacion/data/menuUbicacionData";
import { menuPublicarData } from "./submenus/publicar/data/menuPublicarData";
import ModalLimiteServicios from "./components/modalLimiteServicios";

const Publicador = () => {
  const { suboption } = useParams<{ suboption?: string }>();

  const { progressService,progressPrincipalService,isServiceEdit, user,setMenuOpenUser, menuOpenUser, setProfileType, profileType, setDepartamentos, setProgressService } = useAppState();
  const [showModalTypeSelected, setShowModalTypeSelected] = useState(false);
  const {getDepartamentos} = useUbigeo();
  
  const [showModalLimite, setShowModalLimite] = useState(false);

  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getDepartamentos((data) => setDepartamentos(data));
  }, []);

  const [modalEvaluated, setModalEvaluated] = useState(false);

useEffect(() => {
  if(isServiceEdit) return;
  if (!user || modalEvaluated) return;
  //  Verificar límite
  if (
    typeof user.limiteServicios === "number" &&
    user.limiteServicios > 0 &&
    typeof user.serviciosActivos === "number" &&
    user.serviciosActivos >= user.limiteServicios
  ) {
    setShowModalLimite(true);
  }

  //  Verificar tipo de usuario
  if (user.tienePlan) {
    setProfileType(user.tienePlan === "empresa" ? "empresa" : "independiente");
    setShowModalTypeSelected(false);
  } else if (user.tieneEmpresa) {
    setProfileType("empresa");
    setShowModalTypeSelected(false);
  } else if (user.tieneAviso) {
    setProfileType("independiente");
    setShowModalTypeSelected(false);
  } else {
    setShowModalTypeSelected(true);
  }

  setModalEvaluated(true); //  Solo se evalúa la primera vez
}, [user,isServiceEdit]);






  const handleClickSelected = (tipo:string) => {
    if(tipo=='independiente'){
      setProfileType('independiente')
    }else{
      setProfileType('empresa')
    }
    setShowModalTypeSelected(false);
  }

  const handleClickSelectedClose = () => {
    navigate("/");
    setShowModalTypeSelected(false);
  }

  const validOptions = ["principales", "multimedia", "ubicacion", "publicar"];

  const stepMapping: Record<string, number> = {
    principales: 1,
    multimedia: 2,
    ubicacion: 3,
    publicar: 4,
  };

  if (
    !suboption ||
    !validOptions.includes(suboption) ||
    progressService.step < stepMapping[suboption]
  ) {
    return <Navigate to={`/panel/publicador/${Object.keys(stepMapping).find(
      key => stepMapping[key] === progressService.step
    )}`} replace />;
  }

 const handleClickAtras = () => {
  // Definimos el orden de las rutas
  const routes = [
    "/panel/publicador/principales/perfilnegocio",
    "/panel/publicador/principales/huarique",
    "/panel/publicador/multimedia",
    "/panel/publicador/ubicacion",
    "/panel/publicador/publicar",
  ];

  // Mapa de rutas a step
  const stepMap: Record<string, number> = {
    "/panel/publicador/principales/perfilnegocio": 1,
    "/panel/publicador/principales/huarique": 1,
    "/panel/publicador/multimedia": 2,
    "/panel/publicador/ubicacion": 3,
    "/panel/publicador/publicar": 4,
  };

  // Buscar índice de la ruta actual
  const currentIndex = routes.indexOf(location.pathname);

  if (currentIndex > 0) {
    const prevPath = routes[currentIndex - 1];
    navigate(prevPath);

    setProgressService({
      ...progressService,
      step: stepMap[prevPath] ?? 1,
      currentPath:
        stepMap[prevPath] === 1
          ? "/panel/publicador/principales/perfilnegocio"
          : prevPath,
    });
  } else {
    navigate("/");
  }
};


  const hideBackButton = location.pathname === "/panel/publicador/principales/perfilnegocio";

  
  const renderSubComponent = () => {
    const props = { menuOpenUser, onToggleSidebar: () => setMenuOpenUser(!menuOpenUser) };

    switch (suboption) {
      case "principales":
        return (
          <CuentaSectionLayout
            title={progressPrincipalService.step === 1 ? 'Perfil de Negocio' : 'Huarique'}
            subTitle={
              profileType === "empresa"
              ? "( Empresa )"
              : profileType === "independiente"
              ? "( Independiente )"
              : undefined
            }
            handleClickAtras={hideBackButton ? undefined : handleClickAtras}
            {...props}
          >
            <Principales />
          </CuentaSectionLayout>
        );
      case "multimedia":
        return (
          <CuentaSectionLayout 
            title="Multimedia"
            subTitle={
              progressService.step === 2
                ? profileType === "empresa"
                  ? "( Empresa )"
                  : profileType === "independiente"
                  ? "( Independiente )"
                  : undefined
                : undefined
            }
            handleClickAtras={handleClickAtras}

            {...props}>
            <Multimedia />
          </CuentaSectionLayout>
        );
      case "ubicacion":
        return (
          <CuentaSectionLayout title="Ubicación"
            subTitle={
              progressService.step === 3
                ? profileType === "empresa"
                  ? "( Empresa )"
                  : profileType === "independiente"
                  ? "( Independiente )"
                  : undefined
                : undefined
            }
            handleClickAtras={handleClickAtras}
          {...props}>
            <Ubicacion />
          </CuentaSectionLayout>
        );
      case "publicar":
        return (
          <CuentaSectionLayout title="Publicar"
            subTitle={
              progressService.step === 4
                ? profileType === "empresa"
                  ? "( Empresa )"
                  : profileType === "independiente"
                  ? "( Independiente )"
                  : undefined
                : undefined
            }
            handleClickAtras={handleClickAtras}
          {...props}>
            <Publicar />
          </CuentaSectionLayout>
        );
    }
  };

  const getMenuData = () => {
  switch (suboption) {
    case "multimedia":
      return menuMultimediaData;
    case "ubicacion":
      return menuUbicacionData;
    case "publicar":
      return menuPublicarData;
    default:
      return menuPrincipalesData;
  }
};

  return (
    <div className="flex gap-6 flex-wrap md:flex-nowrap px-0 relative">
      {/* Overlay */}
      {menuOpenUser && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 sm:hidden"
          onClick={() => setMenuOpenUser(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-[80px] left-0 h-full bg-[#263238] z-30 transform transition-transform duration-300
          w-[100px] sm:w-[120px] 
          ${menuOpenUser ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:w-[120px]
        `}
      >
        <CustomSidebarSubMenu
          title="Mi Publicación"
          titleIcon={FaUserCircle}
          menuData={getMenuData()}
          onItemClick={() => setMenuOpenUser(false)}
        />
      </div>

      {/* Contenido */}
      <div className={`${
            menuOpenUser ? "ml-[0px] sm:ml-[120px]" : "md:ml-[120px]"
          } flex-1 bg-white responsive-padding flex flex-col gap-[16px]`}>
        <div className="w-full py-2 px-2 bg-white rounded-xl border border-gray-200 shadow-md">
          <CustomStepProgressBar steps={steps} currentPath={suboption} maxStep={progressService.step}/>
        </div>
        <main
          className={`flex-1 bg-white w-full ${progressService.step === 4 ? 'max-w-full' : 'max-w-[500px]'}`}
        >
          {renderSubComponent()}
        </main>
        <SelectedType
          isOpen={showModalTypeSelected}
          onSelect={(tipo) => handleClickSelected(tipo)} 
          onClose={handleClickSelectedClose}
        />
        <ModalLimiteServicios
          isOpen={showModalLimite}
          onClose={() => setShowModalLimite(false)}
          limite={user?.limiteServicios || 0}
        />
      </div>
    </div>
  );
};

export default Publicador;
