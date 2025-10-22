import { useState, useEffect, type ReactNode } from "react";
import { LocationContext } from "./locationContext";
import { useUbigeo } from "../../hooks/useUbigeo";

interface Props {
  children: ReactNode;
}

export const LocationProvider = ({ children }: Props) => {
  const { getUbigeoByCoords } = useUbigeo();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [departamento, setDepartamento] = useState<string | null>(null);
  const [provincia, setProvincia] = useState<string | null>(null);
  const [distrito, setDistrito] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);

  //  Coordenadas por defecto → Lima
  const DEFAULT_LOCATION = {
    lat: -12.0464,
    lng: -77.0428,
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Cercado de Lima",
    direccion: "Plaza Mayor de Lima",
  };

  //  Obtener coordenadas del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("El navegador no soporta geolocalización. Usando ubicación por defecto.");
      setLat(DEFAULT_LOCATION.lat);
      setLng(DEFAULT_LOCATION.lng);
      setDepartamento(DEFAULT_LOCATION.departamento);
      setProvincia(DEFAULT_LOCATION.provincia);
      setDistrito(DEFAULT_LOCATION.distrito);
      setDireccion(DEFAULT_LOCATION.direccion);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
      },
      (err) => {
        console.warn("Error al obtener ubicación:", err);
        //  Fallback a Lima si falla la geolocalización
        setLat(DEFAULT_LOCATION.lat);
        setLng(DEFAULT_LOCATION.lng);
        setDepartamento(DEFAULT_LOCATION.departamento);
        setProvincia(DEFAULT_LOCATION.provincia);
        setDistrito(DEFAULT_LOCATION.distrito);
        setDireccion(DEFAULT_LOCATION.direccion);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🌎 Traducir coordenadas a datos de ubicación
  useEffect(() => {
    if (lat && lng) {
      getUbigeoByCoords(
        lat,
        lng,
        (dep, prov, dist, dir) => {
          if (dep) setDepartamento(dep);
          else setDepartamento(DEFAULT_LOCATION.departamento);

          if (prov) setProvincia(prov);
          else setProvincia(DEFAULT_LOCATION.provincia);

          if (dist) setDistrito(dist);
          else setDistrito(DEFAULT_LOCATION.distrito);

          if (dir) setDireccion(dir);
          else setDireccion(DEFAULT_LOCATION.direccion);
        },
        //  Callback opcional en caso de error en la API
        (error) => {
          console.warn("Error en getUbigeoByCoords:", error);
          setLat(DEFAULT_LOCATION.lat);
          setLng(DEFAULT_LOCATION.lng);
          setDepartamento(DEFAULT_LOCATION.departamento);
          setProvincia(DEFAULT_LOCATION.provincia);
          setDistrito(DEFAULT_LOCATION.distrito);
          setDireccion(DEFAULT_LOCATION.direccion);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  //  Función global para actualizar ubicación manualmente
  const setLocation = (data: Partial<{
    lat: number | null;
    lng: number | null;
    departamento: string | null;
    provincia: string | null;
    distrito: string | null;
    direccion: string | null;
  }>) => {
    if (data.lat !== undefined) setLat(data.lat);
    if (data.lng !== undefined) setLng(data.lng);
    if (data.departamento !== undefined) setDepartamento(data.departamento);
    if (data.provincia !== undefined) setProvincia(data.provincia);
    if (data.distrito !== undefined) setDistrito(data.distrito);
    if (data.direccion !== undefined) setDireccion(data.direccion);
  };

  return (
    <LocationContext.Provider
      value={{
        lat,
        lng,
        departamento,
        provincia,
        distrito,
        direccion,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
