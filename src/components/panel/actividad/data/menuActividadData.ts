import type { IconType } from "react-icons";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineHistory,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";

import {
  FaUsers,
  FaStar,
  FaChartBar,
  FaShoppingCart,
  FaCalendarCheck,
} from "react-icons/fa";

export interface MenuActividadItem {
  label: string;
  path: string;
  icon: IconType;
}

/** 🔹 Menú para COMENSAL */
const menuActividadComensal: MenuActividadItem[] = [
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

/** 🔹 Menú para EMPRENDEDOR */
const menuActividadEmprendedor: MenuActividadItem[] = [
  {
    label: "Mis Clientes",
    path: "/panel/actividad/clientes",
    icon: FaUsers,
  },
  {
    label: "Mis Reseñas",
    path: "/panel/actividad/resenas",
    icon: FaStar,
  },
  {
    label: "Mis Estadísticas",
    path: "/panel/actividad/estadisticas",
    icon: FaChartBar,
  },
  {
    label: "Mis Ventas",
    path: "/panel/actividad/ventas",
    icon: FaShoppingCart,
  },
  {
    label: "Mis Reservas",
    path: "/panel/actividad/reservas",
    icon: FaCalendarCheck,
  },
];

/**
 * 🔸 Función que devuelve el menú según tipo de usuario
 * @param tipoUsuarioCod Código del tipo de usuario
 */
export const getMenuActividadData = (tipoUsuarioCod?: number): MenuActividadItem[] => {
  if (tipoUsuarioCod === 4) {
    // 4 = comensal
    return menuActividadComensal;
  }
  // cualquier otro = emprendedor
  return menuActividadEmprendedor;
};
