/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { imageBaseUrl } from "../../../../../api/apiConfig";
import { useCurso } from "../../../../../hooks/useCurso";
import { VideoPlayerBar } from "./VideoPlayer";

interface CursoDetalleProps {
  curso: {
    CURS_Id: number;
    CURS_Titulo: string;
    CURS_Descripcion?: string;
    CURS_Autor: string;
    CURS_Tipo: "audio" | "video";
    CURS_Avatar?: string;
    imagen?: string;
    ModulosCursos: any[];
    modulos: {
      MODU_Id: number;
      MODU_Titulo: string;
      MODU_Orden: number;
      MODU_UrlContenido: string;
      desbloqueado: boolean;
      completado: boolean;
      porcentaje: number;
    }[];
  };
  onProgresoActualizado?: (data: {
    CURS_Id: number;
    porcentaje: number;
    completado: boolean;
  }) => void;
}

export const CursoDetalleVideo: React.FC<CursoDetalleProps> = ({
  curso,
  onProgresoActualizado,
}) => {
  const { guardarProgreso } = useCurso();
  const [cursoLocal, setCursoLocal] = useState(curso);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState(false);

  const [moduloActivo, setModuloActivo] = useState(() => {
    if (!curso.modulos || curso.modulos.length === 0) return null;
    const pendiente = [...curso.modulos].find((m) => m.desbloqueado && !m.completado);
    return pendiente || curso.modulos[0];
  });

  const imagenPrincipal =
    curso.imagen && curso.imagen !== ""
      ? `${imageBaseUrl}${curso.imagen}`
      : curso.CURS_Avatar || "/default-avatar.png";

  const handleVideoEnded = async () => {
    if (!moduloActivo) return;

    await guardarProgreso({
      CURS_Id: curso.CURS_Id,
      MODU_Id: moduloActivo.MODU_Id,
      porcentajeModulo: 100,
      completadoModulo: true,
      tiempoActual: moduloActivo.porcentaje || 0,
    });

    const siguiente = cursoLocal.modulos.find(
      (m) => m.MODU_Orden === moduloActivo.MODU_Orden + 1
    );

    const nuevos = cursoLocal.modulos.map((m) => {
      if (m.MODU_Id === moduloActivo.MODU_Id)
        return { ...m, completado: true, porcentaje: 100 };
      if (siguiente && m.MODU_Id === siguiente.MODU_Id)
        return { ...m, desbloqueado: true };
      return m;
    });

    setCursoLocal({ ...cursoLocal, modulos: nuevos });
    if (siguiente) {
      setModuloActivo(siguiente);
      setAutoPlayTrigger(true);
    }

    const completados = nuevos.filter((m) => m.completado).length;
    const porcentaje = Math.round((completados / nuevos.length) * 100);
    onProgresoActualizado?.({
      CURS_Id: curso.CURS_Id,
      porcentaje,
      completado: completados === nuevos.length,
    });
  };

  useEffect(() => {
    if (autoPlayTrigger) setTimeout(() => setAutoPlayTrigger(false), 800);
  }, [autoPlayTrigger]);

  return (
    <div className="w-full lg:max-w-6xl mx-auto flex flex-col-reverse lg:flex-col gap-6">
      {/* 🎬 Sección de video + lista de módulos */}
<div className=" flex flex-col lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* 🎥 Video principal */}
  <div className="col-span-2 bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
    {moduloActivo && (
      <VideoPlayerBar
        titulo={moduloActivo.MODU_Titulo}
        src={moduloActivo.MODU_UrlContenido}
        onEnded={handleVideoEnded}
        autoPlay={autoPlayTrigger}
        showNextPrev={true}
        onNext={() => {
          const siguiente = cursoLocal.modulos.find(
            (m) => m.MODU_Orden === moduloActivo.MODU_Orden + 1 && m.desbloqueado
          );
          if (siguiente) {
            setModuloActivo(siguiente);
            setAutoPlayTrigger(true);
          }
        }}
        onPrev={() => {
          const anterior = [...cursoLocal.modulos]
            .reverse()
            .find(
              (m) =>
                m.MODU_Orden === moduloActivo.MODU_Orden - 1 && m.desbloqueado
            );
          if (anterior) {
            setModuloActivo(anterior);
            setAutoPlayTrigger(true);
          }
        }}
      />
    )}
  </div>

  {/* 📚 Lista de capítulos */}
  <div
    className="
      col-span-1 bg-gradient-to-br from-white via-orange-50 to-orange-100 
      rounded-3xl overflow-y-auto lg:h-[440px] border border-orange-200 shadow-xl 
      transition-all duration-500
      max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-none
    "
  >
    <h2 className="sticky top-0 bg-gray-800 z-20 text-white px-6 py-4 rounded-t-lg text-lg tracking-wide shadow-md flex items-center gap-2">
      <FiPlay className="text-white/90 text-2xl animate-pulse drop-shadow-md" />
      <span className="drop-shadow-lg">Capítulos del curso</span>
    </h2>

    <ul className="divide-y divide-orange-200 px-2 pb-2">
      {cursoLocal.modulos?.map((modulo) => {
        const isActive = moduloActivo?.MODU_Id === modulo.MODU_Id;
        const isLocked = !modulo.desbloqueado;
        return (
          <li
            key={modulo.MODU_Id}
            onClick={() => {
              if (!isLocked) setModuloActivo(modulo);
            }}
            className={`group flex justify-between items-center px-6 py-4 rounded-2xl my-2 cursor-pointer relative transition-all duration-500 overflow-hidden 
              ${
                isLocked
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                  : isActive
                  ? "bg-primary text-white shadow-lg scale-[1.00]"
                  : "bg-white hover:bg-primary/10 text-gray-800 hover:text-primary"
              }`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-500 ${
                isActive ? "bg-white" : "bg-primary/0"
              }`}
            ></div>

            <div className="relative z-10">
              <p
                className={`text-xs uppercase tracking-wider font-semibold ${
                  isActive ? "text-white/80" : "text-primary"
                }`}
              >
                Capítulo {modulo.MODU_Orden}
              </p>
              <p
                className={`text-sm mt-1 font-medium ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-primary transition-colors duration-300"
                }`}
              >
                {modulo.MODU_Titulo}
              </p>
            </div>

            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500
              ${
                isActive
                  ? "bg-white text-primary border-transparent"
                  : "border-primary/40 text-primary group-hover:bg-primary group-hover:text-gray-500"
              }`}
            >
              <FiPlay className="text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            {isLocked && (
              <span className="absolute right-4 text-gray-400 text-xs">🔒</span>
            )}
            {modulo.completado && !isLocked && (
              <span className="absolute right-20 top-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                Finalizado
              </span>
            )}
          </li>
        );
      })}
    </ul>
  </div>
</div>


      {/* ℹ️ Información del curso */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 mt-2">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-1/3">
            <img
              src={imagenPrincipal}
              alt={curso.CURS_Titulo}
              className="w-full rounded-2xl shadow-md object-cover"
            />
          </div>
          <div className="sm:w-2/3">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {curso.CURS_Titulo}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {curso.CURS_Descripcion || "Sin descripción disponible."}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src={curso.CURS_Avatar || "/default-avatar.png"}
                alt={curso.CURS_Autor}
                className="w-12 h-12 rounded-full border-2 border-primary object-cover"
              />
              <div>
                <span className="block font-semibold text-primary">
                  {curso.CURS_Autor}
                </span>
                <span className="text-sm text-gray-500">Instructor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
