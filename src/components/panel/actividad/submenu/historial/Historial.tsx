import { FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Historial = () => {
  // Datos mock del historial
  const historial = [
    {
      id: 1,
      nombre: "Cevichería El Huarique",
      direccion: "Av. Perú 1234, Lima",
      rating: 4.7,
      fecha: "25/08/2025",
      img: "https://source.unsplash.com/400x250/?ceviche,food",
    },
    {
      id: 2,
      nombre: "Pollería Don Pollo",
      direccion: "Jr. Las Flores 456, Lima",
      rating: 4.3,
      fecha: "20/08/2025",
      img: "https://source.unsplash.com/400x250/?pollo,restaurant",
    },
    {
      id: 3,
      nombre: "Restobar La Esquina",
      direccion: "Calle Central 789, Lima",
      rating: 4.5,
      fecha: "15/08/2025",
      img: "https://source.unsplash.com/400x250/?bar,restaurant",
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Mi Historial</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {historial.map((item) => (
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
              <div className="flex items-center gap-1 mt-2 text-yellow-500">
                <FaStar /> <span>{item.rating}</span>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <FaClock /> Visitado el {item.fecha}
              </p>
              <div className="mt-4">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Ver en mapa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
