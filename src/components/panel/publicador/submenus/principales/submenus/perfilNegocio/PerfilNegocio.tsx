
// import PerfilEmpresa from "./components/PerfilEmpresa";
import PerfilIndependiente from "./components/PerfilIndependiente";
// import { useAppState } from "../../../../../../../hooks/useAppState";

const PerfilNegocio = () => {
  // const {selectedPerfil} = useAppState();

  return (
    <div className="space-y-6">
      <div>
        <PerfilIndependiente />
      </div>
    </div>
  );
};

export default PerfilNegocio;
