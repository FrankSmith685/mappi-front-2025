// pages/LoginPage.tsx
import React from "react";
import CustomImage from "../../components/ui/CustomImage";
import { RegistroForm } from "../../components/auth/Register/RegistroFormData";
import RegistroSection from "../../components/auth/Register/RegistroSection";
import RegistroStep from "../../components/auth/Register/RegistroStep";

const RegisterPage: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen font-sans overflow-hidden flex flex-col">
      <div className="w-full h-full fixed inset-0 z-10">
        <img alt="desktop_register" className=" size-custom object-cover hidden md:flex" src="https://mappidevbucket.s3.amazonaws.com/mapp_229"></img>
        <img alt="mobile_register" className="md:hidden size-custom object-cover" src="https://mappidevbucket.s3.amazonaws.com/mapp_230"></img>
        <div className="absolute inset-0 w-full h-full bg-primary opacity-45"></div>
      </div>
      <div className="bg-white flex items-center justify-center w-full h-[80px] z-20 relative">
        <CustomImage
          name={"logo_01"}
          alt="mappi-logo"
          className="object-contain transition-all duration-300 !w-[150px] !h-full"
        />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-20 w-full flex-1 flex items-start justify-center responsive-padding py-12 ">
        <div className="w-full h-full flex gap-12 flex-col-reverse lg:flex-row items-center justify-center">
            <div className="w-full max-w-[450px] bg-white p-4 rounded-xl">
                <RegistroForm/>
            </div>
            <div className="w-full flex-1 h-full max-w-[600px] lg:max-w-[900px]">
                <RegistroSection/>
            </div>
        </div>
      </div>
      <div className="w-full h-[80px] border-b-[1px] border-gray-300 flex items-center justify-center z-20 bg-white">
        <p className="text-2xl text-gray-800 ">Empezar a <span className="font-bold">vender</span> es sencillo</p>
      </div>
      <div className="w-full h-full z-20">
        <RegistroStep/>
      </div>
    </div>
  );
};

export default RegisterPage;
