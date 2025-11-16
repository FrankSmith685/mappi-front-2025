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
// const ChangeView = ({
//   center,
//   zoom,
// }: {
//   center: [number, number];
//   zoom: number;
// }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (!center || !center[0] || !center[1]) return;
//     const current = map.getCenter();
//     const distance = map.distance(current, L.latLng(center));
//     if (distance > 50) {
//       map.flyTo(center, zoom, { animate: true, duration: 1.2 });
//     } else {
//       map.setView(center, zoom);
//     }
//   }, [center[0], center[1], zoom]);
//   return null;
// };

// Centrar mapa dinámicamente SOLO desde la segunda vez
const ChangeView = ({
  center,
  zoom,
  enableAfterFirstFix = true
}: {
  center: [number, number];
  zoom: number;
  enableAfterFirstFix?: boolean;
}) => {
  const map = useMap();
  const hasCenteredOnce = useRef(false);

  useEffect(() => {
    const [lat, lng] = center;
    if (!lat || !lng) return;

    // Primera vez → solo marcar como cargado, NO centrar
    if (!hasCenteredOnce.current) {
      hasCenteredOnce.current = true;
      return;
    }

    // Si el usuario no quiere esta validación, se centra siempre
    if (!enableAfterFirstFix) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
      return;
    }

    // Desde la segunda vez → sí centrar con validación de distancia
    const current = map.getCenter();
    const distance = map.distance(current, L.latLng(center));

    if (distance > 50) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    } else {
      map.setView(center, zoom);
    }

  }, [center[0], center[1]]);

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

      useEffect(() => {
        const resizeTimer = setTimeout(() => {
          try {
            map.invalidateSize(false);
          } catch (e) {
            console.warn("Mapa no listo aún:", e);
          }
        }, 500);

        return () => clearTimeout(resizeTimer);
      }, [map]);


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

        {/*  Radio de 5 km */}
        {
          type=="service" && <>
            <Circle
            center={[lat, lng]}
            radius={5000}
            pathOptions={{ 
              color: "#FF6C4F",
              fillColor: "#FF6C4F",
              fillOpacity: 0.1
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

          const iconSize: [number, number] = isSelected ? [80, 81] : [60, 61];
          const iconAnchor: [number, number] = [Math.floor(iconSize[0] / 2), iconSize[1]];

          const serviceIcon = new L.Icon({
            iconUrl,
            iconSize,
            iconAnchor,
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
            </Marker>
          );
        })}
      </MapContainer>
    );
  }
);

export default CustomMapa;
