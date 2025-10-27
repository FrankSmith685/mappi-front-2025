/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import CustomMapa from "../../ui/CustomMapa";
import { useLocation } from "../../../hooks/useLocationHooks/useLocation";
import { useAppState } from "../../../hooks/useAppState";
import { FiList, FiMap, FiNavigation } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import BotonOpinion from "../components/BotonOption";
import { useLocation as useRouterLocation } from "react-router-dom";
import DetalleServicio from "./DetalleServicio";

function getCurrentLocationIcon(): string {
  const baseUrl = "https://mappidevbucket.s3.us-east-1.amazonaws.com/";
  const icon = { key: "mapp_631" };
  return baseUrl + icon.key;
}

const MapaServicios = () => {
  const {
    serviciosFilterActivos,
    isShowFilterService,
    setServicioSeleccionado,
    servicioSeleccionado,
    setIsExpanded,
    setiIsShowFilterService,
  } = useAppState();

  const { lat: currentLat, lng: currentLng } = useLocation();
  const currentIconUrl = getCurrentLocationIcon();
  const mapRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("m") ?? "map";
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);


  const handleRecenter = () => {
    if (mapRef.current && currentLat && currentLng) {
      mapRef.current.recenterTo(currentLat, currentLng);
    }
  };

  const handleToggleView = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("m", mode === "map" ? "list" : "map");
    setSearchParams(newParams);
  };

  //  Seleccionar servicio manualmente
  const handleSelectService = (servicio: any) => {
    if (!servicio) return;
    const encodedService = btoa(servicio.cod_servicio);
    const currentParams = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...currentParams,
      s: encodedService,
    });

    setServicioSeleccionado(servicio);
    setIsExpanded(false);
    setiIsShowFilterService(false);
    setIsMobileExpanded(true);

    if (mapRef.current?.flyToService && servicio.direccion?.latitud && servicio.direccion?.longitud) {
      mapRef.current.flyToService(servicio);
    }

    setTimeout(() => {
      if (mapRef.current?.openPopupForService) {
        mapRef.current.openPopupForService(servicio.cod_servicio);
      }
    }, 800);
  };

  const location = useRouterLocation();
  const isListadoServicios = location.pathname === "/servicios";

  useEffect(() => {
    if (!isListadoServicios) return;
    const encodedService = searchParams.get("s");
    if (!encodedService || !serviciosFilterActivos?.length) return;

    try {
      const decoded = atob(encodedService);
      const foundService = serviciosFilterActivos.find(
        (srv) => srv.cod_servicio === decoded
      );

      if (foundService) {
        setServicioSeleccionado(foundService);

        setTimeout(() => {
          if (mapRef.current?.flyToService) {
            mapRef.current.flyToService(foundService);
          }
        }, 500);
      }
    } catch (err) {
      console.error("Error al decodificar servicio:", err);
    }
  }, [searchParams, serviciosFilterActivos, isListadoServicios]);

 const handleClickExpanded = () => {
  setIsMobileExpanded(!isMobileExpanded);
};


  return (
  <div className="relative z-20 bg-gray-50 rounded-3xl shadow-lg overflow-visible">
    {/* 🗺️ Contenedor del mapa */}
    <div
      className={`${
        !isShowFilterService
          ? servicioSeleccionado ? isMobileExpanded ? "height-cutom-mapa-service-not-filter" : "height-cutom-mapa-service-selected" : "height-cutom-mapa-service-not-filter"
          : "height-cutom-mapa-service-filter"
      } relative flex flex-col lg:flex-row`}
    >
      {/* Mapa */}
      <div className="flex-1 relative">
        <CustomMapa
          ref={mapRef}
          type="service"
          lat={currentLat ?? -12.0464}
          lng={currentLng ?? -77.0428}
          zoom={17}
          customIcon={currentIconUrl}
          servicios={serviciosFilterActivos}
          servicioSeleccionado={servicioSeleccionado}
          onSelectServicio={handleSelectService}
        />

        {/* Botón centrar */}
        <button
          onClick={handleRecenter}
          className="absolute bottom-6 left-6 z-[999] bg-primary text-white rounded-full p-3 shadow-lg hover:bg-[#e35c3d] transition-all duration-300"
          title="Centrar en mi ubicación"
        >
          <FiNavigation className="w-5 h-5 text-white" />
        </button>

        {/* Barra superior */}
       <div
  className="
    absolute top-4 left-1/2 sm:left-auto sm:right-6 
    -translate-x-1/2 sm:translate-x-0 z-[999]
    flex flex-col sm:flex-row items-center sm:items-start 
    gap-3 w-[90%] sm:w-auto
  "
>
  {/* Caja de servicios disponibles */}
  <div
    className="
      flex items-center justify-center gap-2 
      bg-primary text-white w-full sm:w-auto 
      px-5 py-2 sm:py-3 rounded-xl shadow-md text-sm sm:text-base text-center
    "
  >
    <span className="font-semibold">{serviciosFilterActivos.length}</span>
    <span className="truncate">servicios disponibles</span>
  </div>

  {/* Botones Lista/Mapa y Opinión */}
  <div
    className="
      flex justify-center sm:justify-start w-full sm:w-auto 
      flex-wrap sm:flex-nowrap gap-2
    "
  >
    <button
      onClick={handleToggleView}
      className="
        hover:cursor-pointer
        bg-white/90 backdrop-blur-md shadow-md border border-gray-200 
        rounded-full px-4 py-2 flex items-center justify-center gap-2 
        hover:bg-gray-100 transition-all duration-300 
        text-sm sm:text-base w-full sm:w-auto
      "
    >
      {mode === "map" ? (
        <FiList className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      ) : (
        <FiMap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      )}
      <span>{mode === "map" ? "Lista" : "Mapa"}</span>
    </button>

    <div className="w-full flex justify-center">
      <BotonOpinion />
    </div>
  </div>
</div>

      </div>

      {/* Panel lateral (solo escritorio) */}
      {servicioSeleccionado && (
        <div
          className={`hidden lg:block bg-white border-l border-gray-200 shadow-inner overflow-y-auto transition-all duration-300 w-[400px]`}
        >
          <DetalleServicio servicio={servicioSeleccionado} />
        </div>
      )}
    </div>

  {/* Panel inferior (solo móvil) */}
{servicioSeleccionado && (
  <>
    {/* Versión no expandida */}
    {!isMobileExpanded && (
      <div
        className="block lg:hidden bg-white rounded-3xl shadow-lg overflow-hidden 
                   transform transition-all duration-500 ease-in-out translate-y-0 opacity-100"
      >
        <div
          className="w-full bg-primary h-[30px] flex items-center justify-center rounded-t-3xl cursor-pointer"
          onClick={handleClickExpanded}
        >
          <div className="w-[80px] h-[6px] bg-white rounded-full"></div>
        </div>
          <DetalleServicio servicio={servicioSeleccionado} />
      </div>
    )}

    {/* Versión expandida */}
    {isMobileExpanded && (
      <div
        className="block lg:hidden fixed bottom-0 left-0 right-0 z-[9999] 
                   bg-white shadow-2xl rounded-t-3xl overflow-y-auto 
                   transform transition-all duration-500 ease-in-out 
                   translate-y-0 opacity-100 height-cutom-mapa-service-filter"
      >
        <div
          className="w-full bg-primary h-[30px] flex items-center justify-center rounded-t-3xl cursor-pointer"
          onClick={handleClickExpanded}
        >
          <div className="w-[80px] h-[6px] bg-white rounded-full"></div>
        </div>
        <div
          className="transition-opacity duration-500 ease-in-out opacity-100"
        >
          <DetalleServicio servicio={servicioSeleccionado} />
        </div>
      </div>
    )}
  </>
)}



  </div>
);

};

export default MapaServicios;
