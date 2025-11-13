import { FaUserFriends } from "react-icons/fa";

const Clientes = () => {
  const clientes = [
    { id: 1, nombre: "Carlos Mendoza", email: "carlosm@gmail.com", fecha: "2025-09-22" },
    { id: 2, nombre: "Lucía Paredes", email: "luciaparedes@gmail.com", fecha: "2025-09-25" },
    { id: 3, nombre: "José Ramírez", email: "jramirez@hotmail.com", fecha: "2025-10-03" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <FaUserFriends className="text-primary text-2xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mis Clientes o Contactos</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((c) => (
          <div key={c.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <p className="font-semibold text-gray-800">{c.nombre}</p>
            <p className="text-sm text-gray-600">{c.email}</p>
            <p className="text-xs text-gray-500 mt-2">Cliente desde: {c.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clientes;
