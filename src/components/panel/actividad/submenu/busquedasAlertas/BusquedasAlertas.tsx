import { FaSearch, FaBell, FaTrashAlt } from "react-icons/fa";

const BusquedasAlertas = () => {
  // Datos mock de búsquedas y alertas
  const busquedas = [
    {
      id: 1,
      nombre: "Cevicherías en Miraflores",
      fecha: "20/08/2025",
    },
    {
      id: 2,
      nombre: "Pollerías en San Miguel",
      fecha: "18/08/2025",
    },
  ];

  const alertas = [
    {
      id: 1,
      nombre: "Avisar cuando haya nuevos huariques de Sushi en Lima Centro",
      activa: true,
    },
    {
      id: 2,
      nombre: "Alertarme de promociones en Barranco",
      activa: false,
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Mis Búsquedas y Alertas</h3>

      {/* Búsquedas guardadas */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">🔎 Búsquedas guardadas</h4>
        {busquedas.length === 0 ? (
          <p className="text-gray-500">No tienes búsquedas guardadas.</p>
        ) : (
          <div className="space-y-3">
            {busquedas.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
              >
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <FaSearch className="text-gray-600" /> {b.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Guardado el {b.fecha}
                  </p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alertas */}
      <div>
        <h4 className="text-lg font-semibold mb-2">🔔 Mis alertas</h4>
        {alertas.length === 0 ? (
          <p className="text-gray-500">No tienes alertas configuradas.</p>
        ) : (
          <div className="space-y-3">
            {alertas.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
              >
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <FaBell className={a.activa ? "text-green-500" : "text-gray-400"} />
                    {a.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estado:{" "}
                    <span
                      className={a.activa ? "text-green-600 font-medium" : "text-gray-500"}
                    >
                      {a.activa ? "Activa" : "Inactiva"}
                    </span>
                  </p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedasAlertas;
