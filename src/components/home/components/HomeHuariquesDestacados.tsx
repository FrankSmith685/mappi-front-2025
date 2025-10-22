import { FaStar, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { ServicioActivoDataChevere } from "../../../interfaces/IServicioPlanChevere";
import { CustomButton } from "../../ui/CustomButton";

interface Props {
  destacados?: ServicioActivoDataChevere[];
}

export const HomeHuariquesDestacados: React.FC<Props> = ({ destacados = [] }) => {
  const navigate = useNavigate();

  const handleVerMas = (servicioCod: string) => {
    if (!servicioCod) return;
    const base64Cod = btoa(servicioCod);
    const codificado = encodeURIComponent(base64Cod);
    navigate(`/servicios/${codificado}`);
  };

  const isEmpty = !destacados || destacados.length === 0;

  return (
    <section className="bg-white p-6 max-w-7xl mx-auto rounded-3xl shadow-sm mt-10">
      {/*  Título */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <FaStar className="text-primary text-3xl drop-shadow-sm" />
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Huariques <span className="text-primary">Destacados</span>
        </h2>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-gray-500 py-16">
          <FaBoxOpen className="text-6xl mb-6 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Aún no hay huariques destacados</h3>
          <p className="text-center max-w-md mb-6">
            Pronto podrás descubrir los huariques más recomendados por los usuarios.
          </p>
          <CustomButton
            text="Ver todos los huariques"
            type="button"
            variant="primary"
            fontSize="14px"
            fontWeight={400}
            onClick={() => navigate("/servicios")}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {destacados.map((h) => {
            const portada =
              h.Archivos.find((a) => a.ARCH_Tipo === "imagen")?.ARCH_Ruta ||
              "https://mappidevbucket.s3.amazonaws.com/0";

            return (
              <div
                key={h.SERV_Interno}
                onClick={() => handleVerMas(h.SERV_Interno)}
                className="group bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden cursor-pointer hover:-translate-y-2"
              >
                {/* Imagen */}
                <div className="relative">
                  <img
                    src={portada}
                    alt={h.SERV_Nombre}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                    ⭐ Destacado
                  </div>
                </div>

                {/* Información */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition">
                    {h.SERV_Nombre}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {h.SERV_Descripcion || "Sin descripción disponible"}
                  </p>

                  <div className="flex items-center gap-1 text-primary mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
