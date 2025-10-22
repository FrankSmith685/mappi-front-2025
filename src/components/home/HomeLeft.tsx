import { FaUtensils } from "react-icons/fa"
import { CustomButton } from "../ui/CustomButton"
import CustomImage from "../ui/CustomImage"
import { useNavigate } from "react-router-dom"

export const HomeLeft=()=>{
    const navigate= useNavigate();
    const handleClickBuscarComida=()=>{
        navigate("/servicios?m=map");
    }
    return(
        <div className="w-[350px] bg-white h-screen rounded-tr-[40%] fixed top-0 left-0 z-50 shadow-2xl hidden lg:flex">
            <div className="w-full h-full flex items-center justify-center gap-0 flex-col px-10">
                <CustomImage
                    name={"logo_03"}
                    alt="mappi-logo"
                    className="object-contain transition-all duration-300 !w-[200px] !h-auto"
                />
                <p className="font-raphtalia text-gray-900 text-2xl sm:text-3xl -mt-[30px] text-center leading-[1em] mb-4">Los mejores huariques estan aquí</p>
                <CustomButton
                    type='button'
                    variant='primary'
                    fullWidth
                    size='md'
                    fontSize='14px'
                    icon={<FaUtensils/>}
                    fontWeight={400}
                    text='Buscar Comida'
                    onClick={handleClickBuscarComida}
                />
            </div>
        </div>
    )
}