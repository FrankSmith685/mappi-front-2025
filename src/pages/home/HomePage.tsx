/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { HomeLeft } from "../../components/home/HomeLeft";
import type { ServicioActivoDataChevere } from "../../interfaces/IServicioPlanChevere";
import { useServicio } from "../../hooks/useServicio";
import { CarruselPublicidad } from "../../components/home/components/CarruselChevere";
import { HomeHeroMobile } from "../../components/home/components/HomeHeroMobile";
import { HomeCategorias } from "../../components/home/components/HomeCategorias";
import { HomeHuariquesPremium } from "../../components/home/components/HomeHuariquesPremium";
import type { ServicioActivoDataPremium } from "../../interfaces/IServicioPremium";
import { HomeHuariquesDestacados } from "../../components/home/components/HomeHuariquesDestacados";
import { HomeHuariquesOpiniones } from "../../components/home/components/HomeHuariquesOpiniones";
import { HomeInvitacionHuarique } from "../../components/home/components/HomeInvitacionHuarique";
import { useAppState } from "../../hooks/useAppState";
import UserTypeModal from "../../components/ui/UserTypeMode";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [chevere, setChevere] = useState<ServicioActivoDataChevere[]>([]);
  const [premium, setPremium] = useState<ServicioActivoDataPremium[]>([]);

  const { getServiciosActivosChevere, getServiciosActivosPremium } = useServicio();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const {setTypeUserAuth, accessToken} = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    getServiciosActivosChevere((success, _message, data) => {
      if (success && data) {
        setChevere(data);
      }
    });
    getServiciosActivosPremium((success, _message, data) => {
      if (success && data) setPremium(data);
    });
  }, []);


  const handleSelectType = (type: "comensal" | "vendedor") => {
    setShowUserTypeModal(false);
    if (type === "vendedor") {
      setTypeUserAuth("emprendedor");
      navigate("/registrar");
    } else if (type === "comensal") {
       setTypeUserAuth("comensal");
      navigate("/servicios?m=map");
    }
  };

  const opinionesDemo = [
    { id: 1, nombre: "Carlos", texto: "El ceviche de Don Paco es el mejor que he probado en años. 10/10" },
    { id: 2, nombre: "Lucía", texto: "Me encantó el café artesanal, el ambiente súper acogedor." },
    { id: 3, nombre: "Pedro", texto: "La picantería me recordó a la comida de mi abuela, delicioso." },
  ];

  return (
    <div className="w-full bg-gray-100">
      <HomeLeft/>
      {/* responsive-padding */}
      <div className="w-full lg:pl-[350px] h-full repos">
        
        {/*  Hero con buscador */}
        <HomeHeroMobile/>
        
        {/* Carrusel */}
        <CarruselPublicidad chevere={chevere} />

        {/*  Categorías */}
        <HomeCategorias/>

        {/*  Huariques Premium */}
        <HomeHuariquesPremium huariques={premium}/>


        {/*  Huariques Destacados */}
        <HomeHuariquesDestacados destacados={chevere} />

        {/*  Opiniones */}
        <HomeHuariquesOpiniones opiniones={opinionesDemo} />

        {/*  CTA para publicar huariques */}
        <HomeInvitacionHuarique />

      </div>
      {!accessToken && (
        <UserTypeModal
          open={!accessToken ? true :showUserTypeModal}
          onClose={() => setShowUserTypeModal(false)}
          onSelectType={handleSelectType}
        />
      )}

    </div>
  );
}
