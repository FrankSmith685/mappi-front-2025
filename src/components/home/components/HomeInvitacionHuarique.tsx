import React from "react";
import { useNavigate } from "react-router-dom";

export const HomeInvitacionHuarique: React.FC = () => {
  const navigate = useNavigate();

  const handlePublicar = () => {
    navigate("/panel/publicador"); // 🔹 Cambia la ruta si tu flujo es distinto
  };

  return (
    <section className="bg-primary py-14 px-6 text-center rounded-3xl max-w-5xl mx-auto my-16 shadow-lg text-white">
      <h2 className="text-3xl font-extrabold mb-4 drop-shadow">
        ¿Tienes un huarique?
      </h2>

      <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
        Únete a nuestra comunidad y haz que todos descubran tu sazón única.
      </p>

      <button
        onClick={handlePublicar}
        className="bg-white cursor-pointer text-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
      >
        Publica tu Huarique
      </button>
    </section>
  );
};
