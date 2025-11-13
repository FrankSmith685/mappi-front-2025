import { FaStar } from "react-icons/fa";

const Resenas = () => {
  const resenas = [
    { id: 1, cliente: "María López", calificacion: 5, comentario: "Excelente atención y comida deliciosa." },
    { id: 2, cliente: "Pedro García", calificacion: 4, comentario: "Buen servicio, pero el envío tardó un poco." },
    { id: 3, cliente: "Sandra Vega", calificacion: 5, comentario: "Todo perfecto, muy recomendado." },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <FaStar className="text-yellow-500 text-2xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mis Reseñas</h2>
      </div>

      <div className="space-y-4">
        {resenas.map((r) => (
          <div key={r.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-800">{r.cliente}</p>
              <div className="flex text-yellow-400">
                {Array(r.calificacion)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{r.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resenas;
