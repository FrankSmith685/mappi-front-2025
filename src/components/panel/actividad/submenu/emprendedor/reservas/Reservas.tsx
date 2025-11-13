import { FaCalendarAlt } from "react-icons/fa";

const Reservas = () => {
  const reservas = [
    { id: 1, cliente: "María López", fecha: "2025-11-05", hora: "12:30 PM", servicio: "Reserva de mesa para 4" },
    { id: 2, cliente: "Pedro García", fecha: "2025-11-08", hora: "08:00 PM", servicio: "Evento privado" },
    { id: 3, cliente: "Ana Torres", fecha: "2025-11-12", hora: "01:00 PM", servicio: "Catering empresarial" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <FaCalendarAlt className="text-purple-600 text-2xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mi Historial de Reservas o Pedidos</h2>
      </div>

      <div className="divide-y border rounded-lg">
        {reservas.map((r) => (
          <div key={r.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-gray-800">{r.cliente}</p>
              <p className="text-sm text-gray-600">{r.fecha} - {r.hora}</p>
            </div>
            <p className="text-gray-600 text-sm">{r.servicio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
