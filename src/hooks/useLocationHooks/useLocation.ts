import { useContext } from "react";
import { LocationContext } from "./locationContext";

// Hook para usar fácilmente el contexto de ubicación
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation debe usarse dentro de un LocationProvider");
  }
  return context; // Retorna los datos del contexto
};
