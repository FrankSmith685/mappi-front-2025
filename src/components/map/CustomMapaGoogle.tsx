import {
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";

import { forwardRef, useState, useMemo } from "react";
import { MainMarker } from "./MainMarker";
import { ServiceMarker } from "./ServiceMarker";
import { ServiceCircle } from "./ServiceCircle";

import { buildMainIcon, buildServiceIcon } from "../../utils/map/buildIcons";
import { getSelectedSubcategoriaImage, getSubcategoriaImage } from "../../helpers/getCategoria";
import { useGoogleMapControls } from "../../hooks/useGoogleMapControls";

import { GOOGLE_MAPS_API_KEY } from "../../config/googleMaps";
import type { ServicioActivoData } from "../../interfaces/IServicio";

type Props = {
  lat: number;
  lng: number;
  onMove?: (lat: number, lng: number) => void;
  onSelectServicio?: (s: ServicioActivoData) => void;
  servicios?: ServicioActivoData[];
  servicioSeleccionado?: ServicioActivoData | null;
  customIcon?: string;
  type?: "default" | "service";
  zoom?: number;
};

const containerStyle = { width: "100%", height: "100%" };

const CustomMapaGoogle = forwardRef((props: Props, ref) => {
  const {
    lat,
    lng,
    onMove,
    onSelectServicio,
    servicios = [],
    servicioSeleccionado,
    customIcon,
    zoom = 15,
    type = "default",
  } = props;

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedService, setSelectedService] =
    useState<ServicioActivoData | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Exponer métodos
  useGoogleMapControls(ref, map, servicios, setSelectedService);

  // ⛔ evita recrear icono
  const mainMarkerIcon = useMemo(
    () =>
      buildMainIcon(
        customIcon ??
          "https://cdn-icons-png.flaticon.com/512/684/684908.png"
      ),
    [customIcon]
  );

  // ✅ memo del centro
  const centerMemo = useMemo(() => ({ lat, lng }), [lat, lng]);

  // ✅ memo de las styles
  const mapStyles = useMemo(
    () => [
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "poi.business", stylers: [{ visibility: "off" }] },
      { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
      { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
      {
        featureType: "poi.place_of_worship",
        stylers: [{ visibility: "off" }],
      },
      { featureType: "poi.school", stylers: [{ visibility: "off" }] },
      {
        featureType: "poi.sports_complex",
        stylers: [{ visibility: "off" }],
      },
    ],
    []
  );

  // ✅ memo opciones del mapa (NO deben cambiar nunca)
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      rotateControl: false,
      scaleControl: false,
      gestureHandling: "greedy",
      clickableIcons: false,
      styles: mapStyles,
    }),
    [mapStyles]
  );

  // ✅ memo de markers (evita recrearlos)
  const markersMemo = useMemo(
    () =>
      servicios.map((s) => {
        const isSelected =
          servicioSeleccionado?.cod_servicio === s.cod_servicio;

        const icon = buildServiceIcon(
          isSelected
            ? getSelectedSubcategoriaImage(s.subcategoria)
            : getSubcategoriaImage(s.subcategoria),
          isSelected
        );

        return (
          <ServiceMarker
            key={s.cod_servicio}
            servicio={s}
            selected={isSelected}
            icon={icon}
            opened={selectedService?.cod_servicio === s.cod_servicio}
            onClick={(serv) => {
              setSelectedService(serv);
              onSelectServicio?.(serv);
            }}
            onClose={() => setSelectedService(null)}
          />
        );
      }),
    [servicios, servicioSeleccionado, selectedService]
  );

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      center={centerMemo}
      zoom={zoom}
      mapContainerStyle={containerStyle}
      options={mapOptions}
      onLoad={(m) => setMap(m)}
    >
      <MainMarker
        lat={lat}
        lng={lng}
        draggable={type !== "service"}
        icon={mainMarkerIcon}
        onMove={onMove}
      />

      {type === "service" && <ServiceCircle lat={lat} lng={lng} />}

      {markersMemo}
    </GoogleMap>
  );
});

export default CustomMapaGoogle