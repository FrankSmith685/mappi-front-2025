import { useParams, Navigate } from "react-router-dom";
import Datos from "./submenus/datos/Datos";
import Password from "./submenus/password/Password";
import { menuCuentaData } from "./data/menuCuentaData";
import Correo from "./submenus/correo/Correo";
import Notificaciones from "./submenus/notificaciones/Notificaciones";
import Eliminar from "./submenus/eliminar/Eliminar";
import { CustomSidebarSubMenu } from "../../ui/CustomSidebarSubMenuUser";
import { FaUserCircle } from "react-icons/fa";
import { useAppState } from "../../../hooks/useAppState";
import VincularCuenta from "./submenus/vincular/VincularCuenta";
import CuentaSectionLayout from "../../ui/CustomCuentaSectionLayaout";


const Cuenta = () => {
  const { suboption } = useParams<{ suboption?: string }>();
  const { setMenuOpenUser, menuOpenUser, user } = useAppState();

  // Opciones válidas
  const validOptions = ["datos", "password", "email", "vincular", "notificaciones", "eliminar"];

  // 🚨 Validación: si no existe la suboption o no es válida → redirigir a datos
  if (!suboption || !validOptions.includes(suboption)) {
    return <Navigate to="/panel/cuenta/datos" replace />;
  }

  // 🚨 Validación: si intenta entrar a password pero no tiene login por correo → redirigir a datos
  if ((suboption === "password" || suboption === "email") && !user?.metodosLogin?.includes("correo")) {
    return <Navigate to="/panel/cuenta/datos" replace />;
  }

  // Filtrar el menú dinámicamente para ocultar password si no tiene correo
  const filteredMenuData = menuCuentaData.filter((item) => {
    if ((item.path?.includes("password") || item.path?.includes("email")) && !user?.metodosLogin?.includes("correo")) {
      return false;
    }

    // Ocultar "vincular" si por alguna razón no tiene metodosLogin definido
    if (item.path?.includes("vincular") && (!user?.metodosLogin || user?.metodosLogin.length === 0)) {
      return false;
    }

    return true;
  });


  const renderSubComponent = () => {
  const props = { menuOpenUser, onToggleSidebar: () => setMenuOpenUser(!menuOpenUser) };

  switch (suboption) {
    case "datos":
      return (
        <CuentaSectionLayout title="Datos de Cuenta" {...props}>
          <Datos />
        </CuentaSectionLayout>
      );
    case "password":
      return (
        <CuentaSectionLayout title="Cambiar Contraseña" {...props}>
          <Password />
        </CuentaSectionLayout>
      );
    case "email":
      return (
        <CuentaSectionLayout title="Cambiar Correo" {...props}>
          <Correo />
        </CuentaSectionLayout>
      );
    case "vincular":
      return (
        <CuentaSectionLayout title="Vincular Cuenta" {...props}>
          <VincularCuenta />
        </CuentaSectionLayout>
      );
    case "notificaciones":
      return (
        <CuentaSectionLayout title="Ajuste de Notificaciones" {...props}>
          <Notificaciones />
        </CuentaSectionLayout>
      );
    case "eliminar":
      return (
        <CuentaSectionLayout title="Eliminar Cuenta" {...props}>
          <Eliminar />
        </CuentaSectionLayout>
      );
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
          title="Mi Cuenta"
          titleIcon={FaUserCircle}
          menuData={filteredMenuData}
          onItemClick={() => setMenuOpenUser(false)}
        />
      </div>

      {/* Contenido */}
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

export default Cuenta;
