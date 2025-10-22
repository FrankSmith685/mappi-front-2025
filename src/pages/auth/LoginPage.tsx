/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaGoogle } from "react-icons/fa";
import CustomImage from "../../components/ui/CustomImage";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomLink } from "../../components/ui/CustomLink";
import { LoginForm } from "../../components/auth/Login/LoginForm";
import {  signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotificacionHooks/useNotification";

const LoginPage: React.FC = () => {

  const {loginUser} = useAuth();
  const navigate = useNavigate();
  const {showMessage} = useNotification();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const data = {
        correo: String(user.email),
        contraseña: result.user.uid,
        proveedor: "google" as const,
      };

      await loginUser(data, async (loginRes) => {
        if (loginRes.success) {
          navigate("/");
        } else {
          if (loginRes.message?.includes("Este usuario no tiene inicio de sesión con google")) {
            showMessage(
            "Tu cuenta existe pero no está vinculada con Google. Inicia sesión con tu correo y contraseña, y vincula Google desde tu perfil.",
            "error"
          );
          } else {
            showMessage(loginRes.message || "Error al iniciar sesión con Google", "error");
          }
        }
      });
    } catch (error:any) {
      showMessage("No se pudo iniciar sesión con Google", "error");
    }
  };

  return (
    <div className="flex lg:flex-row flex-col min-h-screen font-sans w-full">
      <div className="lg:w-[450px] bg-primary-gradient text-white flex items-center justify-center w-full h-[80px] lg:h-screen lg:rounded-tr-[200px]">
        <CustomImage
          name={"logo_02"}
          alt="mappi-logo"
          className="object-contain transition-all duration-300 !w-[150px] lg:!w-[250px] !h-full"
        />
      </div>

      <div className="w-full flex-1 flex items-center justify-center responsive-padding">
        <div className="w-full max-w-[500px] flex flex-col gap-4">
          <LoginForm />

          <div className="flex items-center justify-center">
            <span className="w-full h-px bg-gray-300" />
            <span className="mx-2 text-gray-500">ó</span>
            <span className="w-full h-px bg-gray-300" />
          </div>

          <CustomButton
            text="Iniciar Sesión con Google"
            type="button"
            fullWidth
            fontSize="14px"
            fontWeight={400}
            variant="warning"
            icon={<FaGoogle />}
            onClick={handleGoogleLogin}
          />

          <div className="text-center">
            <CustomLink
              to="/recuperar"
              text="¿Olvidaste tu contraseña?"
              variant="primary"
            />
          </div>

          <div className="text-center">
            ¿No tienes una cuenta?{" "}
            <CustomLink
              to="/registrar"
              text="Regístrate"
              variant="primary"
              fontWeight="bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
