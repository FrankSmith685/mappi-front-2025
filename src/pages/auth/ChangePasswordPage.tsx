import React from "react";
import CustomImage from "../../components/ui/CustomImage";
import { ChangePasswordForm } from "../../components/auth/ChangePassword/ChangePasswordData";

const ChangePasswordPage: React.FC = () => {
  return (
    <div className="flex lg:flex-row flex-col min-h-screen font-sans w-full">
      {/* Lado izquierdo con el logo */}
      <div className="lg:w-[450px] bg-primary-gradient text-white flex items-center justify-center w-full h-[80px] lg:h-screen lg:rounded-tr-[200px]">
        <CustomImage
          name={"logo_02"}
          alt="mappi-logo"
          className="object-contain transition-all duration-300 !w-[150px] lg:!w-[250px] !h-full"
        />
      </div>

      {/* Lado derecho con el formulario */}
      <div className="w-full flex-1 flex items-center justify-center responsive-padding">
        <div className="w-full max-w-[500px] flex flex-col gap-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
