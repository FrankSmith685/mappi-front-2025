import { AiOutlineCopy, AiOutlineMail, AiOutlineSmile } from "react-icons/ai";
import { FaRegTimesCircle } from "react-icons/fa";
import type { ReactNode } from "react";

// data/pendingTask.ts
export type TaskKey =
  | "consultas_pendientes"
  | "avisos_incompletos"
  | "avisos_duplicados"
  | "reportes_pendientes";


export interface PendingTaskItem {
  key: TaskKey;
  icon: ReactNode;
  title: string;
  description: string;
  count?: number; 
}


export const pendingTask: PendingTaskItem[] = [
  {
    key: "consultas_pendientes",
    icon: <AiOutlineMail size={24} />,
    title: "Consultas",
    description: "", // Se llenará dinámicamente
  },
  {
    key: "avisos_incompletos",
    icon: <AiOutlineSmile size={24} />,
    title: "Avisos a completar",
    description: "",
  },
  {
    key: "avisos_duplicados",
    icon: <AiOutlineCopy size={24} />,
    title: "Avisos duplicados",
    description: "",
  },
  {
    key: "reportes_pendientes",
    icon: <FaRegTimesCircle size={24} />,
    title: "Reportes",
    description: "",
  },
];
