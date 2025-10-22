import React from "react";

interface Opinion {
  id: number;
  nombre: string;
  texto: string;
}

interface Props {
  opiniones: Opinion[];
}

export const HomeHuariquesOpiniones: React.FC<Props> = ({ opiniones }) => {
  return (
    <section className="bg-gradient-to-r from-orange-400 to-rose-500 text-white py-16 px-6 text-center rounded-3xl mt-10 shadow-lg">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 drop-shadow">
        Lo que dicen los comensales
      </h2>

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
    </section>
  );
};
