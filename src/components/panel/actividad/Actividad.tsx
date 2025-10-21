import { useParams, Navigate } from "react-router-dom";
import { menuActividadData } from "./data/menuActividadData";
import Contactos from "./submenu/contactos/Contactos";
import Favoritos from "./submenu/favoritos/Favoritos";
import Historial from "./submenu/historial/Historial";
import Descartados from "./submenu/descartados/Descartados";
import BusquedasAlertas from "./submenu/busquedasAlertas/BusquedasAlertas";
import { CustomSidebarSubMenu } from "../../ui/CustomSidebarSubMenuUser";
import CuentaSectionLayout from "../../ui/CustomCuentaSectionLayaout";
import { useAppState } from "../../../hooks/useAppState";
import { FaClipboardList } from "react-icons/fa";

const Actividad = () => {
  const { suboption } = useParams<{ suboption?: string }>();
  const { setMenuOpenUser, menuOpenUser } = useAppState();

  const validOptions = ["contactos", "favoritos", "historial", "descartados","busquedas-alertas"];

  if (!suboption || !validOptions.includes(suboption)) {
    return <Navigate to="/panel/actividad/contactos" replace />;
  }

  // const filteredMenuData = menuActividadData.filter((item) => {
  //     if ((item.path?.includes("password") || item.path?.includes("email")) && !user?.metodosLogin?.includes("correo")) {
  //       return false;
  //     }
  
  //     // Ocultar "vincular" si por alguna razón no tiene metodosLogin definido
  //     if (item.path?.includes("vincular") && (!user?.metodosLogin || user?.metodosLogin.length === 0)) {
  //       return false;
  //     }
  
  //     return true;
  //   });

  
  const renderSubComponent = () => {
  const props = { menuOpenUser, onToggleSidebar: () => setMenuOpenUser(!menuOpenUser) };

  switch (suboption) {
    case "contactos":
      return (
        <CuentaSectionLayout title="Mis Contactos" {...props}>
          <Contactos />
        </CuentaSectionLayout>
      );
    case "favoritos":
      return (
        <CuentaSectionLayout title="Mis Favoritos" {...props}>
          <Favoritos />
        </CuentaSectionLayout>
      );
    case "historial":
      return (
        <CuentaSectionLayout title="Mi Historial" {...props}>
          <Historial />
        </CuentaSectionLayout>
      );
    case "descartados":
      return (
        <CuentaSectionLayout title="Mis Descartados" {...props}>
          <Descartados />
        </CuentaSectionLayout>
      );
    case "busquedas-alertas":
      return (
        <CuentaSectionLayout title="Mis Búsquedas y Alertas" {...props}>
          <BusquedasAlertas />
        </CuentaSectionLayout>
      );
  }
};


  return (
    <div className="flex gap-6 flex-wrap md:flex-nowrap px-0">

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
          title="Mi Actividad"
          titleIcon={FaClipboardList }
          menuData={menuActividadData}
          onItemClick={() => setMenuOpenUser(false)}
        />
      </div>
      <main
        className={`${
          menuOpenUser ? "ml-[0px] sm:ml-[120px]" : "md:ml-[120px]"
        } flex-1 bg-white responsive-padding`}
      >
        {renderSubComponent()}
      </main>
    </div>
  );
};

export default Actividad;
