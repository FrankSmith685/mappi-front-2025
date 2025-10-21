import type { IconType } from "react-icons";
import { FaBuilding } from "react-icons/fa";

export interface MenuCuentaItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuPublicarData: MenuCuentaItem[] = [
  {
    label: "Publicar",
    path: "/panel/publicador/publicar",
    icon: FaBuilding  ,
  },
];
