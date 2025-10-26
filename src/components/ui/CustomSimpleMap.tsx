/* eslint-disable @typescript-eslint/no-unused-vars */
import { MapContainer, TileLayer, Marker, useMap, useMapEvent, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, forwardRef, useState } from "react";

type SimpleMapaProps = {
  lat: number;
  lng: number;
  onMove?: (lat: number, lng: number) => void;
  customIcon?: string;
  zoom?: number;
};




const ChangeView = ({
  center,
  zoom,
  mapMovedByUser,
}: {
  center: [number, number];
  zoom: number;
  mapMovedByUser: boolean;
}) => {
  const map = useMap();
  useEffect(() => {
    if (!mapMovedByUser) {
      map.setView(center, zoom);
    }
  }, [center, zoom, mapMovedByUser]);
  return null;
};

// Componente para detectar si el usuario mueve el mapa
const DetectMapMove = ({ onMove }: { onMove: () => void }) => {
  useMapEvent("movestart", () => {
    onMove();
  });
  return null;
};

const CustomSimpleMapa = forwardRef<HTMLDivElement, SimpleMapaProps>(
  ({ lat, lng, onMove, customIcon, zoom = 18 }, _ref) => {
    const [markerPos, setMarkerPos] = useState<[number, number]>([lat, lng]);
    const [mapMovedByUser, setMapMovedByUser] = useState(false);

    const defaultIcon = useMemo(() => {
      return new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [60, 61],
        iconAnchor: [30, 61],
      });
    }, []);
    useEffect(() => {
      setMarkerPos([lat, lng]);
      setMapMovedByUser(false); // solo centrar al cargar o cambiar props externas
    }, [lat, lng]);

    const markerIcon = useMemo(() => {
      if (!customIcon) return defaultIcon;
      return new L.Icon({
        iconUrl: customIcon,
        iconSize: [60, 61],
        iconAnchor: [30, 61],
      });
    }, [customIcon]);

    return (
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        className="border border-gray-300 rounded-lg w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <ChangeView center={[lat, lng]} zoom={zoom} mapMovedByUser={mapMovedByUser} />

        <DetectMapMove onMove={() => setMapMovedByUser(true)} />

        <Marker
          position={markerPos}
          icon={markerIcon}
          draggable
          eventHandlers={
            onMove
              ? {
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setMarkerPos([lat, lng]);
                    onMove(lat, lng);
                  },
                }
              : undefined
          }
        />

        <ZoomControl position="bottomright" />
      </MapContainer>
    );
  }
);

export default CustomSimpleMapa;
