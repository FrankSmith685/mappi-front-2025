import { useState, useEffect, type ReactNode } from "react";
import { LocationContext } from "./locationContext";

interface Props {
  children: ReactNode;
}

export const LocationProvider = ({ children }: Props) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // Coordenadas por defecto → Lima
  const DEFAULT_LAT = -12.0464;
  const DEFAULT_LNG = -77.0428;

  // Obtener coordenadas del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("El navegador no soporta geolocalización. Usando ubicación por defecto.");
      setLat(DEFAULT_LAT);
      setLng(DEFAULT_LNG);
      return;
    }

    // Obtener posición inicial
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
      },
      (err) => {
        console.warn("Error al obtener ubicación inicial:", err);
        setLat(DEFAULT_LAT);
        setLng(DEFAULT_LNG);
      },
      { enableHighAccuracy: true }
    );

    // Track en tiempo real
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
      },
      (err) => {
        console.warn("Error al observar cambios de ubicación:", err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Función manual para actualizar ubicación
  const setLocation = (data: Partial<{ lat: number | null; lng: number | null }>) => {
    if (data.lat !== undefined) setLat(data.lat);
    if (data.lng !== undefined) setLng(data.lng);
  };

  return (
    <LocationContext.Provider
      value={{
        lat,
        lng,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
