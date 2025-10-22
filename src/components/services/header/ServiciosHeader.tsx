/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaFilter, FaTimesCircle } from "react-icons/fa";
import { CustomInput } from "../../ui/CustomInput";
import { CustomSelected } from "../../ui/CustomSelected";
import { useUbigeo } from "../../../hooks/useUbigeo";
import { useCategoria } from "../../../hooks/useCategoria.";
import { useLocation } from "../../../hooks/useLocationHooks/useLocation";
import { useSearchParams } from "react-router-dom";
import { useAppState } from "../../../hooks/useAppState";
import { filterByDistance } from "../../../helpers/filterByDistance";
import ModalSinServicios from "../components/ModalSinServicios";

const ServiciosHeader = () => {
  const [search, setSearch] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoria, setSubcategoria] = useState("");

  const [ciudades, setCiudades] = useState<{ value: string; label: string }[]>([]);
  const [categorias, setCategorias] = useState<{ value: string; label: string }[]>([]);
  const [subcategorias, setSubcategorias] = useState<{ value: string; label: string }[]>([]);
  
  const [showNoServicesModal, setShowNoServicesModal] = useState(false);
  const [fallbackData, setFallbackData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<"nearby" | "department" | "all">("nearby");
  const [rawDepartamentos, setRawDepartamentos] = useState<any[]>([]);

  const { departamento, lat, lng } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { serviciosActivos, setServiciosFilterActivos, setiIsShowFilterService, isShowFilterService, setServicioSeleccionado, setIsExpanded, isExpanded, categoriaSeleccionada   } = useAppState();
  const { getDepartamentosActivos } = useUbigeo();
  const {
    getCategoriasActivasPorDepartamento,
    getSubcategoriasActivasPorDepartamentoYCategoria,
  } = useCategoria();

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
  if (categoriaSeleccionada) {
    setCategoria(categoriaSeleccionada);
  }
}, [categoriaSeleccionada]);

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsVisible(entry.isIntersecting);
    },
    { threshold: 0.2 } // se considera "visible" si el 20% del filtro está en pantalla
  );

  if (headerRef.current) {
    observer.observe(headerRef.current);
  }

  return () => {
    if (headerRef.current) observer.unobserve(headerRef.current);
  };
}, []);


  //  Cargar departamentos
  useEffect(() => {
    getDepartamentosActivos((data) => {
      setRawDepartamentos(data || []);
      const options = (data || []).map((dep) => ({
        value: dep.codigo_ubigeo,
        label: `${dep.departamento} (${dep.total_servicios})`,
      }));
      setCiudades(options);
    });
  }, []);

  //  Decodificar "d" de URL si existe
  useEffect(() => {
    const encodedD = searchParams.get("d");
    if (encodedD && !ciudad) {
      try {
        const decoded = atob(encodedD);
        setCiudad(decoded);
      } catch (err) {
        console.error("Error al decodificar parámetro d:", err);
      }
    }
  }, [searchParams, ciudad]);

  //  Detectar ubicación automática
  useEffect(() => {
    if (!departamento || rawDepartamentos.length === 0 || ciudad) return;
    const found = rawDepartamentos.find(
      (d) => String(d.departamento).toLowerCase() === String(departamento).toLowerCase()
    );
    const match = found || rawDepartamentos.find((d) =>
      String(d.departamento).toLowerCase().includes(String(departamento).toLowerCase())
    );
    if (match) setCiudad(match.codigo_ubigeo);
  }, [departamento, rawDepartamentos]);

  //  Actualizar URL cuando cambia ciudad
  //  Actualizar URL cuando cambia ciudad
  useEffect(() => {
  // Solo actualizar parámetros si estamos en la ruta /servicios exacta
  if (!location.pathname.startsWith("/servicios")) return;

  const mode = searchParams.get("m");
  if (!mode || !ciudad) return;

  const encodedCiudad = btoa(ciudad);
  const currentParams = Object.fromEntries(searchParams.entries());

  if (currentParams.d !== encodedCiudad) {
    setSearchParams({ ...currentParams, d: encodedCiudad });
  }
}, [ciudad, searchParams, location]);


  //  Cargar categorías al cambiar ciudad
  useEffect(() => {
    if (!ciudad) {
      setCategorias([]);
      setCategoria("");
      setSubcategorias([]);
      setSubcategoria("");
      return;
    }

    // Si ya tenemos una categoría seleccionada global, no la borres
    const shouldReset = !categoriaSeleccionada;

    if (shouldReset) {
      setCategoria("");
      setSubcategoria("");
      setSubcategorias([]);
    }

    getCategoriasActivasPorDepartamento(ciudad, (data) => {
      setCategorias(data);
    });

    const mode = searchParams.get("m");
    if (mode && ciudad) {
      const encodedCiudad = btoa(ciudad);
      const currentParams = Object.fromEntries(searchParams.entries());
      setSearchParams({ ...currentParams, d: encodedCiudad });
    }
  }, [ciudad]);

  useEffect(() => {
  if (categoriaSeleccionada && categorias.length > 0) {
    const existe = categorias.find(c => String(c.value) === categoriaSeleccionada);
    if (existe) setCategoria(categoriaSeleccionada);
  }
}, [categorias, categoriaSeleccionada]);



  //  Subcategorías dependientes
  useEffect(() => {
    if (!ciudad || !categoria) {
      setSubcategorias([]);
      setSubcategoria("");
      return;
    }
    setSubcategoria("");
    getSubcategoriasActivasPorDepartamentoYCategoria(ciudad, Number(categoria), (data) => {
      setSubcategorias(data || []);
    });
  }, [categoria, ciudad]);

  //  Buscador
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setServicioSeleccionado(null);
  }, [ciudad, categoria, subcategoria, search]);

