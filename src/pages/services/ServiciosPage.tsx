/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ServiciosHeader from "../../components/services/header/ServiciosHeader";
import MapaServicios from "../../components/services/type/MapaServicios";
import { useAppState } from "../../hooks/useAppState";
import { useServicio } from "../../hooks/useServicio";
import ListaServicios from "../../components/services/type/ListaServicios";
import ModalComentario from "../../components/services/components/modal/modalComentario";

const Servicios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setServiciosActivos, setServiciosFilterActivos } = useAppState();
  const { getServiciosActivos } = useServicio();

  const mode = searchParams.get("m");

  useEffect(() => {
    getServiciosActivos((success, message, data) => {
      if (success && data) {
        const servicios = data.servicios ?? data;
        setServiciosActivos(servicios);
        setServiciosFilterActivos(servicios);
      } else {
        console.warn(message);
      }
    });
  }, []);

  useEffect(() => {
    //  Si no hay "m", agregamos "map" por defecto
    if (!mode) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("m", "map");
        return newParams;
      });
    }
  }, [mode]);

  return (
    <>
       <div className="flex flex-col">
        {/* Header con filtros */}
        <ServiciosHeader />

        {/* Modo Mapa o Lista */}
        {mode === "map" ? <MapaServicios /> : <ListaServicios />}
      </div>
      <ModalComentario />
    </>
  );
};

export default Servicios;
