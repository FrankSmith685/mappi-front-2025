/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useRef,
} from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import type { ServicioActivoData } from "../../interfaces/IServicio";
// import { useLocation } from "../../hooks/useLocationHooks/useLocation";
import {
  getSelectedSubcategoriaImage,
  getSubcategoriaImage,
} from "../../helpers/getCategoria";
import { useAppState } from "../../hooks/useAppState";
import { useSearchParams } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("es");

//  Ícono por defecto
const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 41],
  iconAnchor: [20, 41],
});

type MapaUbicacionProps = {
  lat: number;
  lng: number;
  onMove?: (lat: number, lng: number) => void;
  onSelectServicio?: (servicio: ServicioActivoData) => void;
  customIcon?: string;
  type?: "default" | "service";
  servicios?: ServicioActivoData[];
  servicioSeleccionado?: ServicioActivoData | null;
  zoom?: number;
};



//  Centrar mapa dinámicamente
const ChangeView = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (!center || !center[0] || !center[1]) return;
    const current = map.getCenter();
    const distance = map.distance(current, L.latLng(center));
    if (distance > 50) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    } else {
      map.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);
  return null;
};

//  Control de zoom personalizado
const AddZoomControl = ({ position }: { position: L.ControlPosition }) => {
  const map = useMap();
  useEffect(() => {
    const zoomControl = L.control.zoom({ position });
    zoomControl.addTo(map);
    return () => {
      zoomControl.remove();
    };
  }, [map, position]);
  return null;
};



// 🧮 Calcular distancia (Haversine)
// const calcularDistanciaKm = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

