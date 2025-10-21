import type { ServicioActivoData } from "../interfaces/IServicio";

// utils/filterByDistance.ts
export const filterByDistance = (
  servicios: ServicioActivoData[],
  userLat: number,
  userLng: number,
  radiusKm = 5
) => {
  // función auxiliar para calcular distancia en km entre 2 coordenadas
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // filtrar servicios dentro del radio
  return servicios.filter((srv) => {
    const lat = Number(srv.direccion?.latitud ?? 0);
    const lng = Number(srv.direccion?.longitud ?? 0);
    if (!lat || !lng) return false;

    const distance = getDistanceKm(userLat, userLng, lat, lng);
    return distance <= radiusKm;
  });
};
