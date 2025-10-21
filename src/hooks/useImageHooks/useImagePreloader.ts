import { useEffect, useRef, useState } from "react";
import { imageList } from "../../utils/imageUtils";
import { imageBaseUrl } from "../../api/apiConfig";

interface ImagePreloaderState {
  images: Record<string, string>;
  isLoaded: boolean;
}

export const useImagePreloader = (): ImagePreloaderState => {
  const images = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      const promises = imageList.map(({ name, key }) => {
        return new Promise<void>((resolve) => {
          if (images.current[name]) {
            resolve();
            return;
          }

          const src = `${imageBaseUrl}${key}`;
          const img: HTMLImageElement = new Image();
          img.src = src;

          if ("decode" in img) {
            img
              .decode()
              .then(() => {
                images.current[name] = src;
                resolve();
              })
              .catch(() => {
                console.error(`Error al decodificar la imagen: ${src}`);
                resolve();
              });
          } else {
            (img as HTMLImageElement).onload = () => {
              images.current[name] = src;
              resolve();
            };
            (img as HTMLImageElement).onerror = () => {
              console.error(`Error al cargar la imagen: ${src}`);
              resolve();
            };
          }

        });
      });

      await Promise.all(promises);
      if (isMounted) setIsLoaded(true);
    };

    // 🚀 Inicia precarga inmediatamente
    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return { images: images.current, isLoaded };
};
