import React from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../ui/CustomButton";

export const HomeInvitacionHuarique: React.FC = () => {
  const navigate = useNavigate();

  const handlePublicar = () => {
    navigate("/panel/publicador");
  };

  return (
    <section className="bg-primary py-14 px-6 text-center rounded-3xl max-w-5xl mx-auto my-16 shadow-lg text-white">
      <h2 className="text-3xl font-extrabold mb-4 drop-shadow">
        ¿Tienes un huarique?
      </h2>

      <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
        Únete a nuestra comunidad y haz que todos descubran tu sazón única.
      </p>

      <CustomButton
        text="Publica tu Huarique"
        type="button"
        variant="primary-outline-white"
        fontSize="14px"
        fontWeight={400}
        onClick={handlePublicar}
      />
    </section>
  );
};
