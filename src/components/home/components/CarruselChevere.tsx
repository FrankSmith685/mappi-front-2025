import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { ServicioActivoDataChevere } from "../../../interfaces/IServicioPlanChevere";

interface Props {
  chevere: ServicioActivoDataChevere[];
}

export const CarruselPublicidad: React.FC<Props> = ({ chevere }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const displayServicios =
    chevere.length > 0
      ? chevere
      : [
          {
            SERV_Interno: "empty",
            SERV_Nombre: "Próximamente",
            SERV_Descripcion: "¡Nueva promoción destacada!",
            Archivos: [],
            Subcategoria: {},
            Usuario: {},
          },
        ] as unknown as ServicioActivoDataChevere[];

  const getFirstPromotionalImage = (serv: ServicioActivoDataChevere) => {
    if (!serv.Archivos) return null;
    const imagen = serv.Archivos.find((a) => a.ARCH_Tipo === "imagen");
    return imagen ? imagen.ARCH_Ruta : null;
  };

  //Autoplay cada 6s
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === displayServicios.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [displayServicios.length]);

  //Navegación manual
  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayServicios.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === displayServicios.length - 1 ? 0 : prev + 1
    );
  };

  //Codificar Base64 y redirigir
  const handleVerMas = (servicioCod: string) => {
    if (servicioCod === "empty") return;

    const base64Cod = btoa(servicioCod);
    const codificado = encodeURIComponent(base64Cod);

    navigate(`/servicios/${codificado}`);
  };

  return (
    <section className="relative shadow-2xl overflow-hidden">
      <div className="relative w-full h-[300px] md:h-[380px] flex justify-center items-center overflow-hidden">
        {displayServicios.map((serv, index) => {
          const logo =
            serv.Archivos?.find((a) => a.ARCH_Tipo === "logo")?.ARCH_Ruta ||
            "https://mappidevbucket.s3.amazonaws.com/-1";

          const imgToShow =
            getFirstPromotionalImage(serv) ||
            "https://mappidevbucket.s3.amazonaws.com/0";

          return (
            <div
              key={serv.SERV_Interno + index}
              className={`absolute inset-0 flex justify-center items-center transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Imagen principal */}
              <img
                src={
                  imgToShow.startsWith("http")
                    ? imgToShow
                    : `${imgToShow.replace(/^\/+/, "")}`
                }
                alt={serv.SERV_Nombre}
                className="w-full h-full object-contain bg-white"
              />

              {/* Overlay degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

              {/* Texto inferior centrado */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md px-2 py-2 rounded-2xl shadow-lg flex flex-row items-center justify-between gap-3 w-[90%] max-w-xl">
                <div className="text-center md:text-left">
                  <h3 className="text-base md:text-2xl font-semibold text-white line-clamp-1">
                    {serv.SERV_Nombre}
                  </h3>
                  <p className="text-xs md:text-sm hidden sm:flex text-gray-200 opacity-90 line-clamp-2">
                    {serv.SERV_Descripcion}
                  </p>
                </div>
                <button
                  onClick={() => handleVerMas(serv.SERV_Interno)}
                  className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full hover:scale-105 hover:bg-primary/90 transition-all shadow-md"
                >
                  <FaChevronRight size={18} />
                </button>
              </div>

              {/* Logo circular */}
              <div className="absolute top-5 left-5 md:left-8 z-10">
                <img
                  src={
                    logo.startsWith("http")
                      ? logo
                      : `${logo.replace(/^\/+/, "")}`
                  }
                  alt="logo"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white shadow-lg object-cover bg-white"
                />
              </div>
            </div>
          );
        })}

        {/* Botones de navegación */}
        <button
          onClick={goToPrev}
          className="absolute left-3 md:left-6 bg-black/40 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20 transition-all duration-300"
        >
          <FaChevronLeft size={22} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 md:right-6 bg-black/40 hover:bg-black/70 text-white p-2 md:p-3 rounded-full z-20 transition-all duration-300"
        >
          <FaChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};
