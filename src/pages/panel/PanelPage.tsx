import { useParams, useNavigate } from "react-router-dom";
import Avisos from "../../components/panel/avisos/Avisos";
import Cuenta from "../../components/panel/cuenta/Cuenta";
import Actividad from "../../components/panel/actividad/Actividad";
import Publicador from "../../components/panel/publicador/Publicador";
import { CustomSidebarMenu } from "../../components/ui/CustomSidebarMenuUser";
import { Capacitacion } from "../../components/panel/capacitacion/Capacitacion";
import { useAppState } from "../../hooks/useAppState";
import { useEffect } from "react";
import { MisPlanes } from "../../components/panel/planes/Planes";

const PanelPage = () => {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  const { user } = useAppState();

  //  Validar acceso a "capacitaciones"
  useEffect(() => {
    if (option === "capacitaciones" && user?.tienePlan === null) {
      navigate("/panel/avisos"); // redirige a avisos o donde desees
    }
  }, [option, user, navigate]);

  const renderContent = () => {
    switch (option) {
      case "avisos":
        return <Avisos />;
      case "cuenta":
        return <Cuenta />;
      case "actividad":
        return <Actividad />;
      case "publicador":
        return <Publicador />;
      case "capacitaciones":
        //  Renderizar solo si tiene plan
        if (user?.tienePlan === null) {
          return (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acceso restringido</h2>
              <p>No tienes un plan activo para acceder a esta sección.</p>
            </div>
          );
        }
        return <Capacitacion />;
        case "planes":
        if (user?.tieneServicio === null) {
          return (
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acceso restringido</h2>
              <p>No tienes un plan activo para acceder a esta sección.</p>
            </div>
          );
        }
        return <MisPlanes />;
      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Sección no encontrada</h2>
            <p>
              La opción <strong>{option}</strong> no es válida.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex md:hidden">
        <CustomSidebarMenu />
      </div>
      {renderContent()}
    </div>
  );
};

export default PanelPage;
