/* eslint-disable @typescript-eslint/no-explicit-any */
//  useImagePreloader.ts
import { useEffect, useState } from "react";
import { imageList } from "../../utils/imageUtils";
import { imageBaseUrl } from "../../api/apiConfig";

interface ImagePreloaderState {
  images: Record<string, string>;
  isLoaded: boolean;
}

//  Variables globales: mantienen cache durante la sesión
let globalCache: Record<string, string> = {};
let globalLoaded = false;

export const useImagePreloader = (): ImagePreloaderState => {
  const [images, setImages] = useState<Record<string, string>>(globalCache);
  const [isLoaded, setIsLoaded] = useState(globalLoaded);

  useEffect(() => {
    // Si ya está cargado globalmente, evitamos recargar
    if (globalLoaded) return;

    let isMounted = true;

    //  Intentar recuperar cache guardado en localStorage
    const savedCache = localStorage.getItem("imageCache");
    if (savedCache) {
      try {
        const parsed = JSON.parse(savedCache);
        globalCache = parsed;
        globalLoaded = true;
        if (isMounted) {
          setImages(parsed);
          setIsLoaded(true);
        }
        return; // Ya tenemos todo cargado desde localStorage
      } catch (err) {
        console.error("Error leyendo cache local:", err);
      }
    }

    const loadImages = async () => {
      for (const { name, key } of imageList) {
        // Si ya está en cache global, saltar
        if (globalCache[name]) continue;

        const src = `${imageBaseUrl}${key}`;
        const img: HTMLImageElement = new Image();
        img.src = src;

        // Esperar a que la imagen cargue o falle
        const loadPromise: Promise<void> =
          "decode" in img
            ? img.decode().catch(() => {})
            : new Promise((resolve) => {
                const image = img as HTMLImageElement;
                image.onload = () => resolve();
                image.onerror = () => resolve();
              });



        await loadPromise;

        // Actualizar el estado progresivamente
        if (isMounted) {
          globalCache[name] = src;
          setImages({ ...globalCache });
          // Guardar cache actualizado
          localStorage.setItem("imageCache", JSON.stringify(globalCache));
        }
      }

      if (isMounted) {
        globalLoaded = true;
        setIsLoaded(true);
      }
    };

    //  Ejecutar carga en segundo plano (sin bloquear render)
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadImages);
    } else {
      setTimeout(loadImages, 0);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, isLoaded };
};
