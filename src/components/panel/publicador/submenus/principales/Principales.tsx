import { useParams, Navigate } from "react-router-dom";
import Huarique from "./submenus/huarique/Huarique";
import PerfilNegocio from "./submenus/perfilNegocio/PerfilNegocio";
import { useAppState } from "../../../../../hooks/useAppState";

const Principales = () => {
  const { progressPrincipalService } = useAppState();
  const { subsuboption } = useParams<{ subsuboption?: string }>();

  const currentStep = progressPrincipalService.step;

  const allowedOptionsByStep: { [key: number]: string[] } = {
    1: ["perfilnegocio"],
    2: ["perfilnegocio", "huarique"],
  };

  const validOptions = allowedOptionsByStep[currentStep] || [];

  // 🔹 Validación rutas inválidas dentro de principales
  if (
    window.location.pathname.startsWith("/panel/publicador/principales") &&
    (!subsuboption || !validOptions.includes(subsuboption))
  ) {
    return <Navigate to={progressPrincipalService.currentPath} replace />;
  }

  // 🔹 Render según step
  const renderSubComponent = () => {
    switch (subsuboption) {
      case "perfilnegocio":
        return <PerfilNegocio />;
      case "huarique":
        return <Huarique />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 flex-wrap md:flex-nowrap px-0">
      <main className="flex-1 bg-white">{renderSubComponent()}</main>
    </div>
  );
};

export default Principales;
