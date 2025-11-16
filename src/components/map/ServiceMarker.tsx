import { Marker, InfoWindow } from "@react-google-maps/api";
import { parseServiceCoords } from "../../utils/map/servicesParser";
import type { ServicioActivoData } from "../../interfaces/IServicio";

type ServiceMarkerProps = {
  servicio: ServicioActivoData;
  selected?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onClick: (servicio: ServicioActivoData) => void;
  opened: boolean;
  onClose: () => void;
};

export const ServiceMarker = ({
  servicio,
  icon,
  onClick,
  opened,
  onClose,
}: ServiceMarkerProps) => {
  const coords = parseServiceCoords(servicio);
  if (!coords) return null;

  return (
    <>
      <Marker
        position={coords}
        icon={icon}
        onClick={() => onClick(servicio)}
      />

      {opened && (
        <InfoWindow position={coords} onCloseClick={onClose}>
            <div>
                <strong>Servicio:</strong> {servicio.cod_servicio}
            </div>
        </InfoWindow>
      )}
    </>
  );
};
