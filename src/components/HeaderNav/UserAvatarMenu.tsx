import { useState, type JSX } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAppState } from "../../hooks/useAppState";
import { userMenuItemsData, type SectionType } from "./data/userMenuItemData";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const UserAvatarMenu = () => {
  const { user } = useAppState();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const {logout} = useAuth();
  const navigate = useNavigate();

  const initials = `${(user?.nombre || user?.correo || "").charAt(0)}${(user?.apellido || "").charAt(0)}`
    .toUpperCase()
    .trim();

  const onLogout=()=>{
    logout();
  }

  const renderMenuItems = () => {
    const sections: Record<SectionType, JSX.Element[]> = {
      top: [],
      middle: [],
      bottom: [],
    };

    userMenuItemsData.forEach((item) => {
      if (item?.isActive === false) return; 
      const Icon = item.icon;
      const handleClick = () => {
        if (item.isLogout) {
          onLogout();
        } else if (item.path) {
          navigate(item.path);
        }
      };
      const element = (
        <li
          key={item.label}
          onClick={handleClick}
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${
            item.isLogout ? "text-red-800" : ""
          }`}
        >
          <Icon className={item.isLogout ? "text-red-700" : "text-gray-700"} />
          {item.label}
        </li>
      );
      sections[item.section].push(element);
    });

    return (
      <>
        {sections.top}
        <li className="border-t border-gray-300 my-1" />
        {sections.middle}
        <li className="border-t border-gray-300 my-1" />
        {sections.bottom}
      </>
    );
  };

  return (
    <div
      className="relative ml-2 h-[80px] flex items-center gap-1 z-[30000]"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
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
        {showMenu ? <FaChevronUp size={12} className="text-white"/> : <FaChevronDown size={12} className="text-white"/>}
      </div>

      {
        showMenu && (
          <div className="absolute top-full right-0 mt-0 w-[290px] p-4 bg-white shadow-lg border border-gray-200 rounded-lg">
          <div className="w-full gap-0 flex flex-col border-b border-gray-300 pb-2 mb-2">
            <p className="text-gray-800 font-semibold">{user?.nombre}</p>
            <p className="text-gray-700 text-sm">{user?.correo}</p>
          </div>

          <ul className="text-sm text-gray-800 space-y-2">{renderMenuItems()}</ul>
        </div>
        )
      }
    </div>
  );
};
