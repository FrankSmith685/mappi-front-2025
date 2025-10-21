import {
  FiX,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { useAppState } from "../../../../hooks/useAppState";
import type { ServicioActivoData } from "../../../../interfaces/IServicio";
import { useRef, useEffect, useState } from "react";
import { useLocation } from "../../../../hooks/useLocationHooks/useLocation";

const imageUrl: string = import.meta.env.VITE_IMAGE_URL;

interface Props {
  servicio: ServicioActivoData;
}

const ServicioSeleccionadoCard = ({ servicio }: Props) => {
  const { setServicioSeleccionado } = useAppState();
  const { lat: currentLat, lng: currentLng } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState<string | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>("");

  const logo = servicio.archivos?.find((a) => a.tipo === "logo")?.ruta;
  const portada = servicio.archivos?.find((a) => a.tipo === "portada")?.ruta;
  const imagenesServicios =
    servicio.archivos?.filter((a) => a.tipo === "imagen").map((a) => a.ruta) || [];

  const logoUrl = logo || `${imageUrl}/0`;
  const portadaUrl = portada || `${imageUrl}/-1`;

  // 🧮 Calcular distancia (Haversine)
  const calcularDistanciaKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 📅 Calcular tiempo desde publicación
  useEffect(() => {
    if (servicio.fechaRegistro) {
      const fecha = new Date(servicio.fechaRegistro);
      const ahora = new Date();
      const diffMs = ahora.getTime() - fecha.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHoras = Math.floor(diffMins / 60);
      const diffDias = Math.floor(diffHoras / 24);
      const diffSemanas = Math.floor(diffDias / 7);

      let texto = "";
      if (diffMins < 60) texto = `Publicado hace ${diffMins} min`;
      else if (diffHoras < 24) texto = `Publicado hace ${diffHoras} h`;
      else if (diffDias < 7) texto = `Publicado hace ${diffDias} días`;
      else texto = `Publicado hace ${diffSemanas} sem`;

      setTimeAgo(texto);
    }
  }, [servicio.fechaRegistro]);

  // 📍 Calcular distancia al usuario
  useEffect(() => {
    if (
      currentLat &&
      currentLng &&
      servicio.direccion?.latitud &&
      servicio.direccion?.longitud
    ) {
      const dist = calcularDistanciaKm(
        currentLat,
        currentLng,
        Number(servicio.direccion.latitud),
        Number(servicio.direccion.longitud)
      );
      setDistance(dist.toFixed(1));
    }
  }, [currentLat, currentLng, servicio]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        absolute top-[80px] md:top-0 z-[1000] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-y-auto animate-fadeIn
        w-[380px] md:w-[420px] right-6 bottom-6
        md:right-0 md:bottom-0
        max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full max-md:rounded-t-3xl max-md:shadow-2xl max-md:border-t
      "
      style={{
        maxHeight: "calc(100vh - 100px)",
      }}
    >
      {/* Imagen principal */}
      <div className="relative h-48 w-full">
        <img src={portadaUrl} alt="Portada" className="h-full w-full object-cover" />

        {/* Logo */}
        <div className="absolute -bottom-6 left-5 bg-white p-1 rounded-full shadow-lg">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-14 w-14 object-cover rounded-full border border-gray-200"
          />
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => setServicioSeleccionado(null)}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md active:scale-95 transition"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="pt-8 pb-5 px-5 max-md:pb-24">
        {/* Nombre y categoría */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate">
            {servicio.nombre}
          </h3>
        </div>

        {/* Fecha de publicación */}
        {timeAgo && (
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <FiCalendar className="w-4 h-4 mr-1 text-primary" />
            {timeAgo}
          </div>
        )}

        {/* Subcategoría */}
        <p className="text-sm text-gray-500 mt-0.5 truncate">
          {servicio.subcategoria?.nombre || "Sin subcategoría"}
        </p>

        {/* Dirección y distancia */}
        <div className="mt-3 flex items-start gap-2 text-sm text-gray-700">
          <FiMapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">
            {servicio.direccion?.direccion || "Sin dirección registrada"}
            {distance && (
              <span className="text-gray-500 font-medium ml-1">• {distance} km</span>
            )}
          </span>
        </div>

        {/* Horarios y delivery */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          {servicio.abierto24h ? (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <FiClock className="w-4 h-4" /> Abierto 24h
            </div>
          ) : servicio.horaInicio && servicio.horaFin ? (
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" /> {servicio.horaInicio} - {servicio.horaFin}
            </div>
          ) : null}

          {servicio.delivery && (
            <div className="flex items-center gap-1 text-blue-600 font-medium">
              <MdOutlineDeliveryDining className="w-4 h-4" /> Delivery
            </div>
          )}
        </div>

        {/* Carrusel horizontal */}
        {imagenesServicios.length > 0 && (
          <div className="relative mt-4">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
              {imagenesServicios.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Imagen ${idx + 1}`}
                  className="h-28 w-40 object-cover rounded-lg border border-gray-200 flex-shrink-0 snap-start"
                />
              ))}
            </div>

            {imagenesServicios.length > 2 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full shadow"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full shadow"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Categoría */}
        <p className="mt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Categoría:</span>{" "}
          {servicio.subcategoria?.categoria?.nombre || "No especificada"}
        </p>
      </div>

      {/* Botón desktop */}
      <div className="hidden md:block">
        <button
          onClick={() => window.open(`/servicio/${servicio.cod_servicio}`, "_blank")}
          className="mt-5 w-full bg-primary text-white py-2.5 rounded-xl font-medium shadow-md hover:bg-primary/90 active:scale-95 transition-all"
        >
          Ver más detalles
        </button>
      </div>

      {/* Botón móvil */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
      >
        <button
          onClick={() => window.open(`/servicio/${servicio.cod_servicio}`, "_blank")}
          className="w-full bg-primary text-white py-2.5 rounded-xl font-medium shadow-md hover:bg-primary/90 active:scale-95 transition-all"
        >
          Ver más detalles
        </button>
      </div>
    </div>
  );
};

export default ServicioSeleccionadoCard;
