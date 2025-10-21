import { useLocation } from "react-router-dom";
import { CustomLink } from "../ui/CustomLink";
import CustomImage from "../ui/CustomImage";

const Footer = () => {
  const location = useLocation();

  // Si la ruta actual es "/inicio", no renderizar nada
  if (location.pathname === "/registrar" ) {
    return (
        <div className={`w-full z-50 relative bottom-0 left-0 p-4 shadow-sm bg-primary-gradient flex flex-col justify-center items-center h-auto`}>
            <div className="flex items-center">
                <CustomImage
                    name={"logo_02"}
                    alt="mappi-logo"
                    className="object-contain transition-all duration-300 !w-[150px] lg:!w-[200px] !h-full"
                />
            </div>
            <hr className="w-full  border-white py-2"/>
            <div className="w-full flex items-center justify-between !text-gray-800 ">
                <p className=" text-sm">© Copyright 2025 mappi.pe</p>
                <CustomLink
                    to="/terminos-condiciones-uso"
                    text="Términos y condiciones de uso"
                    variant="secondary"
                    fontWeight="500"
                    fontSize="14px"
                />
            </div>
        </div>
    )};
  }
export default Footer;
