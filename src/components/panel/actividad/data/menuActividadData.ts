import type { IconType } from "react-icons";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineHistory,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";

export interface MenuActividadItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuActividadData: MenuActividadItem[] = [
  {
    label: "Mis contactos",
    path: "/panel/actividad/contactos",
    icon: AiOutlineUser,
  },
  {
    label: "Mis Favoritos",
    path: "/panel/actividad/favoritos",
    icon: AiOutlineHeart,
  },
  {
    label: "Mi Historial",
    path: "/panel/actividad/historial",
    icon: AiOutlineHistory,
  },
  {
    label: "Mis Descartados",
    path: "/panel/actividad/descartados",
    icon: AiOutlineCloseCircle,
  },
  {
    label: "Mis Búsquedas y alertas",
    path: "/panel/actividad/busquedas-alertas",
    icon: AiOutlineSearch,
  },
];

