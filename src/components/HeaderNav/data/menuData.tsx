import {
  FaHeart,
  FaBell,
  FaEye,
  FaUserFriends,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaClipboardList,
  FaUsers,
  FaFileContract,
  FaCrown,
} from "react-icons/fa";
import type { QuickAccessItem } from "../../../interfaces/menuHeaderInterface";


export const quickAccess: QuickAccessItem[] = [
  { label: "Mis contactos", icon: FaUserFriends, isActive: true,path: "/panel/actividad/contactos" },
  { label: "Favoritos", icon: FaHeart , isActive: true, path: "/panel/actividad/favoritos" },
  { label: "Búsquedas y alertas", icon: FaBell , isActive: true, path: "/panel/actividad/busquedas-alertas" },
  { label: "Historial", icon: FaEye , isActive: true, path: "/panel/actividad/historial" },
  { label: "Mis Avisos", icon: FaClipboardList, isActive: false, path: "/panel/avisos" },
  { label: "Interesados", icon: FaUsers, isActive: false, path: "/panel/interesados" },
  { label: "Mi Actividad", icon: FaEye, isActive: false, path: "/panel/actividad" },
  // { label: "Contrataciones", icon: FaFileContract, isActive: false,path: "/panel/contrataciones" },
  { label: "Mi Capacitación", icon: FaFileContract, isActive: false,path: "/panel/capacitaciones" },
  { label: "Mis Planes", icon: FaCrown, isActive: false,path: "/panel/planes" },
  { label: "Mi cuenta", icon: FaUser, path: "/panel/cuenta" },
  { label: "Ajustes de notificaciones",icon: FaCog, path: "/panel/cuenta/notificaciones" },
  { label: "Ayudar",icon: FaQuestionCircle},
  { label: "Cerrar sesión",icon: FaSignOutAlt,isLogout: true, },
];

