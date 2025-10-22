
import { FaUtensils } from "react-icons/fa";
import CustomImage from "../../ui/CustomImage";
import { CustomButton } from "../../ui/CustomButton";
import { useNavigate } from "react-router-dom";

export const HomeHeroMobile = () => {
    const navigate=useNavigate();

  const handleBuscarComida = () => {
    navigate("/servicios?m=map");
  };

  return (
    <section className="lg:hidden text-gray-800 py-10 px-6 flex flex-col items-center text-center">
      {/* Logo */}
      <CustomImage
        name={"logo_03"}
        alt="mappi-logo"
        className="object-contain transition-all duration-300 !w-[160px] !h-auto mb-4"
      />

      {/* Texto principal */}
      <p className="font-raphtalia text-gray-900 text-2xl sm:text-3xl -mt-[30px] leading-[1em] mb-4">
        Los mejores huariques están aquí
      </p>
      <p className="text-sm sm:text-base opacity-90 mb-6 flex items-center justify-center gap-2">
        <span>Encuentra comida auténtica cerca de ti</span>
        <FaUtensils className="text-primary text-lg" />
      </p>

      {/* Botón con ícono */}
      <div className=" w-full max-w-[300px] sm:w-[350px]">
        <CustomButton
          type="button"
          variant="primary"
          fullWidth
          size="md"
          fontSize="14px"
          fontWeight={400}
          icon={<FaUtensils />} // Ícono dentro del botón
          text="Buscar Comida"
          onClick={handleBuscarComida}
        />
      </div>
    </section>
  );
};
