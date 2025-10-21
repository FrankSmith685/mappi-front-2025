import type { IconType } from "react-icons";
import {
  AiOutlinePicture,
} from "react-icons/ai";

export interface MenuCuentaItem {
  label: string;
  path: string;
  icon: IconType;
}

export const menuMultimediaData: MenuCuentaItem[] = [
  {
    label: "Multimedia",
    path: "/panel/publicador/multimedia",
    icon: AiOutlinePicture,
  },
];
