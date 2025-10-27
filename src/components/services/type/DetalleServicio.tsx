/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import {
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaArrowRight,
  FaTruck,
  FaRegFlag,
  FaRoute,
  FaBullhorn,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";
import { useLocation } from "../../../hooks/useLocationHooks/useLocation";
import { CustomButton } from "../../ui/CustomButton";
import { useAppState } from "../../../hooks/useAppState";
import { useSearchParams } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface DetalleServicioProps {
  servicio: any;
}

//  Calcular distancia (Haversine)
const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

const DetalleServicio = ({ servicio }: DetalleServicioProps) => {
  const { lat: userLat, lng: userLng } = useLocation();
  const {setServicioSeleccionado} = useAppState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      usuario: "Carlos Pérez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      texto: "Excelente servicio y muy rápido.",
      fecha: new Date(),
    },
    {
      id: 2,
      usuario: "María López",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      texto: "Muy buena atención, recomendado 👍",
      fecha: new Date(),
    },
  ]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const portada =
    servicio.archivos?.find((a: any) => a.tipo === "portada")?.ruta ||
    "https://mappidevbucket.s3.amazonaws.com/0";

  const logo =
    servicio.archivos?.find((a: any) => a.tipo === "logo")?.ruta ||
    "https://mappidevbucket.s3.amazonaws.com/-1";

  const imagenes =
    servicio.archivos?.filter((a: any) => a.tipo === "imagen") || [];

  const promociones =
    servicio.archivos?.filter((a: any) => a.tipo === "promocional") || [];

  const latServicio = servicio.direccion?.latitud
    ? parseFloat(servicio.direccion.latitud)
    : null;
  const lngServicio = servicio.direccion?.longitud
    ? parseFloat(servicio.direccion.longitud)
    : null;

  let distanciaTexto = "Ubicación no disponible";
  if (userLat && userLng && latServicio && lngServicio) {
    const distancia = calcularDistancia(userLat, userLng, latServicio, lngServicio);
    distanciaTexto = `${distancia.toFixed(1)} km de tu ubicación`;
  }

  const agregarComentario = () => {
    if (nuevoComentario.trim() === "") return;

    const nuevo = {
      id: comentarios.length + 1,
      usuario: "Usuario invitado",
      avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
      texto: nuevoComentario,
      fecha: new Date(),
    };

    setComentarios([nuevo, ...comentarios]);
    setNuevoComentario("");
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Imagen principal */}
      <div className="relative h-52 sm:h-60 md:h-64 w-full">
        <img
          src={portada}
          alt={servicio.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>

        {/* Logo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden border-2 border-gray-200">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Encabezado */}
      <div className="text-center mt-14 sm:mt-16 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{servicio.nombre}</h2>

        <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
          <FaTag className="text-primary" />
          <span className="font-medium">
            {servicio.subcategoria?.nombre || "Sin categoría"}
          </span>
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-full font-medium ${
              servicio.estado
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {servicio.estado ? "Activo" : "Inactivo"}
          </span>

          {servicio.archivado && (
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium flex items-center gap-1">
              <FaRegFlag /> Archivado
            </span>
          )}

          {servicio.abierto24h && (
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              Abierto 24h
            </span>
          )}

          <span
            className={`px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
              servicio.delivery
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <FaTruck />
            {servicio.delivery ? "Delivery" : "Sin delivery"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4 sm:space-y-5">
        {/* Descripción */}
        {servicio.descripcion && (
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Descripción</h3>
            <p className="text-sm sm:text-[15px] text-gray-600 mt-1">{servicio.descripcion}</p>
          </div>
        )}

        {/* Ubicación */}
        {servicio.direccion?.direccion && (
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Ubicación</h3>
            <div className="mt-1 text-sm text-gray-600 flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0 text-base" />
                <span className="whitespace-pre-line break-words text-[13px] sm:text-sm">
                  {servicio.direccion.direccion}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <FaRoute className="text-primary text-base" />
                <span>{distanciaTexto}</span>
              </div>
            </div>
          </div>
        )}

        {/* Publicado */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <FaClock className="text-primary text-base" />
          <div>
            <div>Publicado {dayjs(servicio.fechaRegistro).fromNow()}</div>
            <div className="text-[11px] text-gray-400">
              ({dayjs(servicio.fechaRegistro).format("DD/MM/YYYY [a las] HH:mm")})
            </div>
          </div>
        </div>

        {/* Promociones */}
        {promociones.length > 0 && (
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
              <FaBullhorn className="text-primary" /> Promociones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {promociones.map((img: any, i: number) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-xl border border-primary/30 shadow-sm"
                >
                  <img
                    src={img.ruta}
                    alt={`Promoción ${i + 1}`}
                    className="w-full h-24 sm:h-28 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-1 rounded-full">
                    Promo
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galería */}
{imagenes.length > 0 && (
  <div>
    <h3 className="text-sm sm:text-base font-semibold text-gray-700">Galería</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3 pt-2">
      {imagenes.slice(0, 8).map((img: any, i: number) => (
        <div
          key={i}
          className="relative group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
          style={{ height: "160px" }} //  altura fija para que no se deformen
        >
          <img
            src={img.ruta}
            alt={`Imagen ${i + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
        </div>
      ))}
    </div>
  </div>
)}



        {/* Comentarios */}
        <div className="py-3 border-y border-gray-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
            <FaCommentDots className="text-primary text-base" /> Comentarios
          </h3>

          {/* Lista */}
          <div className="mt-2 space-y-3 max-h-48 overflow-y-auto pr-1">
            {comentarios.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img
                  src={c.avatar}
                  alt={c.usuario}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">{c.usuario}</p>
                  <p className="text-[13px] sm:text-sm text-gray-600">{c.texto}</p>
                  <p className="text-[11px] text-gray-400">{dayjs(c.fecha).fromNow()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input comentario */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <CustomButton
              text="Agregar"
              type="button"
              size="md"
              variant="primary"
              onClick={agregarComentario}
              icon={<FaUserCircle />}
              fullWidth={false}
            />
          </div>
        </div>

        {/* Botón Ver más */}
        {/* <div className="max-w-[500px] w-full lg:w-full "> */}
          <div className="w-full">
            <CustomButton
              text="Ver más detalles"
              type="button"
              size="md"
              onClick={() => {
                const encoded = btoa(servicio.cod_servicio);
                window.location.href = `/servicios/${encoded}`;
              }}
              fullWidth
              fontSize="14px"
              variant="primary"
              icon={<FaArrowRight />}
            />
          </div>
        {/* </div> */}

        {/* <div className="w-full flex items-center justify-center"> */}
          <div className="w-full">
              <CustomButton
                text="Cerrar"
                type="button"
                size="md"
                onClick={() => {
                  setServicioSeleccionado(null);
                  if (location.pathname === "/servicios") {
                        const currentParams = Object.fromEntries(searchParams.entries());
                        if ("s" in currentParams) {
                          delete currentParams.s;
                          setSearchParams(currentParams);
                        }
                      }
                }}
                fullWidth
                fontSize="14px"
                variant="terciary"
              />
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default DetalleServicio;
