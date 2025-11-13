/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from "react";
import { useAppState } from "../../../hooks/useAppState";
import {
  FaUtensils,
  FaIceCream,
  FaGlassCheers,
  FaHamburger,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const subcategoriaMap: Record<string, string> = {
  "Subcategoría de Comida al paso":
    "https://mappidevbucket.s3.amazonaws.com/mapp_293",
  "Subcategoría de Restaurantes":
    "https://mappidevbucket.s3.amazonaws.com/mapp_299",
  "Subcategoría de Postres y café":
    "https://mappidevbucket.s3.amazonaws.com/mapp_295",
  "Subcategoría de Bar":
    "https://mappidevbucket.s3.amazonaws.com/mapp_300",
};

//  Íconos por categoría
const iconMap: Record<string, JSX.Element> = {
  bar: <FaGlassCheers className="text-4xl text-primary drop-shadow-md" />,
  restaurantes: <FaUtensils className="text-4xl text-primary drop-shadow-md" />,
  "comida al paso": <FaHamburger className="text-4xl text-primary drop-shadow-md" />,
  "postres y café": <FaIceCream className="text-4xl text-primary drop-shadow-md" />,
};

export const HomeCategorias: React.FC = () => {
  const { categoria, setCategoriaSeleccionada  } = useAppState();
  const navigate = useNavigate();

    const handleCategoriaClick = (cat: any) => {
    // Guarda el ID (numérico o string)
    setCategoriaSeleccionada(cat.CATE_Id.toString());
    navigate("/servicios");
    };


  if (!categoria || categoria.length === 0) {
    return (
      <section className="py-10 px-6 text-center bg-gray-50">
        <p className="text-gray-500">No hay categorías disponibles.</p>
      </section>
    );
  }

  const ordenDeseado = ["restaurantes", "comida al paso", "postres y café", "bar"];

const categoriasFiltradas = categoria
  .filter((cat: any) =>
    ordenDeseado.includes(cat.CATE_Nombre.toLowerCase())
  )
  .sort(
    (a: any, b: any) =>
      ordenDeseado.indexOf(a.CATE_Nombre.toLowerCase()) -
      ordenDeseado.indexOf(b.CATE_Nombre.toLowerCase())
  );


  const gradientColors = [
    "from-orange-100 to-amber-200",
    "from-pink-100 to-rose-200",
    "from-blue-100 to-sky-200",
    "from-green-100 to-emerald-200",
  ];

  return (
    <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-gray-800 mb-12 tracking-tight">
          Sabores para todos los gustos
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-4">
          {categoriasFiltradas.map((cat: any, index: number) => {
            const nombre = cat.CATE_Nombre.toLowerCase();
            const subcategoria = cat.Subcategorias?.find((sub: any) =>
              Object.keys(subcategoriaMap).includes(sub.SUBC_Descripcion)
            );
            const imagenSrc =
              subcategoriaMap[subcategoria?.SUBC_Descripcion] ||
              "https://mappidevbucket.s3.amazonaws.com/mapp_default";

            return (
              <div
                key={cat.CATE_Id}
                onClick={() => handleCategoriaClick(cat)}
                className={`relative bg-gradient-to-tr ${gradientColors[index % gradientColors.length]} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group`}
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-48 md:h-56 p-6 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
                    <img
                      src={imagenSrc}
                      alt={cat.CATE_Nombre}
                      className="object-contain w-14 h-14"
                    />
                  </div>

                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                    {iconMap[nombre]}
                  </div>

                  <h3 className="font-semibold text-gray-800 text-lg md:text-xl group-hover:text-primary transition-colors">
                    {cat.CATE_Nombre}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Descubre los mejores lugares
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
