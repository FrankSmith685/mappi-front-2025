import { Marker } from "@react-google-maps/api";

type MainMarkerProps = {
  lat: number;
  lng: number;
  draggable?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onMove?: (lat: number, lng: number) => void;
};

export const MainMarker = ({
  lat,
  lng,
  draggable = false,
  icon,
  onMove,
}: MainMarkerProps) => (
  <Marker
    position={{ lat, lng }}
    icon={icon}
    draggable={draggable}
    onDragEnd={(e) => {
      if (onMove) {
        onMove(e.latLng!.lat(), e.latLng!.lng());
      }
    }}
  />
);
