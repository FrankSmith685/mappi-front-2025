import { FaBars, FaTimes } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

 const CuentaSectionLayout = ({
  title,
  subTitle,
  children,
  menuOpenUser,
  onToggleSidebar,
  handleClickAtras
}: {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  menuOpenUser: boolean;
  onToggleSidebar: () => void;
  handleClickAtras?: ()=> void;
}) => (
  <div className="w-full">
    <div className="flex items-center justify-start gap-4 mb-4">
      <button
        className="md:hidden p-2 bg-gray-800 text-white rounded-lg"
        onClick={onToggleSidebar}
      >
        {menuOpenUser ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>
      <div className="flex justify-between items-center w-full">
        <div className="w-full flex flex-row gap-4">
          <h3 className="text-gray-800 text-xl font-bold">{title}</h3>
          <p className="text-sm flex items-center justify-center text-primary">{subTitle}</p>
        </div>
        {handleClickAtras && (
          <div className="w-auto">
            <button
              type="button"
              onClick={handleClickAtras}
              className="flex items-center gap-1 text-sm text-secondary text-secondary-hover hover:cursor-pointer"
            >
              <FiArrowLeft className="text-lg" />
              Atrás
            </button>
          </div>
        )}
      </div>
    </div>
    {children}
  </div>
);

export default CuentaSectionLayout;