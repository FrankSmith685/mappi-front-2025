/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAppState } from "../../../hooks/useAppState";
import { useCurso } from "../../../hooks/useCurso";
import { CourseCard } from "./components/CourseCard";
import type { CursoData } from "../../../interfaces/ICurso";
import { CursoDetalleAudio } from "./components/audio/CursoDetalleAudio";
import { CursoDetalleVideo } from "./components/video/CursoDetailsVideo";

export const Capacitacion = () => {
  const { user } = useAppState();
  const { getCursosByTipo } = useCurso();
  const [cursos, setCursos] = useState<CursoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoData | null>(null);

  const imagenesAudio = [
    { name: "capacitacion_audio_01", key: "mapp_306" },
    { name: "capacitacion_audio_02", key: "mapp_307" },
    { name: "capacitacion_audio_03", key: "mapp_308" },
  ];

  const imagenesVideo = [
    { name: "capacitacion_video_01", key: "mapp_313" },
    { name: "capacitacion_video_02", key: "mapp_314" },
    { name: "capacitacion_video_03", key: "mapp_315" },
  ];

  useEffect(() => {
    if (user?.tienePlan && loading) {
      setLoading(true);
      const tipo = user.tienePlan === "independiente" ? "audio" : "video";

      getCursosByTipo(tipo, (data) => {
        const cursosConImagen = data.map((curso, index) => ({
          ...curso,
          imagen:
            tipo === "audio"
              ? imagenesAudio[index % imagenesAudio.length].key
              : imagenesVideo[index % imagenesVideo.length].key,
        }));

        setCursos(cursosConImagen);
        setLoading(false);
      });
    }
  }, [user?.tienePlan, loading]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Cargando cursos...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full responsive-padding flex flex-col items-center gap-4">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
        Capacitación con{" "}
        <span className="text-primary">
          {user?.tienePlan === "independiente" ? "audio" : "video"}
        </span>
      </h1>

      <p className="text-gray-800 text-base text-center max-w-2xl">
        Disfruta nuestras capacitaciones en formato{" "}
        {user?.tienePlan === "independiente" ? "audio" : "video"} para que
        aprendas en cualquier momento y lugar.
      </p>
{cursoSeleccionado && (
  <>
    {cursoSeleccionado.CURS_Tipo === "audio" ? (
      <CursoDetalleAudio
        curso={{
          ...cursoSeleccionado,
          ModulosCursos: cursoSeleccionado.ModulosCursos ?? [],
          modulos: cursoSeleccionado.modulos ?? [],
        }}
        onProgresoActualizado={(nuevoProgreso) => {
          setCursos((prev) =>
            prev.map((c) =>
              c.CURS_Id === nuevoProgreso.CURS_Id
                ? {
                    ...c,
                    porcentaje: nuevoProgreso.porcentaje,
                    completado: nuevoProgreso.completado,
                  }
                : c
            )
          );

          setCursoSeleccionado((prev) =>
            prev && prev.CURS_Id === nuevoProgreso.CURS_Id
              ? { ...prev, ...nuevoProgreso }
              : prev
          );
        }}
      />
    ) : (
      <CursoDetalleVideo
        curso={{
          ...cursoSeleccionado,
          ModulosCursos: cursoSeleccionado.ModulosCursos ?? [],
          modulos: cursoSeleccionado.modulos ?? [],
        }}
        onProgresoActualizado={(nuevoProgreso) => {
          setCursos((prev) =>
            prev.map((c) =>
              c.CURS_Id === nuevoProgreso.CURS_Id
                ? {
                    ...c,
                    porcentaje: nuevoProgreso.porcentaje,
                    completado: nuevoProgreso.completado,
                  }
                : c
            )
          );

          setCursoSeleccionado((prev) =>
            prev && prev.CURS_Id === nuevoProgreso.CURS_Id
              ? { ...prev, ...nuevoProgreso }
              : prev
          );
        }}
      />
    )}
  </>
)}



      <div className={`${cursoSeleccionado ? cursoSeleccionado.CURS_Tipo =='audio' && 'mb-[150px] md:mb-[80px]' : ''} grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full max-w-6xl mt-4`}>
        {cursos.map((curso) => (
          <CourseCard
            key={curso.CURS_Id}
            CURS_Id={curso.CURS_Id}
            CURS_Titulo={curso.CURS_Titulo}
            CURS_Descripcion={curso.CURS_Descripcion}
            CURS_Tipo={curso.CURS_Tipo}
            CURS_Autor={curso.CURS_Autor}
            CURS_Avatar={curso.CURS_Avatar}
            desbloqueado={curso.desbloqueado}
            completado={curso.completado}
            porcentaje={curso.porcentaje}
            imagen={curso.imagen ?? ''}
            onClick={(id) => {
              if (curso.desbloqueado) {
                console.log("Abrir curso", id);
                setCursoSeleccionado(curso);
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                alert("Este curso aún no está desbloqueado 🔒");
              }
            }}
          />
        ))}
      </div>

    </div>
  );
};
