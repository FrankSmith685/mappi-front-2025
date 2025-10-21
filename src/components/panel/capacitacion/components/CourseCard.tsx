import React from "react";
import { FiLock, FiPlay } from "react-icons/fi";
import { imageBaseUrl } from "../../../../api/apiConfig";
// import { imageBaseUrl } from "../../api/apiConfig";

export interface CourseCardProps {
  CURS_Id: number;
  CURS_Titulo: string;
  CURS_Descripcion?: string;
  CURS_Tipo: "audio" | "video";
  CURS_Autor: string;
  CURS_Avatar?: string;
  desbloqueado: boolean;
  completado: boolean;
  porcentaje: number;
  imagen: string;
  onClick?: (id: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  CURS_Id,
  CURS_Titulo,
  CURS_Descripcion,
  CURS_Autor,
  CURS_Avatar,
  desbloqueado,
  completado,
  porcentaje,
  imagen,
  onClick,
}) => {
  const avatar =
    CURS_Avatar && CURS_Avatar.trim() !== ""
      ? CURS_Avatar
      : "/default-avatar.png";

  const handleClick = () => {
    if (desbloqueado && onClick) onClick(CURS_Id);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-500 cursor-pointer group ${
        desbloqueado
          ? "hover:shadow-2xl hover:-translate-y-2"
          : "opacity-70 cursor-not-allowed"
      }`}
    >
      {/* Imagen principal */}
      <div className="relative w-full h-48 overflow-hidden">
        <img src={`${imageBaseUrl}${imagen}`} alt={CURS_Titulo} className="object-cover w-full !h-48 transform group-hover:scale-125 transition-transform duration-700 ease-out"/>

        {/* Gradiente superior */}
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/60 to-transparent p-3 flex justify-between items-start">
          {!desbloqueado && (
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
              Curso bloqueado
            </span>
          )}
          {!desbloqueado && (
            <FiLock className="text-white text-xl drop-shadow animate-pulse" />
          )}
        </div>

        {/* 🔒 Overlay oscuro permanente cuando está bloqueado */}
        {!desbloqueado && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-center text-white">
              <FiLock className="mx-auto mb-2 text-4xl opacity-90" />
              <p className="text-sm font-medium opacity-90">Contenido bloqueado</p>
            </div>
          </div>
        )}

        {/* ▶ Overlay hover con ícono Play */}
        {desbloqueado && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500">
              <FiPlay className="text-white text-4xl bg-primary p-2 rounded-full shadow-lg hover:bg-primary/80" />
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        {desbloqueado && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200">
            <div
              className={`h-full ${
                completado ? "bg-green-500" : "bg-primary"
              } rounded-tr-xl rounded-br-xl transition-all duration-500`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        )}
      </div>


      {/* Contenido inferior */}
      <div className="p-4 bg-gray-900 text-white relative sm:h-[150px]">

        <h2 className="text-lg font-semibold mb-1 line-clamp-1 text-white">
          {CURS_Titulo}
        </h2>

        <p className="text-sm text-gray-100 line-clamp-2">
          {CURS_Descripcion || "Sin descripción disponible."}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <img
              src={avatar}
              alt={CURS_Autor}
              className="w-8 h-8 rounded-full border-2 border-primary object-cover"
            />
            <span className="font-medium text-primary">{CURS_Autor}</span>
          </span>

          {desbloqueado && (
            <span className="flex items-center gap-1 text-sm font-semibold bg-primary/20 px-3 py-1 rounded-full group-hover:bg-primary/30 transition text-primary">
              <FiPlay className="text-sm" /> Iniciar
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
