import {
  FaRegFrown,
  FaPlayCircle,
  FaEdit,
  FaExternalLinkAlt,
  FaRegSmile,
  FaRegMeh,
  FaTrashAlt,
} from "react-icons/fa";
import { useAppState } from "../../../../hooks/useAppState";
import dayjs from "dayjs";
import { CustomCheckbox } from "../../../ui/CustomCheckbox";
import type { AvisoData } from "../../../../interfaces/IAviso";
import { getSubcategoriaImage } from "../../../../helpers/getCategoria";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import { useServicio } from "../../../../hooks/useServicio";
import { useDireccion } from "../../../../hooks/useDireccion";
import { useEmpresa } from "../../../../hooks/useEmpresa";
import { useArchivo } from "../../../../hooks/useArchivo";
import type { MultimediaService } from "../../../../interfaces/IMultimedia";
import { useState } from "react";
import ModalLimiteServicios from "./ModalLimiteServicios";
import { useAviso } from "../../../../hooks/useAviso";
import ModalEliminarAviso from "./ModalEliminarAviso";
import { useNotification } from "../../../../hooks/useNotificacionHooks/useNotification";

// import { useServicio } from "../../../../hooks/useServicio";


const backgroundColor = "#F5FBF9";
const ListaAvisos = () => {
  const { 
    filtroAvisos, 
    seleccionadosAvisos, 
    setSeleccionadosAvisos, 
    setProgressService,
    progressService,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setMultimediaService,
    setDireccionService,
    user,
    setUbigeo_Usuario,
    ubigeo_usuario,
    setIsServiceEdit,
    setIdAviso
  
  } = useAppState();
  const navigate = useNavigate();
  const {getUserInfo} = useUser();
  const {getServicioById} = useServicio();
  const {getDireccionByEntidad} = useDireccion();
  const {getEmpresa} = useEmpresa();
  const {getArchivos} = useArchivo();
  const { deleteAviso } = useAviso();
  const {showMessage} = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoModal, setMotivoModal] = useState("");


  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [avisoToDelete, setAvisoToDelete] = useState<AvisoData | null>(null);

  const handleOpenDeleteModal = (aviso: AvisoData) => {
    setAvisoToDelete(aviso);
    setIsModalDeleteOpen(true);
  };



  if (!filtroAvisos.length) return null;

  const toggleSeleccion = (aviso: AvisoData) => {
    const existe = seleccionadosAvisos.some(a => a.AVIS_Id === aviso.AVIS_Id);
    if (existe) {
      setSeleccionadosAvisos(seleccionadosAvisos.filter(a => a.AVIS_Id !== aviso.AVIS_Id));
    } else {
      setSeleccionadosAvisos([...seleccionadosAvisos, aviso]);
    }
  };

  
  const handleClickEditarAviso = async (id: string, idAviso: number) => {
    console.log(user);
    await getUserInfo();

    await getDireccionByEntidad("usuario", user?.cod_usuario || "", async (success, _message, direccion) => {
      if (success && direccion) {
        setUbigeo_Usuario({
          ...ubigeo_usuario,
          cod_ubigeo:direccion.DIUS_CodigoUbigeo,
          departamento:direccion.Ubigeo?.UBIG_Departamento ?? '',
          provincia:direccion.Ubigeo?.UBIG_Provincia ?? '',
          distrito:direccion.Ubigeo?.UBIG_Distrito ?? '',
          direccion:direccion.DIUS_Direccion,
          latitud:direccion.DIUS_Latitud ?? 0,
          longitud:direccion.DIUS_Longitud ?? 0
        });
      }
    });
    if(user?.tieneEmpresa){
      await getEmpresa();
    }

    await getServicioById(id, async (success, message, servicio) => {
      if (success && servicio) {
        setService(servicio);
        setModifiedService(servicio);
      } else {
        console.error("Error al obtener servicio:", message);
      }
    });

    await getArchivos("servicio", id, async (successArch, _msg, archivos) => {
      if (successArch && archivos && archivos.length > 0) {
        // Mapea según ARCH_Tipo
        const multimedia: MultimediaService = {
          logo: "",
          portada: "",
          imagenes: [],
          videoPromocional: "",
          cartaRecomendacion: {
            url:"",
            nombre:""
          },
        };

        archivos.forEach((arch) => {
          switch (arch.ARCH_Tipo) {
            case "logo":
              multimedia.logo = arch.ARCH_Ruta;
              break;
            case "portada":
              multimedia.portada = arch.ARCH_Ruta;
              break;
            case "imagen":
              multimedia.imagenes.push(arch.ARCH_Ruta);
              break;
            case "video":
              multimedia.videoPromocional = arch.ARCH_Ruta;
              break;
            case "documento":
            case "carta":
              multimedia.cartaRecomendacion.url = arch.ARCH_Ruta;
              multimedia.cartaRecomendacion.nombre = arch.ARCH_NombreOriginal;
              break;
          }
        });
        setMultimediaService(multimedia);
      } else {
        setMultimediaService(null);
      }
    });

    await getDireccionByEntidad("servicio", id || "", async (success, _message, direccion) => {
      if (success && direccion) {
         setDireccionService({
          departamento:direccion.Ubigeo?.UBIG_Departamento ?? '',
          provincia:direccion.Ubigeo?.UBIG_Provincia ?? '',
          distrito:direccion.Ubigeo?.UBIG_Distrito ?? '',
          direccion:direccion.DIUS_Direccion,
          latitud:direccion.DIUS_Latitud ?? 0,
          longitud:direccion.DIUS_Longitud ?? 0
        });
      }else{
        setDireccionService(null);
      }
    });

    navigate(`/panel/publicador`);
    setIdAviso(idAviso)

    setProgressService({
      ...progressService,
      currentPath: "/panel/publicador/principales",
      step: 1,
    });

    setProgressPrincipalService({
      ...progressPrincipalService,
      step: 1,
      currentPath: "/panel/publicador/principales/perfilnegocio",
    });
    setIsServiceEdit(true);
  };

    const handleValidarYEditar = async (aviso: AvisoData) => {

      // Si el aviso es borrador y el usuario alcanzó el límite
      if (
        aviso.AVIS_Estado === "borrador" &&
        user &&
        (user.serviciosActivos ?? 0) >= (user.limiteServicios ?? 0)
      ) {
        setMotivoModal("Ya has alcanzado el límite de servicios activos que puedes tener con tu plan.");
        setIsModalOpen(true);
        return;
      }


      // Si pasa la validación, permite editar
      handleClickEditarAviso(aviso.SERV_Interno, aviso.AVIS_Id);
    };

    const handleConfirmDelete = () => {
    if (!avisoToDelete) return;

    deleteAviso(avisoToDelete.AVIS_Id, (success) => {
      if (success) {
        showMessage("Aviso eliminado correctamente","success");
      } else {
        showMessage("Error al eliminar","error");
      }
      setIsModalDeleteOpen(false);
      setAvisoToDelete(null);
    });
  };




  return (
    <>
      <div className="space-y-4">
        {filtroAvisos.map((aviso) => {
        const checked = seleccionadosAvisos.some((a) => a.AVIS_Id === aviso.AVIS_Id);
          return (
            <div key={aviso.AVIS_Id} style={{ backgroundColor }} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center flex-col justify-center gap-0">
                <div className="w-full h-full flex flex-col pb-4 border-b-[1px] border-gray-400 gap-0  lg:bg-transparent">
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                    <div className="w-full">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-0">
                          {/* checkbox y imagen */}
                          <CustomCheckbox
                            checked={checked}
                            onChange={() => toggleSeleccion(aviso)}
                            variant="primary"
                            fontSize="14px"
                            size="md"
                          />

                          <div className={`${aviso?.Servicio && aviso.Servicio.Archivos && aviso.Servicio.Archivos.length > 0 ? 'w-20 h-20  bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden' : 'w-20 h-20 '}`}>
                            {aviso?.Servicio && aviso.Servicio.Archivos && aviso.Servicio.Archivos.length > 0 ? (
                              <img
                                  src={aviso.Servicio.Archivos[0].ARCH_Ruta}
                                  alt="inmueble"
                                  className="w-full h-full object-cover"
                                />
                            ) : (
                              <img
                                  src={getSubcategoriaImage({
                                cod_subcategoria: aviso.Servicio?.Subcategoria?.SUBC_Id,
                                descripcion: aviso.Servicio?.Subcategoria?.SUBC_Descripcion,
                              })}
                                  alt="inmueble"
                                  className="w-full h-full object-cover"
                                />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {/* {aviso.sub_tipo_propiedad?.[0]?.tipo_inmueble_nombre} */}
                          </p>
                          <h3 className="text-base font-semibold text-gray-800">
                            {aviso.Servicio?.SERV_Nombre}
                          </h3>
                          <div className="flex w-full flex-row gap-2">
                            <p className="text-sm text-gray-500">
                              {aviso.Servicio?.Subcategoria?.SUBC_Nombre}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-auto flex items-center justify-center">
                      {/* Diseño para pantallas medianas y grandes */}
                    <div className="w-auto sm:flex flex-col items-center gap-1 hidden">
                      {/* Estado */}
                      <span className="flex items-center justify-center gap-1 text-gray-600 text-[12px]">
                        {aviso.AVIS_Estado}
                      </span>

                      {/* Círculo de progreso */}
                      <div className="w-12 h-12 relative">
                        {(() => {
                          const radius = 20;
                          const circumference = 2 * Math.PI * radius;
                          const progress = aviso.AVIS_Progreso ?? 0;
                          const offset = circumference - (progress / 100) * circumference;

                          // Elegir color dinámico
                          const progressColor =
                            progress >= 100
                              ? "#16a34a" // verde
                              : progress >= 50
                              ? "#eab308" // amarillo
                              : "#9ca3af"; // gris

                          return (
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                              <circle
                                className="text-gray-200"
                                strokeWidth="4"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="24"
                                cy="24"
                              />
                              <circle
                                strokeWidth="4"
                                stroke={progressColor}
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                r={radius}
                                cx="24"
                                cy="24"
                                className="transition-all duration-500 ease-out"
                              />
                            </svg>
                          );
                        })()}

                        {/* Porcentaje */}
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-700 font-semibold ">
                          {aviso.AVIS_Progreso ?? 0}%
                        </span>

                        {/* Ícono de estado */}
                        <div className="absolute  flex items-center justify-center pointer-events-none -bottom-2 ">
                          {aviso.AVIS_Progreso >= 100 ? (
                            <FaRegSmile className="text-green-600 text-lg" />
                          ) : aviso.AVIS_Progreso >= 50 ? (
                            <FaRegMeh className="text-yellow-500 text-lg" />
                          ) : (
                            <FaRegFrown className="text-gray-400 text-lg" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Diseño alternativo para sm hacia abajo */}
                    <div className="w-full flex items-center gap-2 sm:hidden">
                      <span className="text-gray-600 text-xs">{aviso.AVIS_Estado}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {aviso.AVIS_Progreso > 0 ? `${aviso.AVIS_Progreso}%` : "0%"}
                      </span>
                    </div>

                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col sm:flex-row md:flex-col lg:flex-row lg:items-center gap-4 text-xs text-gray-600 pt-4 justify-between">
                <div className="w-full flex flex-wrap gap-2 lg:gap-4 items-center">
                  {/* Código */}
                  <span>
                    Código <span className="font-semibold">{aviso.Servicio?.SERV_Interno}</span>
                  </span>

                  {/* Separador */}
                  <span className="text-gray-300 hidden sm:inline">|</span>

                  {/* ID */}
                  <span>
                    ID <span className="font-semibold">{aviso.AVIS_Id}</span>
                  </span>

                  {/* Separador */}
                  <span className="text-gray-300 hidden sm:inline">|</span>

                  {/* Fecha creación */}
                  <span>
                    Creado {dayjs(aviso.AVIS_FechaRegistro).format("DD/MM/YYYY")}
                  </span>
                </div>

                <div className="w-auto flex-1">
                  {/* Íconos */}
                  <div className="flex items-center gap-3 lg:ml-auto text-lg text-gray-500">
                    {aviso.AVIS_Estado === "borrador" && (
                      <FaPlayCircle
                        title="Continuar publicación"
                        className="cursor-pointer hover:text-green-600"
                      />
                    )}
                    <FaEdit
                      title="Editar aviso"
                      className="cursor-pointer hover:text-blue-600"
                      onClick={()=>handleValidarYEditar(aviso)}
                    />
                    {aviso.AVIS_Estado === "publicado" && (
                      <FaExternalLinkAlt
                        title="Ver aviso publicado"
                        className="cursor-pointer hover:text-gray-700"
                      />
                    )}
                    <FaTrashAlt
                      title="Eliminar aviso"
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => handleOpenDeleteModal(aviso)}
                    />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      <ModalLimiteServicios
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        limite={user?.limiteServicios || 0}
        motivo={motivoModal}
      />
      <ModalEliminarAviso
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        avisoNombre={avisoToDelete?.Servicio?.SERV_Nombre}
      />

    </>
  );
};

export default ListaAvisos;