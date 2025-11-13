// pages/LoginPage.tsx
import React from "react";
import CustomImage from "../../components/ui/CustomImage";
import { RegistroForm } from "../../components/auth/Register/RegistroFormData";
import RegistroSection from "../../components/auth/Register/RegistroSection";
import RegistroStep from "../../components/auth/Register/RegistroStep";
import { useAppState } from "../../hooks/useAppState";
import { FaStore, FaUtensils } from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const {typeUserAuth, setTypeUserAuth} = useAppState();
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
                {typeUserAuth ? (
                  <RegistroForm />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center gap-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      ¿Cómo deseas registrarte?
                    </h2>

                    <p className="text-gray-600 text-sm max-w-[350px]">
                      Elige una opción para continuar con el registro.  
                      Si eres <span className="font-semibold text-primary">Comensal</span>, podrás explorar los huariques.  
                      Si eres <span className="font-semibold text-yellow-600">Emprendedor</span>, podrás registrar tu negocio.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      {/* Card Comensal */}
                      <div
                        onClick={() => setTypeUserAuth("comensal")}
                        className="cursor-pointer bg-white border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3"
                      >
                        <div className="bg-primary/10 p-4 rounded-full text-primary">
                          <FaUtensils size={28} />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">Comensal</h3>
                        <p className="text-xs text-gray-500 text-center">
                          Descubre huariques y experiencias gastronómicas únicas.
                        </p>
                      </div>

                      {/* Card Emprendedor */}
                      <div
                        onClick={() => setTypeUserAuth("emprendedor")}
                        className="cursor-pointer bg-white border border-gray-200 hover:border-yellow-500 hover:shadow-lg transition-all duration-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3"
                      >
                        <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                          <FaStore size={28} />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">Emprendedor</h3>
                        <p className="text-xs text-gray-500 text-center">
                          Registra tu negocio y comparte tus sabores con el mundo.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
