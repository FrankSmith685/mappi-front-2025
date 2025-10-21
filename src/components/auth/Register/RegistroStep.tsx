import React from "react";
import CustomImage from "../../ui/CustomImage";

const pasos = [
  {
    numero: 1,
    titulo: "Paso 1",
    descripcion: "Geolocaliza tu local para que te ubiquen fácilmente.",
    imagen: "info_01",
  },
  {
    numero: 2,
    titulo: "Paso 2",
    descripcion: "Personaliza tu local digital con logo y portada.",
    imagen: "info_02",
  },
  {
    numero: 3,
    titulo: "Paso 3",
    descripcion: "Agrega tu número de WhatsApp para pedidos.",
    imagen: "info_03",
  },
  {
    numero: 4,
    titulo: "Paso 4",
    descripcion: "Publica y recibe clientes en minutos.",
    imagen: "info_04",
  },
];

const RegistroStep: React.FC = () => {
  return (
    <section className="w-full px-4 py-4 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl  md:text-4xl font-bold text-center mb-4 text-gray-700">
          Sigue estos pasos para registrar tu negocio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pasos.map((paso) => (
            <div
              key={paso.numero}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center border border-gray-200"
            >
              {/* Número del paso */}
              <div className="w-10 h-10 mb-4 rounded-full bg-[#f2645a] text-white flex items-center justify-center font-bold text-sm">
                {paso.numero}
              </div>

              {/* Imagen */}
              <CustomImage
                name={paso.imagen}
                alt={`Paso ${paso.numero}`}
                className="object-contain !w-[100px] !h-[100px] mb-4"
              />

              {/* Título */}
              <h3 className="font-semibold text-lg text-gray-800 mb-1">{paso.titulo}</h3>

              {/* Descripción */}
              <p className="text-sm text-gray-600">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistroStep;
