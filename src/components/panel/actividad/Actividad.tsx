import { useParams, Navigate } from "react-router-dom";
import { getMenuActividadData } from "./data/menuActividadData";
import Contactos from "./submenu/comensal/contactos/Contactos";
import Favoritos from "./submenu/comensal/favoritos/Favoritos";
import Historial from "./submenu/comensal/historial/Historial";
import Descartados from "./submenu/comensal/descartados/Descartados";
import BusquedasAlertas from "./submenu/comensal/busquedasAlertas/BusquedasAlertas";

import Clientes from "./submenu/emprendedor/clientes/Clientes";
import Resenas from "./submenu/emprendedor/resenas/Resenas";
import Estadisticas from "./submenu/emprendedor/estadisticas/Estadisticas";
import Ventas from "./submenu/emprendedor/ventas/Ventas";
import Reservas from "./submenu/emprendedor/reservas/Reservas";

import { CustomSidebarSubMenu } from "../../ui/CustomSidebarSubMenuUser";
import CuentaSectionLayout from "../../ui/CustomCuentaSectionLayaout";
import { useAppState } from "../../../hooks/useAppState";
import { FaClipboardList } from "react-icons/fa";

const Actividad = () => {
  const { suboption } = useParams<{ suboption?: string }>();
  const { setMenuOpenUser, menuOpenUser, user } = useAppState();

  const codTipo = user?.tipo_usuario?.[0]?.cod_tipo_usuario;
  const esComensal = codTipo === 4;

  // Rutas válidas según el tipo de usuario
  const validOptionsComensal = [
    "contactos",
    "favoritos",
    "historial",
    "descartados",
    "busquedas-alertas",
  ];

  const validOptionsEmprendedor = [
    "clientes",
    "resenas",
    "estadisticas",
    "ventas",
    "reservas",
  ];

  const validOptions = esComensal
    ? validOptionsComensal
    : validOptionsEmprendedor;

  if (!suboption || !validOptions.includes(suboption)) {
    // Redirige al primero válido según tipo
    const defaultPath = esComensal
      ? "/panel/actividad/contactos"
      : "/panel/actividad/clientes";
    return <Navigate to={defaultPath} replace />;
  }

  const props = {
    menuOpenUser,
    onToggleSidebar: () => setMenuOpenUser(!menuOpenUser),
  };

  const renderSubComponent = () => {
    if (esComensal) {
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
    } else {
      switch (suboption) {
        case "clientes":
          return (
            <CuentaSectionLayout title="Mis Clientes o Contactos" {...props}>
              <Clientes />
            </CuentaSectionLayout>
          );
        case "resenas":
          return (
            <CuentaSectionLayout title="Mis Reseñas" {...props}>
              <Resenas />
            </CuentaSectionLayout>
          );
        case "estadisticas":
          return (
            <CuentaSectionLayout title="Mis Estadísticas o Analíticas" {...props}>
              <Estadisticas />
            </CuentaSectionLayout>
          );
        case "ventas":
          return (
            <CuentaSectionLayout title="Mis Ventas o Solicitudes" {...props}>
              <Ventas />
            </CuentaSectionLayout>
          );
        case "reservas":
          return (
            <CuentaSectionLayout title="Mi Historial de Reservas o Pedidos" {...props}>
              <Reservas />
            </CuentaSectionLayout>
          );
      }
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
          titleIcon={FaClipboardList}
          menuData={getMenuActividadData(codTipo)}
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
