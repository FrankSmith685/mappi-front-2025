import { useNavigate } from "react-router-dom";
import CustomImage from "./CustomImage";

export default function Logo({ isActive }: { isActive: boolean }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="max-w-[150px] w-full cursor-pointer" onClick={handleClick}>
      <div className="flex items-center flex-col w-full">
        <CustomImage
          name={isActive ? "logo_02" : "logo_01"}
          alt="starmobiliario"
          className="object-contain transition-all duration-300 !w-auto !h-full"
        />
      </div>
    </div>
  );
}
