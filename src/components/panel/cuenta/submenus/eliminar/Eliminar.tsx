

// import EliminarConPassword from "./EliminarConPassword";
// import EliminarConGoogle from "./EliminarConGoogle";
import { useAppState } from "../../../../../hooks/useAppState";
import EliminarConGoogle from "./EliminarConGoogle";
import EliminarConPassword from "./EliminarConPassword";

const Eliminar = () => {
  const { user } = useAppState();

  const tieneCorreo = user?.metodosLogin?.includes("correo");

  return (
    <div className="space-y-6">
      {tieneCorreo ? (
        <EliminarConPassword />
      ) : (
        <EliminarConGoogle />
      )}
    </div>
  );
};

export default Eliminar;
