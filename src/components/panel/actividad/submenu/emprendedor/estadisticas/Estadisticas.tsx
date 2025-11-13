import { FaChartLine } from "react-icons/fa";

const Estadisticas = () => {
  const estadisticas = [
    { titulo: "Ventas del mes", valor: "42", descripcion: "Pedidos confirmados" },
    { titulo: "Ingresos", valor: "S/ 3,540", descripcion: "Monto total generado" },
    { titulo: "Clientes nuevos", valor: "12", descripcion: "Registrados en el mes" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <FaChartLine className="text-blue-500 text-2xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mis Estadísticas o Analíticas</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {estadisticas.map((e, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition">
            <p className="text-lg font-semibold text-gray-800">{e.valor}</p>
            <p className="text-sm text-gray-600">{e.titulo}</p>
            <p className="text-xs text-gray-500 mt-1">{e.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Estadisticas;
