import { useRef } from "react";
import CustomLogo from "../ui/CustomLogo";
// import MainMenu from "./MainMenu";
import UserActions from "./UserActions";
import { FaBars, FaTimes } from "react-icons/fa";
import MainMenuMobile from "./MainMenuMobile";
import { useAppState } from "../../hooks/useAppState";
import { useLocation } from "react-router-dom";
import MainMenu from "./MainMenu";

const HeaderNav = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {menuOpen,setMenuOpen} = useAppState();

  const location = useLocation();

  // Si la ruta actual es "/inicio", no renderizar nada
  if (location.pathname === "/iniciar" || location.pathname === "/registrar" || location.pathname === "/recuperar" || location.pathname === "/cambiar-contrasena" ) {
    return null;
  }

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-50 px-4 shadow-sm bg-primary-gradient-v2 flex justify-between items-center h-[80px]`}>
        {/* Logo */}
        <div className="flex items-center gap-4 overflow-hidden h-full">
          <CustomLogo isActive={true} />
          <div className="hidden md:flex">
            <MainMenu />
          </div>
        </div>

        {/* Acciones + menú móvil */}
        <div className="flex items-center gap-4 lg:gap-2">
          <UserActions menuOpen={menuOpen} />
          <button
            className="lg:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <FaBars className={`${menuOpen ? "hidden" : ""} text-white text-2xl hover:cursor-pointer`} />
            <FaTimes className={`${menuOpen ? "" : "hidden"} text-white text-2xl hover:cursor-pointer`} />
          </button>
        </div>

        {/* Menú móvil desplegable con animación */}
        <div
          ref={menuRef}
          style={{ height: 'calc(100vh - 80px)' }}
          className={`absolute top-full left-0 w-full border-t-gray-200 border-t-[1px] bg-white shadow-sm lg:hidden z-50 transform transition-all duration-300 origin-top overflow-y-auto ${
            menuOpen ? "scale-y-100 opacity-100 max-h-[1000px]" : "scale-y-0 opacity-0 max-h-0"
          }`}
        >
          <MainMenuMobile />
        </div>
      </header>
      <div className="mt-[80px]"></div>
    </>
  );
};

export default HeaderNav;
