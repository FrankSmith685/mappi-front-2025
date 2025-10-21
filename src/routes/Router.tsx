/* eslint-disable react-hooks/exhaustive-deps */

import { Routes, Route, useSearchParams, Navigate, useNavigate } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import ComponentPage from "../pages/components/ComponentPage";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useAppState } from "../hooks/useAppState";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotificacionHooks/useNotification";
import ProtectedRoute from "./ProtectedRoute";
import PanelPage from "../pages/panel/PanelPage";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import { useEmpresa } from "../hooks/useEmpresa";
import ServiciosPage from "../pages/services/ServiciosPage";
import ServicioDetallePage from "../pages/services/Detail/ServicioDetallePage";

const AppRouter = () => {
  const {getUserInfo} = useUser();
  const {validateResetToken}= useAuth();
  const {accessToken,setChangePasswordToken,changePasswordToken } = useAppState();
  const [searchParams] = useSearchParams();
  const {showMessage} = useNotification();
  const navigate= useNavigate();
  const {getEmpresa} = useEmpresa();

  // Obtener el perfil del usuari
    useEffect(() => {
      if (!accessToken) return;
      getUserInfo();
      getEmpresa();
    }, [accessToken]);

    useEffect(() => {
      const token = searchParams.get("resetToken");
      if (!token) return;

      validateResetToken(token, (isValid, message) => {
        if (isValid) {
          navigate("/cambiar-contrasena")
          setChangePasswordToken(token);
        } else {
          showMessage(message ?? 'Error al obtener token','error');
        }
      });
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }, []);

  return (
    // <Router>
    <div className="pt-0">
        <Routes>
        {/* Rutas públicas (siempre accesibles) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/components" element={<ComponentPage />} />
        {/* Vista general del mapa o servicios */}
        <Route path="/servicios" element={<ServiciosPage />} />

        {/* Vista de detalle del servicio */}
        <Route path="/servicios/:id" element={<ServicioDetallePage />} />
        {/* <Route path="/terminos-condiciones-de-uso" element={<TerminosCondiciones />} /> */}

        {/* Rutas solo para NO autenticados */}
        <Route element={<PublicRoute />}>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/iniciar" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/recuperar" element={<ForgotPasswordPage />} />
          {changePasswordToken && (
            <Route path="/cambiar-contrasena" element={<ChangePasswordPage />} />
          )}
          {/* <Route path="/recuperar" element={<ForgotPage />} />
          <Route path="/actualizar-contrasena" element={<UpdatePasswordPage />} />
          <Route path="/registro" element={<RegisterPage />} /> */}
        </Route>

        {/* Rutas protegidas (solo para autenticados) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<Navigate to="/panel/avisos" replace />} />
          <Route path="/panel/:option" element={<PanelPage />} />
          <Route path="/panel/:option/:suboption" element={<PanelPage />} />
          <Route path="/panel/:option/:suboption/:subsuboption" element={<PanelPage />} />
          <Route path="/panel/:option/:suboption/:subsuboption/:id" element={<PanelPage />} />

        </Route>

        {/* Ruta de Admin */}
        {/* <Route element={<AdminRoute />}>
          <Route path="/panel-admin" element={<AdminPage />} />
          <Route path="/panel-admin/:option" element={<AdminPage />} />
        </Route> */}


        {/* Rutas de Servicios */}
        {/* <Route path="/servicios" element={<ServiciosPage />} /> */}

        {/* Página 404 para rutas inexistentes */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
      
    // </Router>
  );
};

export default AppRouter;
