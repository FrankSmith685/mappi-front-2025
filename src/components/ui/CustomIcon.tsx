import { useMemo } from "react";
import L from "leaflet";
import { FaSpinner } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { useImagePreloader } from "../../hooks/useImageHooks/useImagePreloader";

type CustomIconProps = {
  name: string;
  size?: [number, number];
  anchor?: [number, number];
  alt?: string;
};

export const useCustomIcon = ({
  name,
  size = [40, 40],
  anchor,
  alt = "custom-pin",
}: CustomIconProps): L.Icon | L.DivIcon => {
  const { images, isLoaded } = useImagePreloader();
  const imageSrc = images[name];

  return useMemo(() => {
    if (isLoaded && imageSrc) {
      //  usa L.icon con imagen real
      return L.icon({
        iconUrl: imageSrc,
        iconSize: size,
        iconAnchor: anchor ?? [size[0] / 2, size[1]],
      });
    }

    // ⏳ mientras carga → spinner con divIcon
    return L.divIcon({
      html: ReactDOMServer.renderToString(
        <div
          style={{
            width: `${size[0]}px`,
            height: `${size[1]}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        </div>
      ),
    //   className: "custom-pin",
      iconSize: size,
      iconAnchor: anchor ?? [size[0] / 2, size[1]],
    });
  }, [isLoaded, imageSrc, size, anchor, alt]);
};

