import { FaPhoneAlt, FaEnvelope, FaUserCircle } from "react-icons/fa";

const Contactos = () => {
  // Ejemplo de contactos mock
  const contactos = [
    {
      id: 1,
      nombre: "Cevichería El Huarique",
      telefono: "+51 999 888 777",
      email: "contacto@huarique.com",
    },
    {
      id: 2,
      nombre: "Pollería Don Pollo",
      telefono: "+51 988 777 666",
      email: "ventas@donpollo.pe",
    },
    {
      id: 3,
      nombre: "Restobar La Esquina",
      telefono: "+51 977 111 222",
      email: "info@laesquina.pe",
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Mis Contactos</h3>
      <div className="grid gap-4">
        {contactos.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl text-gray-500" />
              <div>
                <h4 className="text-lg font-semibold">{c.nombre}</h4>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <FaPhoneAlt /> {c.telefono}
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <FaEnvelope /> {c.email}
                </div>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contactos;
