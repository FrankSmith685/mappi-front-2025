/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { CustomCheckbox } from "../../../ui/CustomCheckbox";
import { CustomInput } from "../../../ui/CustomInput";
import { CustomSelected } from "../../../ui/CustomSelected";
import { useAppState } from "../../../../hooks/useAppState";
import { FaArchive, FaUndo } from "react-icons/fa";
import { useNotification } from "../../../../hooks/useNotificacionHooks/useNotification";
import { CustomModalConfirm } from "../../../ui/CustomModalConfirm";
import { useServicio } from "../../../../hooks/useServicio";

type SortOption =
  | "Creados recientes"
  | "Creados antiguos"
  | "Fecha de publicación recientes"
  | "Fecha de publicación antiguos"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "Creados recientes", label: "Creados recientes" },
  { value: "Creados antiguos", label: "Creados antiguos" },
  { value: "Fecha de publicación recientes", label: "Fecha de publicación recientes" },
  { value: "Fecha de publicación antiguos", label: "Fecha de publicación antiguos" },
];

const backgroundColor = "#F5FBF9";

const NoResultsHeader: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("Creados recientes");
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);

  const [openConfirmModal, setOpenConfirmModal] = useState<null | 'archive' | 'restore'>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setFiltroAvisos,filtroAvisos,setListaAvisos, listaAvisos,isArchivado, seleccionadosAvisos,setSeleccionadosAvisos } = useAppState();
  const { archivarServicio } = useServicio();

  const { showMessage } = useNotification();


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent<string | number>) => {
    setSort(e.target.value as SortOption);
  };

  const handleHeaderCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCheckboxChecked(checked);

    if (checked) {
      const avisosASeleccionar = filtroAvisos; 
      setSeleccionadosAvisos(avisosASeleccionar);
    } else {
      setSeleccionadosAvisos([]);
    }
  };

  const handleClickArchiveRestore = () => {
    if (seleccionadosAvisos.length === 0) return;
    setOpenConfirmModal(isArchivado ? "restore" : "archive");
  };

 const handleConfirmAction = async () => {
  if (!openConfirmModal) return;

  setIsLoading(true);

  const codServicios = seleccionadosAvisos
    .map(av => av.Servicio?.SERV_Interno)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  if (codServicios.length === 0) {
    showMessage("No hay servicios seleccionados.", "info");
    setIsLoading(false);
    setOpenConfirmModal(null);
    return;
  }

  try {
    const archivado = openConfirmModal === "archive";
    const result = await archivarServicio(codServicios, archivado);

    if (result?.success) {
      const avisosActualizados = listaAvisos.avisos.map(av => {
        const servicioId = av.Servicio?.SERV_Interno ?? av.SERV_Interno;
        if (servicioId && codServicios.includes(servicioId)) {
          return {
            ...av,
            Servicio: av.Servicio
              ? { ...av.Servicio, SERV_Archivado: archivado }
              : av.Servicio,
            isArchivado: archivado,
          };
        }
        return av;
      });
      setListaAvisos({
        ...listaAvisos,
        avisos:avisosActualizados
      })

      setSeleccionadosAvisos([]);
      setCheckboxChecked(false);

      showMessage(
        archivado
          ? "Avisos archivados correctamente."
          : "Avisos restaurados correctamente.",
        "success"
      );
    } else {
      showMessage(result?.message || "Error en la operación", "error");
    }
  } catch (error: any) {
    showMessage(error.message || "Error inesperado", "error");
  } finally {
    setIsLoading(false);
    setOpenConfirmModal(null);
  }
};


useEffect(() => {
  const todosSeleccionados =
    filtroAvisos.length > 0 &&
    filtroAvisos.every(av =>
      seleccionadosAvisos.some(sel => sel.AVIS_Id === av.AVIS_Id)
    );

  if (checkboxChecked !== todosSeleccionados) {
    setCheckboxChecked(todosSeleccionados);
  }
}, [seleccionadosAvisos, filtroAvisos]);