const CustomMapa = forwardRef(
  (
    {
      lat,
      lng,
      onMove,
      onSelectServicio,
      customIcon,
      type = "default",
      servicios = [],
      zoom = 15,
      servicioSeleccionado = null,
    }: MapaUbicacionProps,
    ref
  ) => {
    // const { lat: currentLat, lng: currentLng } = useLocation();
    // const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const { setServicioSeleccionado } = useAppState();
    const markersRef = useRef<Record<string, L.Marker>>({});

    const markerIcon = useMemo(() => {
      if (!customIcon) return defaultIcon;
      const isDefaultPin = customIcon.includes("flaticon.com");
      
      let iconSize: [number, number] = [40, 41];
      let iconAnchor: [number, number] = [20, 41];
      if (!isDefaultPin) {
        iconSize = type === "service" ? [91, 91] : [50, 51];
        iconAnchor = [iconSize[0] / 2, iconSize[1]];
      }
      return new L.Icon({ iconUrl: customIcon, iconSize, iconAnchor });
    }, [customIcon, type]);

    const zoomControlPosition = type === "service" ? "bottomright" : "topleft";

    

    const MapContent = () => {
      const map = useMap();

      useImperativeHandle(ref, () => ({
        //  Centrar en coordenadas
        recenterTo(lat: number, lng: number) {
          map.flyTo([lat, lng], 18, { animate: true, duration: 1.2 });
        },

        //  Volar hacia un servicio y abrir popup
        flyToService(servicio: ServicioActivoData) {
          const sLat = parseFloat(servicio.direccion?.latitud || "0");
          const sLng = parseFloat(servicio.direccion?.longitud || "0");
          if (!sLat || !sLng) return;
          map.flyTo([sLat, sLng], 18, { animate: true, duration: 1.2 });
          setTimeout(() => {
            const marker = markersRef.current?.[servicio.cod_servicio];
            if (marker) marker.openPopup();
          }, 700);
        },

        //  Abrir popup directamente
        openPopupForService(cod: string) {
          const marker = markersRef.current?.[cod];
          if (marker) marker.openPopup();
        },
      }));

      return null;
    };

    

    return (
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className={`${
          type === "default" ? "border rounded-lg" : ""
        } w-full border-gray-400`}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapContent />
        <ChangeView center={[lat, lng]} zoom={zoom} />
        <AddZoomControl position={zoomControlPosition} />

        {/*  Marcador principal */}
        <Marker
          position={[lat, lng]}
          icon={markerIcon}
          draggable={type !== "service"}
          eventHandlers={
            type !== "service"
              ? {
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    onMove?.(lat, lng);
                  },
                }
              : undefined
          }
        />

        {/* 🔵 Radio de 5 km */}
        {
          type=="service" && <>
            <Circle
            center={[lat, lng]}
            radius={5000}
            pathOptions={{ 
              color: "#FF6C4F",       // color del borde del círculo
              fillColor: "#FF6C4F",   // color de relleno
              fillOpacity: 0.1        // opacidad del relleno
            }}
          />
          </>
        }
        

        {/*  Marcadores de servicios */}
        {servicios.map((servicio) => {
          const sLat = parseFloat(servicio.direccion?.latitud || "0");
          const sLng = parseFloat(servicio.direccion?.longitud || "0");
          if (!sLat || !sLng) return null;

          const isSelected =
            servicioSeleccionado?.cod_servicio === servicio.cod_servicio;
          const iconUrl = isSelected
            ? getSelectedSubcategoriaImage(servicio.subcategoria)
            : getSubcategoriaImage(servicio.subcategoria);

          // const serviceIcon = new L.Icon({
          //   iconUrl,
          //   iconSize: isSelected ? [80, 81] : [60, 61],
          //   iconAnchor: [30, 61],
          // });
          const iconSize: [number, number] = isSelected ? [80, 81] : [60, 61];
            // ancla centrada horizontalmente y al fondo verticalmente
          const iconAnchor: [number, number] = [Math.floor(iconSize[0] / 2), iconSize[1]];

          // const portada =
          //   servicio.archivos?.find((a) => a.tipo === "portada")?.ruta ||
          //   servicio.archivos?.find((a) => a.tipo === "logo")?.ruta ||
          //   "https://cdn-icons-png.flaticon.com/512/684/684908.png";

          // const distanciaKm =
          //   currentLat && currentLng
          //     ? calcularDistanciaKm(currentLat, currentLng, sLat, sLng).toFixed(
          //         1
          //       )
          //     : null;
          const serviceIcon = new L.Icon({
            iconUrl,
            iconSize,
            iconAnchor,
            // opcional: agrega clase para estilos CSS si quieres (por ejemplo, sombra)
            className: isSelected ? "marker-selected" : undefined,
          });

          return (
            <Marker
              key={servicio.cod_servicio}
              ref={(m) => {
                if (m) markersRef.current[servicio.cod_servicio] = m;
              }}
              position={[sLat, sLng]}
              icon={serviceIcon}
              // asegurar que el marcador seleccionado quede por encima
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: (e) => {
                  const map = e.target._map;
                  if (map)
                    map.flyTo([sLat, sLng], 18, {
                      animate: true,
                      duration: 1.2,
                    });
                  onSelectServicio?.(servicio);
                },
                popupclose: () => {
                  setServicioSeleccionado(null);
                  if (location.pathname === "/servicios") {
                    const currentParams = Object.fromEntries(searchParams.entries());
                    if ("s" in currentParams) {
                      delete currentParams.s;
                      setSearchParams(currentParams);
                    }
                  }
                },
              }}
            >
              {/* {type === "service" && (
                // <Popup className="custom-popup">
                //   <div className="w-[220px] sm:w-[260px] text-gray-800">
                //     {portada && (
                //       <img
                //         src={portada}
                //         alt={servicio.nombre}
                //         className="w-full h-28 object-cover rounded-lg mb-2"
                //       />
                //     )}

                //     <div className="flex items-center gap-2 mb-1">
                //       {servicio.archivos?.find((a) => a.tipo === "logo")
                //         ?.ruta && (
                //         <img
                //           src={
                //             servicio.archivos.find((a) => a.tipo === "logo")
                //               ?.ruta
                //           }
                //           alt="Logo"
                //           className="w-8 h-8 rounded-full border object-cover"
                //         />
                //       )}
                //       <div>
                //         <h3 className="font-semibold text-sm sm:text-base truncate">
                //           {servicio.nombre}
                //         </h3>
                //         <p className="text-[11px] text-gray-500">
                //           {servicio.subcategoria?.nombre || "Sin subcategoría"}
                //         </p>
                //       </div>
                //     </div>

                //     <p className="text-xs text-gray-600 flex items-center gap-1">
                //        {servicio.direccion?.direccion || "Sin dirección"}
                //     </p>

                //     <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                //       <span>⏱️ {dayjs(servicio.fechaRegistro).fromNow()}</span>
                //       {distanciaKm && <span>📏 {distanciaKm} km</span>}
                //     </div>

                //     {servicio.archivos?.filter((a) => a.tipo === "imagen")
                //       .length > 0 && (
                //       <div className="mt-2 grid grid-cols-3 gap-1">
                //         {servicio.archivos
                //           .filter((a) => a.tipo === "imagen")
                //           .slice(0, 3)
                //           .map((img, i) => (
                //             <img
                //               key={i}
                //               src={img.ruta}
                //               alt={`Imagen ${i + 1}`}
                //               className="w-full h-16 object-cover rounded-md"
                //             />
                //           ))}
                //         {servicio.archivos.filter(
                //           (a) => a.tipo === "imagen"
                //         ).length > 3 && (
                //           <div className="flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-semibold rounded-md">
                //             +
                //             {servicio.archivos.filter(
                //               (a) => a.tipo === "imagen"
                //             ).length - 3}
                //           </div>
                //         )}
                //       </div>
                //     )}

                //     <button
                //       onClick={() => {
                //         const encoded = btoa(servicio.cod_servicio);
                //         navigate(`/servicios/${encoded}`);
                //       }}
                //       className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1.5 rounded-md transition"
                //     >
                //       Ver servicio
                //     </button>
                //   </div>
                // </Popup>
              )} */}
            </Marker>
          );
        })}
      </MapContainer>
    );
  }
);

export default CustomMapa;
