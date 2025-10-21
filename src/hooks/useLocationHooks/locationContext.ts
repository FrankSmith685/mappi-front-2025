import { createContext } from "react";

// Define los datos que tendrá el contexto de ubicación
export interface LocationContextProps {
  lat: number | null;
  lng: number | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  direccion: string | null;
  setLocation: (data: Partial<LocationContextProps>) => void; // Función para actualizar datos
}

// Crea el contexto para compartir la ubicación en la app
export const LocationContext = createContext<LocationContextProps | undefined>(undefined);
