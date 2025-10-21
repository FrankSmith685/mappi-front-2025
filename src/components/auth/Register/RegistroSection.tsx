import React from "react";
import { FaMapMarkerAlt, FaRegImage, FaWhatsapp } from "react-icons/fa";
// import { CustomButton } from "../ui/CustomButton";

const RegistroSection: React.FC = () => {
  return (
    <section className="relative w-full  text-white h-full">

      <div className="w-full mx-auto flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light">
          ¡Haz publicidad en la única{" "}
          <span className="font-bold">plataforma</span> de huariques del Perú!
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-xl">
            <FaMapMarkerAlt className="text-white text-lg lg:text-2xl" />
            <span>Geolocalización para que ubiquen tu local</span>
          </div>
          <div className="flex items-center gap-3 text-xl">
            <FaRegImage className="text-white text-lg lg:text-2xl" />
            <span>Personaliza tu local digital con logo y portada</span>
          </div>
          <div className="flex items-center gap-3 text-lg lg:text-2xl">
            <FaWhatsapp className="text-white text-2xl lg:text-3xl" />
            <span>Ingresa tu WhatsApp para delivery</span>
          </div>
        </div>

        <h3 className="text-2xl font-normal">
          ¡Registra tu negocio ahora mismo!
        </h3>

        {/* Bloque de "30 días gratis" */}
        <div className="bg-yellow-500 text-black px-7 py-4 rounded-md shadow-lg">
          <p className="text-3xl font-bold leading-none">30</p>
          <p className="text-base -mt-1">Días</p>
          <p className="text-base text-green-700">Gratis</p>
        </div>
      </div>
    </section>
  );
};

export default RegistroSection;
