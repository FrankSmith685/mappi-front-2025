/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CustomAlert from "../../ui/CustomAlert";
import { CustomButton } from "../../ui/CustomButton";
import FilterPanel from "./components/FilterAviso";
import NoResultsHeader from "./components/NoResultsHeader";
import PendingTask from "./components/PendingTask";
import ProductoState from "./components/ProductoState";
import ListaAvisos from "./components/ListaAvisos";

import { useAviso } from "../../../hooks/useAviso";
import { useAppState } from "../../../hooks/useAppState";
import type { AvisosDTO } from "../../../interfaces/IAviso";
import { FaRegFrown } from "react-icons/fa";
import { useUser } from "../../../hooks/useUser";

const Avisos = () => {
  const { getAvisos } = useAviso();
  const [isLoading, setIsLoading] = useState(true);

  const { 
    setListaAvisos,
    setFiltroAvisos, 
    filtroAvisos, 
    listaAvisos, 
    setMenuOpen,
    setProgressService,
    progressService,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setMultimediaService,
    setDireccionService,
    setIsServiceEdit,
    setMultimediaAvisoPreview
  } = useAppState();

  const [mensajeBienvenida, setMensajeBienvenida] = useState("Cargando avisos...");
  const [alertVariant, setAlertVariant] = useState<"primary" | "secondary" | "warning">("primary");

  const navigate = useNavigate();
  const {getUserInfo} = useUser();

  const handleClickPublicarAvisos = async() => {
    navigate("/panel/publicador");
    setMenuOpen(true);
    setProgressService({
      ...progressService,
      currentPath:"/panel/publicador/principales",
      step:1,
    })
    setService(null);
    setModifiedService(null);
    setProgressPrincipalService({
        ...progressPrincipalService,
        step: 1,
        currentPath: "/panel/publicador/principales/perfilnegocio",
    });
    setMultimediaService(null);
    setDireccionService(null);
    await getUserInfo();
    setIsServiceEdit(false);
    setMultimediaAvisoPreview(null);
  };

  useEffect(() => {
    setIsLoading(true); 
    getAvisos((success, _message, data) => {
      if (!success) return;

      setListaAvisos(data as AvisosDTO);
      setFiltroAvisos(data?.avisos ?? []);

      const avisos = data?.avisos ?? [];
      const publicados = avisos.filter(a => a.AVIS_Estado === "publicado");
      const borradores = avisos.filter(a => a.AVIS_Estado === "borrador");

      if (avisos.length === 0) {
        setMensajeBienvenida("Aún no tienes avisos. Crea tu primer aviso.");
        setAlertVariant("primary");
      } else if (publicados.length > 0 && borradores.length > 0) {
        setMensajeBienvenida("Tienes avisos activos y también algunos en borrador.");
        setAlertVariant("secondary");
      } else if (publicados.length > 0) {
        setMensajeBienvenida("¡Todos tus avisos están activos!");
        setAlertVariant("primary");
      } else if (borradores.length > 0 && data?.planes_disponibles === 0) {
        setMensajeBienvenida("Tienes avisos en borrador pero sin planes disponibles.");
        setAlertVariant("secondary");
      } else if (borradores.length > 0) {
        setMensajeBienvenida("Tienes avisos en borrador. Complétalos para publicarlos.");
        setAlertVariant("secondary");
      } else {
        setMensajeBienvenida("¡Te damos la bienvenida al panel de avisos!");
        setAlertVariant("primary");
      }
      setIsLoading(false);
    });
  }, [listaAvisos.avisos.length]);

  const renderContent = () => {
    if (listaAvisos.avisos.length === 0) {
      return (
        <div className="w-full h-auto relative flex flex-col items-center justify-center gap-4">
          <div className="w-full gap-1 flex flex-col items-center justify-center">
            <FaRegFrown className="text-gray-400 text-7xl" />
            <p className="w-full text-gray-800 font-bold text-xl text-center">
              No encontramos ningún aviso
            </p>
            <p className="text-gray-800 w-full text-center text-sm">
              Todavía no tienes ningún aviso publicado
            </p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            size="md"
            fontSize="14px"
            fontWeight={600}
            text="Continuar"
            onClick={handleClickPublicarAvisos}
          />
        </div>
      );
    } else if (filtroAvisos.length === 0) {
      return (
        <div className="w-full gap-1 flex flex-col items-center justify-center">
          <p className="w-full text-gray-800 font-bold text-xl text-center">
            No encontramos ningún elemento que coincida con tu búsqueda.
          </p>
          <p className="text-gray-800 w-full text-center text-sm">
            Prueba eliminando alguno de los filtros o utilizando otros términos.
          </p>
        </div>
      );
    } else {
      return <ListaAvisos />;
    }
  };

  return (
    <>
      {
        isLoading ? (
          <div className="w-full flex flex-col items-center justify-center gap-3 py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-600 font-medium">Cargando avisos...</p>
          </div>
        ):(
          <div className="flex flex-col gap-4 responsive-padding">
            <CustomAlert message={mensajeBienvenida} variant={alertVariant} />
            <PendingTask />
            <div className="w-full h-[1px] bg-gray-200" />

            <div className="w-full flex md:flex-row flex-col items-start justify-center gap-4">
              <FilterPanel />
              <div className="w-full flex flex-col gap-4 overflow-auto">
                <ProductoState />
                <div className="w-full h-auto flex flex-col gap-4 flex-1">
                  <NoResultsHeader />
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default Avisos;
