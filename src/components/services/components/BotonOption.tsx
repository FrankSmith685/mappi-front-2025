import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { useAppState } from "../../../hooks/useAppState";
import ModalComentarioLogin from "./modal/modalComentarioLogin";

interface BotonOpinionProps {
  className?: string;
}

const BotonOpinion = ({ className = "" }: BotonOpinionProps) => {
  const {setModalResena} = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAppState();

  const handleClickModalOpen = () => {
    if (user) {
      setModalResena(true)
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClickModalOpen}
        className={`bg-gray-800 hover:bg-gray-700 hover:cursor-pointer sm:w-auto w-full text-white px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
        title="Comparte tu opinión"
      >
        <FiMessageSquare className="w-5 h-5" />
        <span className="font-medium text-sm sm:text-base">
          Comparte tu opinión
        </span>
      </button>

      <ModalComentarioLogin
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BotonOpinion;
