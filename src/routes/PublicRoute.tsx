// import { Navigate, Outlet } from "react-router-dom";

import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const rol = localStorage.getItem("rol");

  if (token) {
    // Si está logueado y es admin, redirigir al panel de administrador
    if (rol === "admin") return <Navigate to="/panel-admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
