// src/data/menuCuentaData.ts
import type { IconType } from "react-icons";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineMail,
  AiOutlineBell,
  AiOutlineDelete,
  AiOutlineLink,
} from "react-icons/ai";

export interface MenuCuentaItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuCuentaData: MenuCuentaItem[] = [
  {
    label: "Datos de cuenta",
    path: "/panel/cuenta/datos",
    icon: AiOutlineUser,
  },
  {
    label: "Cambiar contraseña",
    path: "/panel/cuenta/password",
    icon: AiOutlineLock,
  },
  {
    label: "Cambiar correo",
    path: "/panel/cuenta/email",
    icon: AiOutlineMail,
  },
  {
    label: "Vincular cuenta",
    path: "/panel/cuenta/vincular",
    icon: AiOutlineLink,
  },
  {
    label: "Ajustes de notificaciones",
    path: "/panel/cuenta/notificaciones",
    icon: AiOutlineBell,
  },
  {
    label: "Eliminar cuenta",
    path: "/panel/cuenta/eliminar",
    icon: AiOutlineDelete,
  },
];
