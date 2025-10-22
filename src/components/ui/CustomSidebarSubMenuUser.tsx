import { NavLink } from "react-router-dom";
import type { MenuCuentaItem } from "../../interfaces/sidebarMenuUser";
import type { IconType } from "react-icons";

interface SidebarMenuProps {
  title?: string;
  titleIcon?: IconType;
  menuData: MenuCuentaItem[];
  onItemClick?: () => void; //  opcional
}

export const CustomSidebarSubMenu = ({
  title = "Mi Cuenta",
  titleIcon: TitleIcon,
  menuData,
  onItemClick, //  recibido
}: SidebarMenuProps) => {
  return (
    <aside className="w-[100px] sm:w-[120px] bg-[#263238] height-custom-sidebar-menu flex fixed flex-col items-center py-4 overflow-y-auto overflow-x-hidden">
      {/* Bloque perfil */}
      <div className="w-full bg-[#37474F] flex flex-col items-center py-4">
        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
          {TitleIcon ? <TitleIcon className="text-xl" /> : null}
        </div>
        <span className="mt-2 text-sm text-gray-300 text-center">{title}</span>
      </div>

      {/* Menú */}
      <ul className="flex flex-col items-center w-full mt-6 space-y-2">
        {menuData.map(({ label, path, icon: Icon }) => (
          <li key={path} className="w-full flex justify-center">
            <NavLink
              to={path}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-sm text-center w-full px-3 py-2 relative ${
                  isActive
                    ? "text-white before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-600"
                    : "text-gray-300 hover:text-white"
                }`
              }
              onClick={onItemClick}
            >
              <Icon className="text-2xl" />
              <span className="text-xs">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};