useEffect(() => {
  if (!serviciosActivos || serviciosActivos.length === 0) return;

  let filtered = [...serviciosActivos];
  let nearby: any[] = [];

  //  1️⃣ Filtrar por distancia solo si hay coordenadas
  if (lat && lng) {
    nearby = filterByDistance(serviciosActivos, lat, lng, 5);
  }

  //  2️⃣ Decidir qué mostrar
  if (nearby.length > 0) {
    // Si hay cercanos → mostrar solo esos
    filtered = nearby.filter((srv) => {
      if (!ciudad) return true;
      const depCode = String(srv.direccion?.codigo_ubigeo ?? "").slice(0, 2);
      return depCode === ciudad.slice(0, 2); // solo dentro del departamento actual
    });
  } else if (ciudad) {
    // Si no hay cercanos → mostrar los del departamento
    const selectedDepCode = ciudad.slice(0, 2);
    filtered = serviciosActivos.filter((srv) =>
      String(srv.direccion?.codigo_ubigeo ?? "").startsWith(selectedDepCode)
    );
  }

  //  3️⃣ Aplicar filtros adicionales
  if (categoria) {
    const categoriaLower = categoria.toLowerCase();
    filtered = filtered.filter((srv) => {
      const catId = String(srv.subcategoria?.categoria?.cod_categoria ?? "");
      const catName = String(srv.subcategoria?.categoria?.nombre ?? "").toLowerCase();
      return catId === categoria || catName.includes(categoriaLower);
    });
  }

  if (subcategoria) {
    const subcatLower = subcategoria.toLowerCase();
    filtered = filtered.filter((srv) => {
      const subcatId = String(srv.subcategoria?.cod_subcategoria ?? "");
      const subcatName = String(srv.subcategoria?.nombre ?? "").toLowerCase();
      return subcatId === subcategoria || subcatName.includes(subcatLower);
    });
  }

  if (search.trim() !== "") {
    const text = search.toLowerCase();
    filtered = filtered.filter((srv) =>
      (srv.nombre ?? "").toLowerCase().includes(text) ||
      (srv.descripcion ?? "").toLowerCase().includes(text) ||
      (srv.direccion?.direccion ?? "").toLowerCase().includes(text)
    );
  }

  //  4️⃣ Mostrar modal si no hay resultados
  //  4️⃣ Mostrar modal si no hay resultados
if (filtered.length === 0) {
  let fallback: any[] = [];
  let newModalType: "nearby" | "department" | "all" = "all";

  // 1️⃣ Si hay servicios cercanos (solo dentro del mismo departamento)
  if (nearby.length > 0) {
    const depCode = ciudad?.slice(0, 2) ?? "";
    const nearbySameDep = nearby.filter(
      (srv) => String(srv.direccion?.codigo_ubigeo ?? "").startsWith(depCode)
    );

    if (nearbySameDep.length > 0) {
      fallback = nearbySameDep;
      newModalType = "nearby";
    }
  }

  // 2️⃣ Si no hay cercanos válidos, intentamos buscar en el departamento
  if (fallback.length === 0 && ciudad) {
    const depCode = ciudad.slice(0, 2);
    const sameDep = serviciosActivos.filter((srv) =>
      String(srv.direccion?.codigo_ubigeo ?? "").startsWith(depCode)
    );

    if (sameDep.length > 0) {
      fallback = sameDep;
      newModalType = "department";
    }
  }

  // 3️⃣ Si no hay ni cercanos ni del departamento → mostrar todos (all)
  if (fallback.length === 0) {
    fallback = serviciosActivos;
    newModalType = "all";
  }

  setFallbackData(fallback);
  setModalType(newModalType);
  setShowNoServicesModal(true);
} else {
  setShowNoServicesModal(false);
}



  setServiciosFilterActivos(filtered);
}, [ciudad, categoria, subcategoria, search, serviciosActivos, lat, lng, rawDepartamentos]);



  const handleClearFilters = () => {
    setCiudad("");
    setCategoria("");
    setSubcategoria("");
    setSearch("");
    setSubcategorias([]);
    setCategorias([]);
    setServiciosFilterActivos(serviciosActivos);
    setShowNoServicesModal(false);
    setFallbackData([]);
    setModalType("nearby");
    setServicioSeleccionado(null);
  };
  

  return (
    <>
      {/*  Toggle global (funciona en móvil y escritorio) */}
      <div
        ref={headerRef}
        className={`w-full bg-primary p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          !isExpanded ? "animate-pulse" : ""
        }`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          setiIsShowFilterService(!isShowFilterService);
          if(!isExpanded){
            setServicioSeleccionado(null);
          }
        }}
      >
        <div className="flex items-center gap-2 text-white font-semibold">
          {isExpanded ? (
            <>
              <span>Ocultar filtros</span>
              <FaChevronUp className="text-sm" />
            </>
          ) : (
            <>
              <span>Mostrar filtros</span>
              <FaChevronDown className="text-sm animate-bounce" />
            </>
          )}
        </div>
        <div
          className={`mt-2 bg-white w-[180px] h-[6px] rounded-full transition-transform duration-300 ${
            isExpanded ? "scale-100" : "scale-90"
          }`}
        ></div>
      </div>

      {/*  Contenedor animado */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-br from-[#f9fafb] to-[#eef9f6] border-b-2 border-primary shadow-lg p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Filtros de búsqueda</h2>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-all"
            >
              <FaTimesCircle />
              Limpiar filtros
            </button>
          </div>

          {/* Contenido */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 font-medium">Ciudad</label>
              <CustomSelected
                value={ciudad}
                onChange={(e) => setCiudad(String(e.target.value))}
                options={ciudades}
                placeholder="Selecciona una ciudad"
                fullWidth
                size="md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 font-medium">Categoría</label>
              <CustomSelected
                value={categoria}
                onChange={(e) => {
                  const newCat = String(e.target.value);
                  setCategoria(newCat);
                  setSubcategoria("");
                  setSubcategorias([]);
                }}
                options={categorias}
                placeholder={ciudad ? "Selecciona una categoría" : "Selecciona una ciudad primero"}
                disabled={!ciudad}
                fullWidth
                size="md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 font-medium">Subcategoría</label>
              <CustomSelected
                value={subcategoria}
                onChange={(e) => setSubcategoria(String(e.target.value))}
                options={subcategorias}
                placeholder={
                  categoria ? "Selecciona una subcategoría" : "Selecciona una categoría primero"
                }
                disabled={!categoria || subcategorias.length === 0}
                fullWidth
                size="md"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-1.5">
              <label className="text-sm text-gray-600 font-medium">Buscar</label>
              <CustomInput
                name="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Busca tu huarique favorito..."
                type="search"
                fullWidth
                variant="primary"
                size="md"
                ariaLabel="Buscar servicios"
              />
            </div>
          </div>
        </div>
      </div>

      {!isVisible && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setServicioSeleccionado(null)
          }}
          className="fixed bottom-6 right-16 z-[1000] flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <FaFilter className="text-lg" />
          <span className="hidden sm:block font-medium">Mostrar filtros</span>
        </button>
      )}

      {/* Modal fallback */}
      <ModalSinServicios
        isOpen={showNoServicesModal}
        onClose={() => setShowNoServicesModal(false)}
        onConfirm={() => {
          if (fallbackData.length > 0) {
            setServiciosFilterActivos(fallbackData);
          } else {
            setServiciosFilterActivos(serviciosActivos);
          }
          setShowNoServicesModal(false);
        }}
        type={modalType}
      />
      
    </>
  );
};

export default ServiciosHeader;
