import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaSpinner } from 'react-icons/fa';
import { useImagePreloader } from '../../hooks/useImageHooks/useImagePreloader';

type CustomImageProps = {
  name: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const CustomImage = ({ name, alt, width, height, className }: CustomImageProps) => {
    const { images, isLoaded } = useImagePreloader();
    const imageSrc = images[name];
    // const isBanner = name === 'banner_01';
    // const computedHeight = isBanner ? '100vh' : height ?? 'auto';

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: width ?? 'auto', height: height ?? 'auto' }}
    >
      {!isLoaded || !imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent animate-pulse z-10">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      )}

      <LazyLoadImage
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        effect="blur"
        className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default CustomImage;
