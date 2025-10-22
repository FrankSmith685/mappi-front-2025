export function getSubcategoriaImage(
  subcategoria?: { cod_subcategoria?: number; descripcion?: string | null } | null
): string {
  const baseUrl = "https://mappidevbucket.s3.us-east-1.amazonaws.com/";
  const defaultPinUrl = "https://cdn-icons-png.flaticon.com/512/684/684908.png"; // ✅ pin externo por defecto para "Otros"

  if (!subcategoria || !subcategoria.cod_subcategoria || !subcategoria.descripcion) {
    return defaultPinUrl; // si no viene nada, ponemos el pin genérico
  }

  //  Subcategorías específicas con icono propio
  const subcategoriaMap: Record<number, string> = {
    1: "mapp_300", // Licorería
    2: "mapp_301", // Restobar
    7: "mapp_292", // Chancho al palo
    29: "mapp_297", // Pollería
    21: "mapp_296", // Cevichería
    22: "mapp_298", // Chifa
    19: "mapp_294", // Panadería
  };

  // cambiar de imagen aquellos q se ah seleccionado
  // Restobar => mapp_641
  // polleria => mapp_640
  // panaderia => mapp_639
  // licoreria => mapp_638
  // chifa => mapp_637
  // Chancho al palo => mapp_636
  // Cevicheria => mapp_635
  
  // icono de categoria
  // Restaurante => mapp_634
  // Postres y café => mapp_634
  // Comida al paso => mapp_632


  //  Fallback por categoría general
  const categoriaGeneralMap: Record<string, string> = {
    "Subcategoría de Comida al paso": "mapp_293",
    "Subcategoría de Restaurantes": "mapp_299",
    "Subcategoría de Postres y café": "mapp_295",
    "Subcategoría de Bar": "mapp_300", 
    "Subcategoría de Otros": "pin_default", //  marcador especial
    "Subcategoría de Reseñas": "mapp_293",
  };

  // 1️⃣ Verificar si el ID tiene icono propio
  if (subcategoriaMap[subcategoria.cod_subcategoria]) {
    return baseUrl + subcategoriaMap[subcategoria.cod_subcategoria];
  }

  // 2️⃣ Verificar por categoría general
  if (subcategoria.descripcion && categoriaGeneralMap[subcategoria.descripcion]) {
    // Caso especial para "Otros"
    if (categoriaGeneralMap[subcategoria.descripcion] === "pin_default") {
      return defaultPinUrl;
    }
    return baseUrl + categoriaGeneralMap[subcategoria.descripcion];
  }

  // 3️⃣ Fallback final
  return defaultPinUrl;
}


export function getSelectedSubcategoriaImage(
  subcategoria?: { cod_subcategoria?: number; descripcion?: string | null } | null
): string {
  const baseUrl = "https://mappidevbucket.s3.us-east-1.amazonaws.com/";

  if (!subcategoria || !subcategoria.cod_subcategoria) return baseUrl + "mapp_634"; // genérico

  const selectedMap: Record<number, string> = {
    1: "mapp_638", // Licorería seleccionada
    2: "mapp_641", // Restobar
    7: "mapp_636", // Chancho al palo
    29: "mapp_640", // Pollería
    21: "mapp_635", // Cevichería
    22: "mapp_637", // Chifa
    19: "mapp_639", // Panadería
  };

  // fallback por categoría general
  const categoriaMap: Record<string, string> = {
    "Subcategoría de Restaurantes": "mapp_634",
    "Subcategoría de Postres y café": "mapp_634",
    "Subcategoría de Comida al paso": "mapp_632",
  };

  if (selectedMap[subcategoria.cod_subcategoria]) {
    return baseUrl + selectedMap[subcategoria.cod_subcategoria];
  }

  if (subcategoria.descripcion && categoriaMap[subcategoria.descripcion]) {
    return baseUrl + categoriaMap[subcategoria.descripcion];
  }

  return baseUrl + "mapp_634";
}
