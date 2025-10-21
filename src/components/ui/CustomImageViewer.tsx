import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";

interface ImageViewerProps {
  images: { src: string; alt?: string }[];
  startIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const CustomImageViewer: React.FC<ImageViewerProps> = ({
  images,
  startIndex = 0,
  isOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setCurrentIndex(startIndex);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, startIndex]);

  if (!visible || images.length === 0) return null;

  const { src, alt } = images[currentIndex];

  const prevImage = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center 
      bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-md
      transition-opacity duration-300 ease-in-out
      ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      {/* Botón cerrar */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute hover:cursor-pointer top-4 z-50 right-4 p-2 sm:p-3 rounded-full bg-white/10 
        hover:bg-white/20 border border-white/30 shadow-lg transition transform hover:scale-110"
      >
        <FaTimes className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Flecha izquierda */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute hover:cursor-pointer z-50 left-4 sm:left-8 p-3 rounded-full bg-white/10 
          hover:bg-white/20 border border-white/30 shadow-lg text-white"
        >
          <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Contenedor principal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex items-center justify-center w-full h-full px-3 sm:px-6 md:px-10 lg:px-16"
      >
        <img
          src={src}
          alt={alt || "Vista previa"}
          className="rounded-2xl shadow-2xl object-contain border border-white/20
          max-w-full max-h-[75vh] sm:max-h-[85vh] transition-transform duration-500 hover:scale-105"
        />

        {/* Texto descriptivo superpuesto */}
        {alt && (
          <div className="absolute bottom-6 w-[90%] sm:w-[70%] bg-gradient-to-t from-black/70 to-transparent rounded-xl px-4 py-3">
            <p className="text-xs sm:text-sm md:text-base text-white text-center font-medium leading-snug">
              {alt}
            </p>
          </div>
        )}

        {/* Fondo decorativo difuminado */}
        <div className="absolute -z-10 w-[80%] h-[80%] rounded-full bg-gradient-to-r 
        from-purple-500/30 via-pink-500/30 to-indigo-500/30 blur-3xl animate-pulse"></div>
      </div>

      {/* Flecha derecha */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute hover:cursor-pointer z-50 right-4 sm:right-8 p-3 rounded-full bg-white/10 
          hover:bg-white/20 border border-white/30 shadow-lg text-white"
        >
          <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};

export default CustomImageViewer;
