import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const Favoritos = () => {
  // Ejemplo de huariques favoritos mock
  const favoritos = [
    {
      id: 1,
      nombre: "Cevichería El Huarique",
      direccion: "Av. Perú 1234, Lima",
      rating: 4.7,
      tipo: "Mariscos",
      img: "https://source.unsplash.com/400x250/?ceviche,food",
    },
    {
      id: 2,
      nombre: "Pollería Don Pollo",
      direccion: "Jr. Las Flores 456, Lima",
      rating: 4.3,
      tipo: "Pollos a la brasa",
      img: "https://source.unsplash.com/400x250/?pollo,restaurant",
    },
    {
      id: 3,
      nombre: "Restobar La Esquina",
      direccion: "Calle Central 789, Lima",
      rating: 4.5,
      tipo: "Fusión",
      img: "https://source.unsplash.com/400x250/?bar,restaurant",
    },
  ];

  return (
    <div>
      {/* <h3 className="text-xl font-bold mb-4">Mis Favoritos</h3> */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritos.map((fav) => (
          <div
            key={fav.id}
            className="border rounded-lg shadow-md overflow-hidden bg-white"
          >
            <img
              src={fav.img}
              alt={fav.nombre}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold">{fav.nombre}</h4>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt /> {fav.direccion}
              </p>
              <p className="text-sm text-gray-600">🍴 {fav.tipo}</p>
              <div className="flex items-center gap-1 mt-2 text-yellow-500">
                <FaStar /> <span>{fav.rating}</span>
              </div>
              <div className="flex justify-between mt-4">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Ver en mapa
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                  <FaHeart /> Quitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favoritos;
