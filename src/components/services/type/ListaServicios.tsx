/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppState } from "../../../hooks/useAppState";
import { useSearchParams } from "react-router-dom";
import {
  FiMap,
  FiStar,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { FaTruck, FaRegFlag } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import BotonOpinion from "../components/BotonOption";
import DetalleServicio from "./DetalleServicio";
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);
dayjs.locale("es");

const ListaServicios = () => {
  const {
    serviciosFilterActivos,
    setServicioSeleccionado,
    servicioSeleccionado,
  } = useAppState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const handleToggleView = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("m", "map");
    setSearchParams(newParams);
  };

  const handleGoToService = (servicio: any) => {
    const encoded = btoa(servicio.cod_servicio);
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, s: encoded });
    setServicioSeleccionado(servicio);
    setIsMobileExpanded(true);
  };

  const handleClickExpanded = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  useEffect(() => {
    const encodedService = searchParams.get("s");
    if (!encodedService || !serviciosFilterActivos?.length) return;

    try {
      const decoded = atob(encodedService);
      const foundService = serviciosFilterActivos.find(
        (srv) => srv.cod_servicio === decoded
      );
      if (foundService) setServicioSeleccionado(foundService);
    } catch (err) {
      console.error("Error al decodificar servicio:", err);
    }
  }, [searchParams, serviciosFilterActivos]);

  return (
    <div className="relative flex flex-col p-0 bg-gray-50 rounded-3xl shadow-lg w-full gap-4">
      {/*  Encabezado */}
      <div
        className={`px-4 pt-4 ${
          servicioSeleccionado ? "width-cutom-list-service-selected" : ""
        } flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-0 lg:mb-4`}
      >
        {/* Contador */}
        <div className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 sm:py-3 rounded-xl shadow-md text-sm sm:text-base font-semibold w-full sm:w-auto text-center">
          <span>{serviciosFilterActivos.length}</span>
          <span>servicios disponibles</span>
        </div>

        {/* Botones: Mapa + Opinión */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleToggleView}
            className="bg-white/90 hover:cursor-pointer backdrop-blur-md shadow-md border border-gray-200 rounded-full px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
            title="Cambiar a mapa"
          >
            <FiMap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            <span>Mapa</span>
          </button>

          <div className="w-full flex justify-center">
            <BotonOpinion />
          </div>
        </div>
      </div>

      {/*  Lista */}
      {serviciosFilterActivos?.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-4">
          <ul
            className={`flex flex-col gap-4 mt-2 w-full px-4 pb-4 ${
              servicioSeleccionado
                ? !isMobileExpanded
                  ? "height-cutom-list-service-selected-details width-cutom-list-service-selected overflow-y-auto"
                  : "width-cutom-list-service-selected height-cutom-list-service-selected overflow-y-auto"
                : "w-full"
            }`}
          >
            {serviciosFilterActivos.map((servicio: any) => {
              const logo =
                servicio.archivos?.find((a: any) => a.tipo === "logo")?.ruta ||
                "https://mappidevbucket.s3.amazonaws.com/-1";

              const isDestacado = servicio.destacado;

              return (
                <li
                  key={servicio.cod_servicio}
                  onClick={() => handleGoToService(servicio)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 cursor-pointer hover:-translate-y-0.5 duration-200 w-full"
                >
                  {/* Logo */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border border-gray-200">
                    <img
                      src={logo}
                      alt={servicio.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-base sm:text-lg break-words">
                        {servicio.nombre}
                      </h3>
                      {isDestacado && (
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FiStar className="w-3 h-3" /> Destacado
                        </span>
                      )}
                      {servicio.archivado && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaRegFlag /> Archivado
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {servicio.subcategoria?.nombre || "Sin subcategoría"}
                    </p>

                    {/* Estado y delivery */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          servicio.estado
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {servicio.estado ? "Activo" : "Inactivo"}
                      </span>

                      {servicio.abierto24h && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          24h
                        </span>
                      )}

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          servicio.delivery
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FaTruck className="w-3 h-3" />
                        {servicio.delivery ? "Delivery" : "Sin delivery"}
                      </span>
                    </div>

                    {/* Dirección */}
                    {servicio.direccion?.direccion && (
                     <div className="flex items-start gap-1 text-gray-600 text-sm mt-1">
                        <FiMapPin className="w-4 h-4 text-primary mt-[2px]" />
                        <span className="whitespace-pre-line break-words">
                            {servicio.direccion.direccion}
                        </span>
                    </div>

                    )}

                    {/* Fecha */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                      <FiClock className="w-3 h-3 text-primary" />
                      <span>{dayjs(servicio.fechaRegistro).fromNow()}</span>
                    </div>
                  </div>

                  {/* Acción */}
                  <div className="flex-shrink-0">
                    <button className="bg-primary hover:cursor-pointer hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg shadow-md transition">
                      Ver
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/*  Panel lateral */}
          {servicioSeleccionado && (
            <div
              className={`hidden lg:block lg:fixed lg:top-[132px] right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-2xl z-[999]
                          transition-transform duration-500 ease-in-out 
                          ${
                            servicioSeleccionado
                              ? "translate-x-0"
                              : "translate-x-full"
                          }`}
            >
              <div className="height-cutom-mapa-service-not-filter overflow-y-auto">
                <DetalleServicio servicio={servicioSeleccionado} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-500">
          No hay servicios disponibles
        </div>
      )}

      {/* 📱 Panel móvil */}
      {servicioSeleccionado && (
        <>
          {!isMobileExpanded && (
            <div className="block lg:hidden bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out translate-y-0 opacity-100">
              <div
                className="w-full bg-primary h-[30px] flex items-center justify-center rounded-t-3xl cursor-pointer"
                onClick={handleClickExpanded}
              >
                <div className="w-[80px] h-[6px] bg-white rounded-full"></div>
              </div>
              <DetalleServicio servicio={servicioSeleccionado} />
            </div>
          )}

          {isMobileExpanded && (
            <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-2xl rounded-t-3xl overflow-y-auto transform transition-all duration-500 ease-in-out translate-y-0 opacity-100 height-cutom-mapa-service-filter">
              <div
                className="w-full bg-primary h-[30px] flex items-center justify-center rounded-t-3xl cursor-pointer"
                onClick={handleClickExpanded}
              >
                <div className="w-[80px] h-[6px] bg-white rounded-full"></div>
              </div>
              <div className="transition-opacity duration-500 ease-in-out opacity-100">
                <DetalleServicio servicio={servicioSeleccionado} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaServicios;
