/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
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

    //  Centrar mapa
    if (mapRef.current?.flyToService && servicio.direccion?.latitud && servicio.direccion?.longitud) {
  mapRef.current.flyToService(servicio);
}


    //  Abrir popup desde el mapa
    setTimeout(() => {
      if (mapRef.current?.openPopupForService) {
        mapRef.current.openPopupForService(servicio.cod_servicio);
      }
    }, 800);
  };

  const location = useRouterLocation();
const isListadoServicios = location.pathname === "/servicios";

  //  Si la URL ya tiene un servicio, seleccionarlo y abrir su popup
  useEffect(() => {
    if (!isListadoServicios) return; //  Solo ejecutar en listado
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



  return (
  <div
    className={`${
      !isShowFilterService
        ? "height-cutom-mapa-service-not-filter"
        : "height-cutom-mapa-service-filter"
    } relative z-20 overflow-visible bg-gray-50 rounded-3xl shadow-lg flex`}
  >
    {/* 🗺️ Mapa */}
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

      {/* Botones encima del mapa */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-6 left-6 z-[999] bg-primary text-white rounded-full p-3 shadow-lg hover:bg-[#e35c3d] transition-all duration-300"
        title="Centrar en mi ubicación"
      >
        <FiNavigation className="w-5 h-5 text-white" />
      </button>

      <div className="absolute top-6 left-1/2 sm:left-auto sm:right-6 -translate-x-1/2 sm:translate-x-0 z-[999] flex flex-col sm:flex-row items-center sm:items-start gap-2 w-full sm:w-auto px-4">
        <div className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow-md">
          <span>{serviciosFilterActivos.length}</span>
          <span>servicios disponibles</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleToggleView}
            className="bg-white/90 backdrop-blur-md shadow-md border border-gray-200 rounded-full px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base"
          >
            {mode === "map" ? (
              <FiList className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            ) : (
              <FiMap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            )}
            <span>{mode === "map" ? "Lista" : "Mapa"}</span>
          </button>

          <BotonOpinion />
        </div>
      </div>
    </div>

    {/* 📋 Panel lateral */}
    {servicioSeleccionado && (
      <div className="w-[400px] bg-white border-l border-gray-200 shadow-inner p-4 overflow-y-auto">
        <DetalleServicio servicio={servicioSeleccionado} />
      </div>
    )}
  </div>
);

};

export default MapaServicios;
