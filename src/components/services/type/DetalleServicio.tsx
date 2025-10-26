/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface DetalleServicioProps {
  servicio: any;
}

const DetalleServicio = ({ servicio }: DetalleServicioProps) => {
  const portada =
    servicio.archivos?.find((a: any) => a.tipo === "portada")?.ruta ||
    servicio.archivos?.find((a: any) => a.tipo === "logo")?.ruta ||
    "https://cdn-icons-png.flaticon.com/512/684/684908.png";

  const imagenes = servicio.archivos?.filter((a: any) => a.tipo === "imagen") || [];

  return (
    <div>
      <img
        src={portada}
        alt={servicio.nombre}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{servicio.nombre}</h2>
      <p className="text-gray-500 mb-1">{servicio.subcategoria?.nombre}</p>
      <p className="text-gray-600 text-sm mb-2">{servicio.direccion?.direccion}</p>
      <p className="text-xs text-gray-500 mb-4">
        Publicado {dayjs(servicio.fechaRegistro).fromNow()}
      </p>

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {imagenes.slice(0, 6).map((img: any, i: number) => (
            <img
              key={i}
              src={img.ruta}
              alt={`Imagen ${i + 1}`}
              className="w-full h-24 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      <button
        onClick={() => {
          const encoded = btoa(servicio.cod_servicio);
          window.location.href = `/servicios/${encoded}`;
        }}
        className="w-full bg-primary hover:bg-[#e35c3d] text-white py-2 rounded-lg transition-all duration-300"
      >
        Ver más detalles
      </button>
    </div>
  );
};

export default DetalleServicio;
