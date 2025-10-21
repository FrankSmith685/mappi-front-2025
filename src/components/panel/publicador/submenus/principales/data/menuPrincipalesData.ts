// src/data/menuCuentaData.ts
import type { IconType } from "react-icons";
import {
  AiOutlineShop,        // negocio/tienda
  AiOutlineCoffee,      // huarique (comida/bebida)
} from "react-icons/ai";

export interface MenuCuentaItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuPrincipalesData: MenuCuentaItem[] = [
  {
    label: "Perfil de Negocio",
    path: "/panel/publicador/principales/perfilnegocio",
    icon: AiOutlineShop,
  },
  {
    label: "Huarique",
    path: "/panel/publicador/principales/huarique",
    icon: AiOutlineCoffee,
  },
];
