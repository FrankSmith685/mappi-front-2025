import type { IconType } from "react-icons";
import { FaMapMarkerAlt } from "react-icons/fa";

export interface MenuCuentaItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuUbicacionData: MenuCuentaItem[] = [
  {
    label: "Ubicación",
    path: "/panel/publicador/ubicacion",
    icon: FaMapMarkerAlt ,
  },
];
