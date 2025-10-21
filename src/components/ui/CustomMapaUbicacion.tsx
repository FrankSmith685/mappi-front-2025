import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CustomMapaProps {
  lat: number;
  lng: number;
  onMove?: (lat: number, lng: number) => void;
  customIcon?: string;
}

const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const CustomMapaUbicacion: React.FC<CustomMapaProps> = ({ lat, lng, onMove, customIcon }) => {
  const [markerPos, setMarkerPos] = useState<[number, number]>([lat, lng]);

  const markerIcon = new L.Icon({
    iconUrl: customIcon || "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 41],
    iconAnchor: [20, 41],
  });

  // Sincroniza la posición del pin con las coordenadas externas
  useEffect(() => {
    setMarkerPos([lat, lng]);
  }, [lat, lng]);

  return (
    <div className="w-full h-full" style={{ minHeight: 300 }}>
      <MapContainer center={[lat, lng]} zoom={17} style={{ height: "100%", width: "100%" }}>
        <ChangeView center={markerPos} zoom={17} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker
          position={markerPos}
          icon={markerIcon}
          draggable
          eventHandlers={{
            drag: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setMarkerPos([lat, lng]);
            },
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setMarkerPos([lat, lng]);
              onMove?.(lat, lng);
            },
          }}
        />
      </MapContainer>
    </div>
  );
};

export default CustomMapaUbicacion;
