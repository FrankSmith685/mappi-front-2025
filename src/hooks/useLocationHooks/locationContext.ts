import { createContext } from "react";

// Define los datos que tendrá el contexto de ubicación
export interface LocationContextProps {
  lat: number | null;
  lng: number | null;
  setLocation: (data: Partial<LocationContextProps>) => void;
}

// Crea el contexto para compartir la ubicación en la app
export const LocationContext = createContext<LocationContextProps | undefined>(undefined);
