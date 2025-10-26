import React, { useEffect, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { AudioPlayerBar } from "./AudioPlayer";
import { imageBaseUrl } from "../../../../../api/apiConfig";
import { useCurso } from "../../../../../hooks/useCurso";
// import { imageBaseUrl } from "../../../../api/apiConfig"; //  mismo import que CourseCard

interface CursoDetalleProps {
  curso: {
    CURS_Id: number;
    CURS_Titulo: string;
    CURS_Descripcion?: string;
    CURS_Autor: string;
    CURS_Tipo: "audio" | "video";
    CURS_Avatar?: string;
    imagen?: string;
    ModulosCursos: {
      MODU_Id: number;
      MODU_Titulo: string;
      MODU_Orden: number;
      MODU_UrlContenido: string;
    }[];
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




export const CursoDetalleAudio: React.FC<CursoDetalleProps> = ({ curso, onProgresoActualizado }) => {

    const {guardarProgreso} = useCurso();
    const [cursoLocal, setCursoLocal] = useState(curso);


  const [moduloActivo, setModuloActivo] = useState(() => {
        if (!cursoLocal.modulos || cursoLocal.modulos.length === 0) return null;

        //  Buscar el último módulo desbloqueado pero no completado
        const ultimoDesbloqueadoNoCompletado = [...cursoLocal.modulos]
            .reverse()
            .find((m) => m.desbloqueado && !m.completado);

        if (ultimoDesbloqueadoNoCompletado) return ultimoDesbloqueadoNoCompletado;

        //  Si todos están completados, selecciona el último módulo del curso
        const ultimoDesbloqueado = [...cursoLocal.modulos]
            .reverse()
            .find((m) => m.desbloqueado);

        return ultimoDesbloqueado || cursoLocal.modulos[0];
    });
    const [autoPlayTrigger, setAutoPlayTrigger] = useState(false);



  //  Definir la imagen principal (usa la misma lógica que CourseCard)
  const imagenPrincipal = curso.imagen
    ? `${imageBaseUrl}${curso.imagen}`
    : curso.CURS_Avatar && curso.CURS_Avatar.trim() !== ""
    ? curso.CURS_Avatar
    : "/default-avatar.png";

  const handleAudioEnded = async () => {
  if (!moduloActivo) return;

  // 🧩 Guardar progreso actual
  await guardarProgreso({
    CURS_Id: curso?.CURS_Id,
    MODU_Id: moduloActivo.MODU_Id,
    porcentajeModulo: 100,
    completadoModulo: true,
    tiempoActual: moduloActivo.porcentaje || 0,
  });

  //  Buscar siguiente módulo
  const siguiente = cursoLocal.modulos.find(
    (m) => m.MODU_Orden === moduloActivo.MODU_Orden + 1
  );

  // 🔄 Actualizar el array de módulos SIN mutar directamente el prop
  const nuevosModulos = cursoLocal.modulos.map((m) => {
    if (m.MODU_Id === moduloActivo.MODU_Id)
      return { ...m, completado: true, porcentaje: 100 };
    if (siguiente && m.MODU_Id === siguiente.MODU_Id)
      return { ...m, desbloqueado: true };
    return m;
  });

  //  Actualizamos el estado local del curso
  setCursoLocal((prev) => ({ ...prev, modulos: nuevosModulos }));

  //  Actualizamos el módulo activo
  if (siguiente) {
    setModuloActivo({ ...siguiente, desbloqueado: true });
    setAutoPlayTrigger(true);
  } else {
    console.log("🎉 Curso completado!");
  }

  // 🔔 Notificamos al padre el nuevo progreso
  const total = nuevosModulos.length;
  const completados = nuevosModulos.filter((m) => m.completado).length;
  const porcentajeCurso = Math.round((completados / total) * 100);
  const completadoCurso = completados === total;

  onProgresoActualizado?.({
    CURS_Id: curso.CURS_Id,
    porcentaje: porcentajeCurso,
    completado: completadoCurso,
  });
};



useEffect(() => {
  if (autoPlayTrigger) {
    setTimeout(() => setAutoPlayTrigger(false), 1000);
  }
}, [autoPlayTrigger]);




  return (
    <div className="w-full flex flex-col-reverse lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {/* 📘 Lista de capítulos */}
        <div className="col-span-2 relative bg-gradient-to-br from-white via-orange-50 to-orange-100 rounded-3xl overflow-y-auto h-[440px] border border-orange-200 shadow-xl transition-all duration-500">
            {/* HEADER */}
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
                            ${isLocked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                            : isActive
                            ? "bg-primary text-white shadow-lg scale-[1.00]"
                            : "bg-white hover:bg-primary/10 text-gray-800 hover:text-primary"
                            }`}
                    >
                    {/* Indicador lateral del activo */}
                    <div
                        className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-500 ${
                        isActive ? "bg-white" : "bg-primary/0"
                        }`}
                    ></div>

                    {/* Texto */}
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

                    {/* Ícono Play */}
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

        {/* 📸 Imagen e información */}
        <div
        className="
          col-span-1 bg-white text-secondary rounded-3xl shadow-xl overflow-hidden
          transition-all duration-700 hover:shadow-2xl hover:-translate-y-1
          flex flex-col lg:flex-col sm:flex-row
        "
      >
        {/* Imagen */}
        <div
          className="
            relative w-full h-56 overflow-hidden group
            sm:w-1/2 sm:h-auto lg:w-full lg:h-64
          "
        >
          <img
            src={imagenPrincipal}
            alt={curso.CURS_Titulo}
            className="
              object-cover w-full h-full transform group-hover:scale-110
              transition-transform duration-700 ease-out
            "
          />

          {/* Gradiente superior sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Título sobre la imagen */}
          <div
            className="
              absolute bottom-4 left-4
              sm:bottom-3 sm:left-3
            "
          >
            <h3
              className="
                text-2xl font-semibold text-white drop-shadow-lg
                sm:text-xl sm:leading-tight
              "
            >
              {curso.CURS_Titulo}
            </h3>
            <p className="text-sm text-primary font-medium mt-1 sm:mt-0">
              Por {curso.CURS_Autor}
            </p>
          </div>
        </div>

        {/* Contenido descriptivo */}
        <div
          className="
            p-6 flex flex-col justify-between bg-white text-secondary
            sm:p-4 sm:w-1/2 sm:justify-center sm:text-left
            lg:p-6 lg:text-left lg:w-full
          "
        >
          <p
            className="
              text-gray-700 text-sm leading-relaxed mb-4
              sm:mb-3 sm:leading-snug sm:text-sm lg:text-base
            "
          >
            {curso.CURS_Descripcion || "Sin descripción disponible."}
          </p>

          {/* Autor destacado */}
          <div
            className="
              flex items-center gap-3 mt-2
              sm:gap-2 sm:mt-0
            "
          >
            <img
              src={curso.CURS_Avatar || "/default-avatar.png"}
              alt={curso.CURS_Autor}
              className="
                w-10 h-10 rounded-full border-2 border-primary object-cover
                sm:w-12 sm:h-12
              "
            />
            <div>
              <span className="block font-semibold text-primary sm:text-sm">
                {curso.CURS_Autor}
              </span>
              <span className="text-xs text-gray-500">Instructor</span>
            </div>
          </div>
        </div>
      </div>
      {/* 🔊 Reproductor de audio fijo */}
      {moduloActivo && (
        <div className="fixed bottom-0 bg-gray-800 left-0 w-full z-50">
          <AudioPlayerBar
            titulo={moduloActivo.MODU_Titulo}
            src={moduloActivo.MODU_UrlContenido}
            onEnded={handleAudioEnded}
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
                  (m) => m.MODU_Orden === moduloActivo.MODU_Orden - 1 && m.desbloqueado
                );
              if (anterior) {
                setModuloActivo(anterior);
                setAutoPlayTrigger(true);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
