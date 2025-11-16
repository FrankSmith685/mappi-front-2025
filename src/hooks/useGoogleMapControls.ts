/* eslint-disable @typescript-eslint/no-explicit-any */
import { useImperativeHandle } from "react";
import type { ServicioActivoData } from "../interfaces/IServicio";
import { parseServiceCoords } from "../utils/map/servicesParser";

export const useGoogleMapControls = (
  ref: any,
  map: google.maps.Map | null,
  servicios: ServicioActivoData[],
  setSelectedService: (s: ServicioActivoData | null) => void
) => {
  useImperativeHandle(ref, () => ({
    recenterTo(lat: number, lng: number) {
      map?.panTo({ lat, lng });
      map?.setZoom(18);
    },

    flyToService(servicio: ServicioActivoData) {
      const coords = parseServiceCoords(servicio);
      if (!coords) return;

      map?.panTo(coords);
      map?.setZoom(18);
      setSelectedService(servicio);
    },

    openPopupForService(cod: string) {
      const found = servicios.find((s) => s.cod_servicio === cod);
      if (found) setSelectedService(found);
    },
  }));
};
