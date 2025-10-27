/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiPhone,
  FiChevronLeft,
  FiFileText,
  FiPlayCircle,
} from "react-icons/fi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { useServicio } from "../../../hooks/useServicio";
import type { ServicioActivoDataDetail } from "../../../interfaces/IServicioIDDetal";

dayjs.extend(relativeTime);
dayjs.locale("es");

const ServicioDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState<ServicioActivoDataDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { getServicioActivoById } = useServicio();

  const decodeBase64 = (str: string) => {
    try {
      return atob(str);
    } catch {
      return str;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const decodedId = decodeBase64(id);
      await getServicioActivoById(decodedId, (success, message, data) => {
        if (success && data) setServicio(data);
        else console.error("Error al obtener servicio:", message);
        setLoading(false);
      });
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando detalles del servicio...</p>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-semibold">No se encontró información del servicio.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          ← Volver
        </button>
      </div>
    );
  }

  const {
    nombre,
    descripcion,
    estado,
    fechaRegistro,
    subcategoria,
    direccion,
    usuario,
    empresa,
    abierto24h,
    horaInicio,
    horaFin,
    delivery,
    archivos,
  } = servicio;

  //  Obtener tipos de archivos
 //  Obtener tipos de archivos con imágenes por defecto
  const portada =
    archivos?.find((a) => a.tipo === "portada")?.ruta ||
    "https://mappidevbucket.s3.amazonaws.com/0";

  const logo =
    archivos?.find((a) => a.tipo === "logo")?.ruta ||
    "https://mappidevbucket.s3.amazonaws.com/-1";

  const imagenes = archivos?.filter((a) => a.tipo === "imagen") || [];
  const videos = archivos?.filter((a) => a.tipo === "video") || [];
  const documentos = archivos?.filter((a) => a.tipo === "documento") || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Botón volver */}
      <div className="absolute top-5 left-5 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm hover:bg-white transition"
        >
          <FiChevronLeft /> <span className="text-sm font-medium">Volver</span>
        </button>
      </div>

      {/* Portada */}
      <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden rounded-b-3xl shadow-sm">
        <img
          src={portada || "https://via.placeholder.com/1200x400?text=Sin+Portada"}
          alt="Portada"
          className="w-full h-full object-cover"
        />
        {logo && (
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain rounded-lg border border-gray-100"
            />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{nombre}</h1>
          <p className="text-gray-500 text-sm mb-4">
            {subcategoria?.categoria?.nombre} • {subcategoria?.nombre}
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line break-words">
            {descripcion || "Sin descripción"}
          </p>

          {/* Información general */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {direccion && (
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <FiMapPin className="text-primary text-[20px] mt-[2px] flex-shrink-0" />
                <div>
                  <p className="font-semibold">Dirección</p>
                  <p className="text-gray-600 text-sm whitespace-pre-line break-words">
                    {direccion.direccion}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
              <FiClock className="text-primary text-[20px] mt-[2px] flex-shrink-0" />
              <div>
                <p className="font-semibold">Horario</p>
                <p className="text-gray-600 text-sm">
                  {abierto24h
                    ? "Abierto 24 horas"
                    : horaInicio && horaFin
                    ? `${horaInicio} - ${horaFin}`
                    : "Horario no disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
              <MdOutlineDeliveryDining className="text-primary text-[22px] mt-[2px] flex-shrink-0" />
              <div>
                <p className="font-semibold">Delivery</p>
                <p className="text-gray-600 text-sm">{delivery ? "Sí ofrece" : "No ofrece"}</p>
              </div>
            </div>

            {usuario && (
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                <FiPhone className="text-primary text-[20px] mt-[2px] flex-shrink-0" />
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-gray-600 text-sm">{usuario.telefono}</p>
                </div>
              </div>
            )}
          </div>


          {/* Galería de imágenes */}
          {imagenes.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Galería de imágenes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagenes.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden group relative shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={img.ruta}
                      alt={img.nombreOriginal}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPlayCircle /> Videos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((vid) => (
                  <video
                    key={vid.id}
                    src={vid.ruta}
                    controls
                    className="w-full rounded-xl shadow-sm border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {documentos.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFileText /> Documentos
              </h2>
              <ul className="space-y-2">
                {documentos.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.ruta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <FiFileText /> {doc.nombreOriginal || "Ver documento"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-sm mb-2">
              Publicado {dayjs(fechaRegistro).fromNow()}
            </p>
            <span
              className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold ${
                estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {estado ? "Activo" : "Inactivo"}
            </span>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Contacto</h3>
              {empresa ? (
                <>
                  <p className="text-sm font-medium text-gray-700">{empresa.razonSocial}</p>
                  <p className="text-gray-500 text-sm">{empresa.telefono}</p>
                </>
              ) : usuario ? (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Usuario: {usuario.cod_usuario}
                  </p>
                  <p className="text-gray-500 text-sm">{usuario.telefono}</p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">Sin información de contacto</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicioDetallePage;
