import { FaShoppingCart } from "react-icons/fa";

const Ventas = () => {
  const ventas = [
    { id: 1, cliente: "Carlos Mendoza", producto: "Servicio de Catering", fecha: "2025-10-10", total: "S/ 250.00" },
    { id: 2, cliente: "Lucía Paredes", producto: "Menú Ejecutivo", fecha: "2025-10-12", total: "S/ 80.00" },
    { id: 3, cliente: "José Ramírez", producto: "Buffet Corporativo", fecha: "2025-10-15", total: "S/ 1,200.00" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <FaShoppingCart className="text-green-600 text-2xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mis Ventas o Solicitudes</h2>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Cliente</th>
            <th className="p-3 border-b">Producto / Servicio</th>
            <th className="p-3 border-b">Fecha</th>
            <th className="p-3 border-b text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{v.cliente}</td>
              <td className="p-3 border-b">{v.producto}</td>
              <td className="p-3 border-b">{v.fecha}</td>
              <td className="p-3 border-b text-right font-semibold">{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
