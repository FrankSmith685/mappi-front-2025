import type { ServicioActivoData } from "../../interfaces/IServicio";

export const parseServiceCoords = (servicio: ServicioActivoData) => {
  const lat = parseFloat(servicio.direccion?.latitud || "0");
  const lng = parseFloat(servicio.direccion?.longitud || "0");
  if (!lat || !lng) return null;

  return { lat, lng };
};
