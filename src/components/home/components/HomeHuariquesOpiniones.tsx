import React from "react";
import { FaCommentDots } from "react-icons/fa";
import { CustomButton } from "../../ui/CustomButton";

interface Opinion {
  id: number;
  nombre: string;
  texto: string;
}

interface Props {
  opiniones?: Opinion[];
}

export const HomeHuariquesOpiniones: React.FC<Props> = ({ opiniones = [] }) => {
  const isEmpty = !opiniones || opiniones.length === 0;

  return (
    <section className="bg-gradient-to-r from-orange-400 to-rose-500 text-white py-16 px-6 text-center rounded-3xl mt-10 shadow-lg">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 drop-shadow">
        Lo que dicen los comensales
      </h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/90">
          <FaCommentDots className="text-6xl mb-6 text-white/70" />
          <h3 className="text-2xl font-semibold mb-3">Aún no hay opiniones</h3>
          <p className="max-w-md mx-auto mb-6 text-lg">
            Sé el primero en compartir tu experiencia y ayuda a otros a descubrir los mejores huariques de la ciudad.
          </p>
          <CustomButton
            text="Deja tu opinión"
            type="button"
            fontSize="14px"
            fontWeight={400}
            variant="primary-outline-white"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {opiniones.map((op) => (
            <div
              key={op.id}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md hover:bg-white/20 transition-all duration-300"
            >
              <p className="italic text-lg leading-relaxed">“{op.texto}”</p>
              <p className="mt-4 font-semibold text-white/90">- {op.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
