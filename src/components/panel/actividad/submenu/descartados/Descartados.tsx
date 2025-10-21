import { FaMapMarkerAlt, FaTrashRestoreAlt, FaBan } from "react-icons/fa";

const Descartados = () => {
  // Datos mock de huariques descartados
  const descartados = [
    {
      id: 1,
      nombre: "Chifa Dragon Feliz",
      direccion: "Av. Universitaria 345, Lima",
      motivo: "No me interesa",
      img: "https://source.unsplash.com/400x250/?chinese-food,restaurant",
    },
    {
      id: 2,
      nombre: "Sanguchería El Tío",
      direccion: "Jr. Pizarro 234, Lima",
      motivo: "Muy lejos de mi zona",
      img: "https://source.unsplash.com/400x250/?sandwich,food",
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Mis Descartes</h3>

      {descartados.length === 0 ? (
        <p className="text-gray-500">No tienes huariques descartados.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {descartados.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              <img
                src={item.img}
                alt={item.nombre}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{item.nombre}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt /> {item.direccion}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Motivo: {item.motivo}
                </p>
                <div className="flex justify-between mt-4">
                  <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                    <FaTrashRestoreAlt /> Restaurar
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                    <FaBan /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Descartados;