useEffect(() => {
  const searchTerm = search.trim().toLowerCase();

  let filtrados = listaAvisos.avisos.filter((aviso) => {
    if (isArchivado && !aviso.Servicio?.SERV_Archivado) return false;
    if (!isArchivado && aviso.Servicio?.SERV_Archivado) return false;

    const texto = `${aviso.AVIS_Id} ${aviso.Servicio?.SERV_Interno} ${aviso.Servicio?.SERV_Nombre} ${aviso.Servicio?.Subcategoria?.SUBC_Nombre}}`.toLowerCase();
    const coincideBusqueda = texto.includes(searchTerm);
    const coincideEstado = checkboxChecked ? aviso.AVIS_Estado === "borrador" : true;

    return coincideBusqueda && coincideEstado;
  });

  filtrados = filtrados.sort((a, b) => {
    const creadoA = new Date(a.AVIS_FechaRegistro);
    const creadoB = new Date(b.AVIS_FechaRegistro);

    const publicadoA = a.AVIS_FechaPublicacion ? new Date(a.AVIS_FechaPublicacion) : null;
    const publicadoB = b.AVIS_FechaPublicacion ? new Date(b.AVIS_FechaPublicacion) : null;

    switch (sort) {
      case "Creados recientes":
        return creadoB.getTime() - creadoA.getTime();

      case "Creados antiguos":
        return creadoA.getTime() - creadoB.getTime();

      case "Fecha de publicación recientes":
        if (!publicadoA && !publicadoB) return 0;
        if (!publicadoA) return 1;
        if (!publicadoB) return -1;
        return publicadoB.getTime() - publicadoA.getTime();

      case "Fecha de publicación antiguos":
        if (!publicadoA && !publicadoB) return 0;
        if (!publicadoA) return 1;
        if (!publicadoB) return -1;
        return publicadoA.getTime() - publicadoB.getTime();

      default:
        return 0;
    }
  });


  setFiltroAvisos(filtrados);
}, [search, sort, checkboxChecked, listaAvisos.avisos, isArchivado]);

  const hayAvisosNoArchivados = listaAvisos.avisos.some(av => !av.Servicio?.SERV_Archivado);
const hayAvisosArchivados = listaAvisos.avisos.some(av => av.Servicio?.SERV_Archivado);

  return (
    <>
      <div
        className="rounded-2xl shadow-md border border-gray-200 transition-all duration-300"
        style={{ backgroundColor }}
      >
        <div className="p-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          {/* Checkbox */}
          <div className="flex items-center gap-0 w-full md:w-auto">
            <CustomCheckbox
              label={
                seleccionadosAvisos.length > 0
                  ? `Se seleccionaron ${seleccionadosAvisos.length} ${isArchivado ? "avisos archivados" : "avisos"}`
                  : `Se encontraron ${
                      !isArchivado
                        ? filtroAvisos.filter(av => !av.Servicio?.SERV_Archivado).length + " avisos"
                        : listaAvisos.avisos.filter(av => av.Servicio?.SERV_Archivado).length + " avisos archivados"
                    }`
              }
              checked={checkboxChecked}
              onChange={handleHeaderCheckbox}
              variant="primary"
              fontSize="14px"
              size="md"
            />

            {seleccionadosAvisos.length > 0 && (
              <button
                onClick={handleClickArchiveRestore}
                className={`flex items-center gap-2 
                  ${(!isArchivado && !hayAvisosNoArchivados) || (isArchivado && !hayAvisosArchivados) ? 'hidden' : 'flex'}
                  ${!isArchivado ? 'bg-primary hover:bg-green-900' : 'bg-yellow-600 hover:bg-yellow-700'}
                  text-white px-3 py-1 rounded-lg transition`}
              >
                {!isArchivado ? <FaArchive /> : <FaUndo />}
                <p className="lg:hidden text-white">
                  {!isArchivado ? 'Archivar' : 'Restaurar'}
                </p>
              </button>
            )}

          </div>

          {/* Search input */}
          <div className="w-full md:flex-1 min-w-0">
            <CustomInput
              name="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Código / ID / Nombre / SubCategoría"
              type="search"
              fullWidth
              variant="primary"
              size="md"
              ariaLabel="Buscar avisos"
              icon={null}
              label={undefined}
              error={false}
            />
          </div>

          {/* Select ordenamiento */}
          <div className="w-full md:w-auto">
            <CustomSelected
              value={sort}
              onChange={handleSortChange}
              options={sortOptions}
              label="Ordenar por"
              variant="primary"
              fullWidth={true}
              size="md"
            />
          </div>
        </div>
      </div>
    
      <CustomModalConfirm
        isOpen={Boolean(openConfirmModal)}
        onClose={() => setOpenConfirmModal(null)}
        onConfirm={handleConfirmAction}
        title={openConfirmModal === "archive" ? "Confirmar archivado" : "Confirmar restauración"}
        message={
          openConfirmModal === "archive"
            ? "¿Deseas archivar los avisos seleccionados?"
            : "¿Deseas restaurar los avisos seleccionados?"
        }
        loading={isLoading}
      />
    </>
  );
};

export default NoResultsHeader;
