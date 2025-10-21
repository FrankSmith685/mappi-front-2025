import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import ModalOpinion from "./modal/modalComentario";
import { useAppState } from "../../../hooks/useAppState";
// import ModalOpinion from "./ModalOpinion"; // importa tu modal

interface BotonOpinionProps {
  className?: string; // opcional para custom styling
}

const BotonOpinion = ({ className = "" }: BotonOpinionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useAppState();

  const handleClickModalOpen=()=>{
    if(user){
        
    }else{
        setIsModalOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClickModalOpen}
        className={`bg-purple-600 justify-center hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 transition-all text-center duration-300 ${className}`}
        title="Comparte tu opinión"
      >
        <FiMessageSquare className="w-5 h-5" />
        <span className="inline font-medium text-sm">Comparte tu opinión</span>
      </button>

      {/* Modal de Opinión */}
      <ModalOpinion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BotonOpinion;
