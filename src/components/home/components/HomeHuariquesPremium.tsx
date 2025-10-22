import { FaCrown, FaStar, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { ServicioActivoDataPremium } from "../../../interfaces/IServicioPremium";
import { CustomButton } from "../../ui/CustomButton";

interface Props {
  huariques?: ServicioActivoDataPremium[];
}

export const HomeHuariquesPremium: React.FC<Props> = ({ huariques = [] }) => {
  const navigate = useNavigate();

  const handleVerMas = (servicioCod: string) => {
    if (!servicioCod) return;
    const base64Cod = btoa(servicioCod);
    const codificado = encodeURIComponent(base64Cod);
    navigate(`/servicios/${codificado}`);
  };

  const isEmpty = !huariques || huariques.length === 0;

  return (
    <section className="p-6 bg-primary/10">
      <div className="w-full mx-auto px-0 text-center">
        {/*  Título */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <FaCrown className="text-primary text-3xl drop-shadow-sm" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Huariques <span className="text-primary">Premium</span>
          </h2>
        </div>

        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Sabores auténticos con un toque de excelencia. Descubre los lugares más destacados de la ciudad.
        </p>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-16">
            <FaBoxOpen className="text-6xl mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold mb-3">
              ¡Aún no hay huariques premium!
            </h3>
            <p className="text-center max-w-md mb-6">
              Pronto podrás descubrir los huariques más exclusivos de la ciudad. Sé de los primeros en destacarse.
            </p>
            <CustomButton
              text="Descubre los planes premium"
              type="button"
              variant="primary"
              fontSize="14px"
              fontWeight={400}
              onClick={() => navigate("/servicios")}
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {huariques.map((h) => {
              const primeraImagen =
                h.Archivos.find((a) => a.ARCH_Tipo === "imagen")?.ARCH_Ruta ||
                "https://mappidevbucket.s3.amazonaws.com/0";

              return (
                <div
                  key={h.SERV_Interno}
                  onClick={() => handleVerMas(h.SERV_Interno)}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                >
                  {/* Imagen */}
                  <div className="relative">
                    <img
                      src={primeraImagen}
                      alt={h.SERV_Nombre}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all"></div>
                    <div className="absolute top-3 left-3 bg-primary text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md text-sm">
                      <FaCrown className="text-sm" /> Premium
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {h.SERV_Nombre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {h.SERV_Descripcion || "Sin descripción disponible"}
                    </p>
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
