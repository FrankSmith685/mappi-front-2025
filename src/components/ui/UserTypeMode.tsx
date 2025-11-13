import React from 'react'
import { FaUtensils, FaStore } from 'react-icons/fa'
import CustomModal from './CustomModal'
import CustomImage from './CustomImage'
import { CustomButton } from './CustomButton'

interface UserTypeModalProps {
  open: boolean
  onClose: () => void
  onSelectType: (type: 'comensal' | 'vendedor') => void
}

const UserTypeModal: React.FC<UserTypeModalProps> = ({ open, onClose, onSelectType }) => {
  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      width="450px"
      height="auto"
      closable={false}
      isclosable={false}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Ícono principal con fondo de gradiente */}
        <div className="w-full flex items-center justify-center  overflow-hidden rounded-xl">
          <div className="w-[150px] h-[90px] overflow-hidden flex items-center justify-center">
            <CustomImage
              name="logo_03"
              alt="mappi-logo"
              className="object-cover transition-transform duration-500 scale-110 hover:scale-125"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center flex-col gap-2">
          {/* Título principal */}
          <h2 className="text-3xl font-extrabold text-gray-800">
            ¡Bienvenido a <span className="text-primary">Mappi</span>!
          </h2>

          {/* Descripción */}
          <p className="text-gray-800 leading-5 max-w-xs text-base">
            Conecta con los mejores huariques y emprendedores de tu zona.  
            Elige tu rol para comenzar.
          </p>
        </div>

        {/* Botones principales */}
        <div className="flex flex-col gap-4 w-full">
          <CustomButton
            text="Soy Comensal"
            type="button"
            fullWidth
            variant="primary"
            fontSize="14px"
            icon={<FaUtensils size={22} />}
            fontWeight={400}
            onClick={() => onSelectType('comensal')}
          />

          <CustomButton
            text="Soy Emprendedor"
            type="button"
            fullWidth
            variant="primary-outline"
            fontSize="14px"
            icon={<FaStore size={22} />}
            fontWeight={400}
            onClick={() => onSelectType('vendedor')}
          />
        </div>

        <div className='w-full flex items-center justify-center gap-2 flex-col'>
          {/* Línea divisoria decorativa */}
          <div className="w-full flex items-center justify-center my-0">
            <div className="w-1/4 border-t border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">o</span>
            <div className="w-1/4 border-t border-gray-300" />
          </div>

          {/* Frase motivacional */}
          <p className="text-sm text-gray-500 italic">
            “Descubre sabores, conecta con emprendedores y vive nuevas experiencias.”
          </p>

          {/* Footer */}
          <div className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} <span className="font-medium">Mappi</span>. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default UserTypeModal
