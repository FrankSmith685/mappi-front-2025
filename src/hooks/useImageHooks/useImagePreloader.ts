/* eslint-disable @typescript-eslint/no-explicit-any */
// useImagePreloader.ts
import { useEffect, useState } from "react";
import { imageList } from "../../utils/imageUtils";
import { imageBaseUrl } from "../../api/apiConfig";

interface ImagePreloaderState {
  images: Record<string, string>;
  isLoaded: boolean;
}

const CACHE_VERSION = "v2";
let globalCache: Record<string, string> = {};
let globalLoaded = false;

export const useImagePreloader = (): ImagePreloaderState => {
  const [images, setImages] = useState<Record<string, string>>(globalCache);
  const [isLoaded, setIsLoaded] = useState(globalLoaded);

  useEffect(() => {
    let isMounted = true;

    const savedVersion = localStorage.getItem("imageCacheVersion");
    const savedCache = localStorage.getItem("imageCache");

    // ✅ Cargar desde cache aunque globalLoaded sea true (React StrictMode safe)
    if (savedCache && savedVersion === CACHE_VERSION) {
      try {
        const parsed = JSON.parse(savedCache);
        const hasImages = Object.keys(parsed).length > 0;
        if (hasImages) {
          console.log("🟢 Cargando imágenes desde localStorage");
          globalCache = parsed;
          if (isMounted) {
            setImages(parsed);
            setIsLoaded(true);
          }
          globalLoaded = true;
          return;
        }
      } catch (err) {
        console.error("❌ Error leyendo cache local:", err);
      }
    } else {
      console.log("⚠️ Cache inválido o versión distinta. Limpieza...");
      localStorage.removeItem("imageCache");
      localStorage.removeItem("imageCacheVersion");
    }

    const loadImages = async () => {
      console.log("🔄 Precargando imágenes...");
      try {
        const loadPromises = imageList.map(({ name, key }) => {
          const src = `${imageBaseUrl}${key}`;
          const img = new Image();
          img.src = src;

          return new Promise<void>((resolve) => {
            img.onload = () => {
              globalCache[name] = src;
              resolve();
            };
            img.onerror = () => {
              console.warn(`⚠️ Error cargando imagen: ${src}`);
              resolve();
            };
          });
        });

        await Promise.all(loadPromises);

        if (isMounted) {
          console.log("✅ Imágenes cargadas completamente");
          setImages({ ...globalCache });
          setIsLoaded(true);
        }

        localStorage.setItem("imageCache", JSON.stringify(globalCache));
        localStorage.setItem("imageCacheVersion", CACHE_VERSION);
        globalLoaded = true;
      } catch (err) {
        console.error("❌ Error cargando imágenes:", err);
      }
    };

    // Carga en segundo plano
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadImages);
    } else {
      setTimeout(loadImages, 0);
    }

    return () => {
      isMounted = false;
    };
  }, []); // 👈 sin dependencia globalLoaded (debe ejecutarse siempre una vez por montaje real)

  return { images, isLoaded };
};
