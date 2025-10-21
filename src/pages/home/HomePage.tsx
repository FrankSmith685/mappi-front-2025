import { useState } from "react";
import { 
  FaSearch, 
  FaFish, 
  FaCoffee, 
  FaDrumstickBite, 
  FaUtensils 
} from "react-icons/fa";
import { HomeLeft } from "../../components/home/HomeLeft";

export default function HomePage() {
  const [search, setSearch] = useState("");

  // 🔹 Data temporal
  const categorias = [
    { nombre: "Mariscos", icon: <FaFish /> },
    { nombre: "Cafeterías", icon: <FaCoffee /> },
    { nombre: "Parrillas", icon: <FaDrumstickBite /> },
    { nombre: "Criolla", icon: <FaUtensils /> },
  ];

  const huariquesPremium = [
    { id: 1, nombre: "Huarique Premium 1", desc: "Comida marina top" },
    { id: 2, nombre: "Huarique Premium 2", desc: "Anticuchos legendarios" },
  ];

  const huariques = [
    { id: 1, nombre: "Huarique 1", desc: "Ceviche clásico" },
    { id: 2, nombre: "Huarique 2", desc: "Café artesanal" },
    { id: 3, nombre: "Huarique 3", desc: "Parrilla criolla" },
    { id: 4, nombre: "Huarique 4", desc: "Comida rápida casera" },
    { id: 5, nombre: "Huarique 5", desc: "Chifa de barrio" },
    { id: 6, nombre: "Huarique 6", desc: "Sanguchería local" },
  ];

  const destacados = [
    { id: 1, nombre: "La Picantería", desc: "Platos criollos espectaculares", img: "/img/picanteria.jpg", rating: 4.8 },
    { id: 2, nombre: "Cevichería Don Paco", desc: "Ceviche fresco y contundente", img: "/img/cevicheria.jpg", rating: 4.7 },
    { id: 3, nombre: "Anticuchos La Tía", desc: "Los mejores anticuchos de la ciudad", img: "/img/anticuchos.jpg", rating: 4.6 },
  ];

  const opiniones = [
    { id: 1, nombre: "Carlos", texto: "El ceviche de Don Paco es el mejor que he probado en años. 10/10" },
    { id: 2, nombre: "Lucía", texto: "Me encantó el café artesanal, el ambiente súper acogedor." },
    { id: 3, nombre: "Pedro", texto: "La picantería me recordó a la comida de mi abuela, delicioso." },
  ];

  return (
    <div className="w-full responsive-padding bg-gray-100">
      <HomeLeft/>
      <div className="w-full lg:pl-[350px] h-full repos">
        
        {/* 🔹 Hero con buscador */}
        <section className="bg-gradient-to-r from-rose-500 to-orange-400 text-white py-20 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Descubre los mejores huariques</h1>
          <p className="mb-6">Encuentra comida auténtica cerca de ti</p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Buscar huariques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 p-3 rounded-l-xl text-gray-800"
            />
            <button className="bg-yellow-400 p-3 rounded-r-xl">
              <FaSearch className="text-gray-800" />
            </button>
          </div>
        </section>

        {/* 🔹 Categorías */}
        <section className="py-10 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Explora por categoría</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {categorias.map((cat, i) => (
              <div
                key={i}
                className="bg-white shadow rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-3xl text-orange-500">{cat.icon}</div>
                <span className="font-medium">{cat.nombre}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 Huariques Premium */}
        <section className="bg-gray-100 py-10 px-6">
          <h2 className="text-2xl font-semibold mb-6">Huariques Premium</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {huariquesPremium.map((h) => (
              <div key={h.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold">{h.nombre}</h3>
                <p className="text-gray-600">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 6 primeros Huariques */}
        <section className="py-10 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Descubre nuevos huariques</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {huariques.map((h) => (
              <div key={h.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-lg font-bold">{h.nombre}</h3>
                <p className="text-gray-600">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 Huariques Destacados */}
        <section className="bg-white py-10 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Huariques Destacados</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {destacados.map((h) => (
              <div key={h.id} className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img src={h.img} alt={h.nombre} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{h.nombre}</h3>
                  <p className="text-gray-600">{h.desc}</p>
                  <p className="text-yellow-500 mt-2">⭐ {h.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 Opiniones */}
        <section className="bg-gradient-to-r from-orange-400 to-rose-500 text-white py-16 px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Lo que dicen los comensales</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {opiniones.map((op) => (
              <div key={op.id} className="bg-white/10 p-6 rounded-xl shadow-md">
                <p className="italic">“{op.texto}”</p>
                <p className="mt-4 font-semibold">- {op.nombre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔹 CTA para publicar huariques */}
        <section className="bg-yellow-400 py-14 px-6 text-center rounded-xl max-w-5xl mx-auto my-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Tienes un huarique?</h2>
          <p className="text-gray-800 mb-6">Únete a nuestra comunidad y haz que todos descubran tu sazón única.</p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
            Publica tu Huarique
          </button>
        </section>

      </div>
    </div>
  );
}
