import { useMemo } from "react";
import { FaInbox } from "react-icons/fa";
import { CustomChip } from "../../../ui/CustomChip";
import { useAppState } from "../../../../hooks/useAppState";

const backgroundColor = "#F5FBF9";

const FilterAviso = () => {
  const { listaAvisos, setFiltroAvisos, setIsArchivado, isArchivado, setSeleccionadosAvisos } =
    useAppState();

  const limpiarFiltros = () => {
    setIsArchivado(false);
    setFiltroAvisos(listaAvisos.avisos);
  };

  const { categoria, estados } = useMemo(() => {
    const categoriaMap = new Map<string, number>();
    const estadoMap = new Map<string, number>();

    const avisosNoArchivados =
      listaAvisos?.avisos?.filter((av) => !av.Servicio?.SERV_Archivado) || [];

    avisosNoArchivados.forEach((aviso) => {
      const subcategoria = aviso.Servicio?.Subcategoria;
      const estado = aviso.AVIS_Estado;

      if (subcategoria) {
        const key = subcategoria.SUBC_Nombre;
        categoriaMap.set(key, (categoriaMap.get(key) || 0) + 1);
      }

      if (estado) {
        const key = estado;
        estadoMap.set(key, (estadoMap.get(key) || 0) + 1);
      }
    });

    return {
      categoria: Array.from(categoriaMap.entries()),
      estados: Array.from(estadoMap.entries()),
    };
  }, [listaAvisos]);

  return (
    <div
      className="w-full md:max-w-[280px] md:min-w-[280px] p-4 rounded-2xl border border-gray-200 shadow-md transition-all duration-300"
      style={{ backgroundColor }}
    >
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
          Filtros
        </h2>
        {isArchivado && (
          <button
            onClick={limpiarFiltros}
            className="text-sm text-primary hover:underline transition duration-200 font-medium hover:cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Chip activo */}
      <div
        className={`transition-all duration-300 ${
          isArchivado
            ? "opacity-100 mb-4 scale-100"
            : "opacity-0 h-0 mb-0 scale-95"
        } overflow-hidden`}
      >
        {isArchivado && (
          <CustomChip
            label="Archivado"
            onDelete={limpiarFiltros}
            variant="primary-outline"
            selected
          />
        )}
      </div>

      {/* 🔸 Subcategorías */}
      {!isArchivado && categoria.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Subcategorías
            </p>
            <button
              onClick={() => {
                const todos = listaAvisos.avisos.filter(
                  (av) => !av.Servicio?.SERV_Archivado
                );
                setFiltroAvisos(todos);
                setSeleccionadosAvisos([]);
              }}
              className="text-xs text-green-600 hover:text-green-800 font-medium underline-offset-2 hover:underline transition-all"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-1 pl-1">
            {categoria.map(([nombre, count]) => (
              <div
                key={nombre}
                onClick={() => {
                  const filtrados = listaAvisos.avisos
                    .filter((av) => !av.Servicio?.SERV_Archivado)
                    .filter(
                      (av) => av.Servicio?.Subcategoria?.SUBC_Nombre === nombre
                    );
                  setFiltroAvisos(filtrados);
                  setSeleccionadosAvisos([]);
                }}
                className="flex justify-between items-center cursor-pointer text-sm text-gray-800 py-1 px-2 rounded-lg hover:bg-green-100 hover:text-green-700 transition-all"
              >
                <span>{nombre}</span>
                <span className="text-gray-500 text-xs font-medium">
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*  Estado */}
      {!isArchivado && estados.length > 0 && (
        <div className="mb-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Estado
            </p>
            <button
              onClick={() => {
                const todos = listaAvisos.avisos.filter(
                  (av) => !av.Servicio?.SERV_Archivado
                );
                setFiltroAvisos(todos);
                setSeleccionadosAvisos([]);
              }}
              className="text-xs text-green-600 hover:text-green-800 font-medium underline-offset-2 hover:underline transition-all"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-1 pl-1">
            {estados.map(([nombre, count]) => (
              <div
                key={nombre}
                onClick={() => {
                  const filtrados = listaAvisos.avisos
                    .filter((av) => !av.Servicio?.SERV_Archivado)
                    .filter((av) => av.AVIS_Estado === nombre);
                  setFiltroAvisos(filtrados);
                  setSeleccionadosAvisos([]);
                }}
                className="flex justify-between items-center cursor-pointer text-sm text-gray-800 py-1 px-2 rounded-lg hover:bg-green-100 hover:text-green-700 transition-all"
              >
                <span>{nombre}</span>
                <span className="text-gray-500 text-xs font-medium">
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        onClick={() => {
          setIsArchivado(true);
          const archivados = listaAvisos.avisos.filter(
            (av) => av.Servicio?.SERV_Archivado === true
          );
          setFiltroAvisos(archivados);
        }}
        className="flex items-center gap-3 text-gray-700 hover:bg-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-green-200"
      >
        <div className="bg-green-100 text-text-primary p-2 rounded-full group-hover:bg-green-200 transition duration-200">
          <FaInbox size={18} />
        </div>
        <span className="text-sm font-medium group-hover:text-green-900">
          Bandeja de Archivados
        </span>
      </div>
    </div>
  );
};

export default FilterAviso;
