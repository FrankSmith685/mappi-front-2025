/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CustomButton } from "../../../../ui/CustomButton";
import { SeleccionarPlanIndependiente } from "./components/SeleccionarPlanIndependiente";
import type { UpdateUsuarioCompleto } from "../../../../../interfaces/IUser";
import { useUser } from "../../../../../hooks/useUser";
import { useAppState } from "../../../../../hooks/useAppState";
import type { CreateEmpresaRequest, EmpresaData, UpdateEmpresaRequest } from "../../../../../interfaces/IEmpresa";
import { useEmpresa } from "../../../../../hooks/useEmpresa";
import type { CreateServicioRequest } from "../../../../../interfaces/IServicio";
import { useServicio } from "../../../../../hooks/useServicio";
import { useArchivo } from "../../../../../hooks/useArchivo";
import { useUbigeo } from "../../../../../hooks/useUbigeo";
import { useDireccion } from "../../../../../hooks/useDireccion";
import type { DireccionRequest } from "../../../../../interfaces/IDireccion";
import { useAviso } from "../../../../../hooks/useAviso";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";


const Publicar = () => {
  const [isLoadingGuardar,setIsLoadingGuardar] = useState(false);
  const {
    modifiedUser,
    ubigeo_usuario,
    setUser,
    user,
    setModifiedUser,
    profileType,
    company,
    modifiedCompany,
    setCompany,
    setModifiedCompany,
    multimediaService,
    direccionService,
    modifiedService,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setMultimediaService,
    setDireccionService,
    isServiceEdit,
    idAviso,
    setIdAviso,
    idsDeleteMultimedia,
    setIdsDeleteMultimedia,
    setMultimediaAvisoPreview,
    multimediaAvisosPreview
  } = useAppState();
  

  const {updateUser, getUserInfo} = useUser();
  const {updateEmpresa, createEmpresa}= useEmpresa();
  const {createServicio, updateServicio} = useServicio();
  const {subirArchivosMultiples, actualizarArchivosMultiples, eliminarArchivosMultiples} = useArchivo();
  const {getCodUbigeo} = useUbigeo();
  const {createDireccion, updateDireccion} = useDireccion();
  const {createAviso, updateAviso} = useAviso();
  const {showMessage} = useNotification();

  const navigate = useNavigate();

 

  const handleClickGuardar = async () => {
    try {
      setIsLoadingGuardar(true);
      
      const payloadUsuario: UpdateUsuarioCompleto = {
        USUA_Interno: modifiedUser?.cod_usuario,
        USUA_Nombre: modifiedUser?.nombre,
        USUA_Apellido: modifiedUser?.apellido,
        USUA_Telefono: modifiedUser?.telefono,
        USUA_Dni: modifiedUser?.dni,
        USUA_IdUbigeo: ubigeo_usuario.cod_ubigeo ?? '',
        USUA_Direccion: ubigeo_usuario.direccion ?? '',
        USUA_Latitud: ubigeo_usuario.latitud,
        USUA_Longitud: ubigeo_usuario.longitud,
      };
      updateUser(payloadUsuario, async(updatedUser) => {
        setUser({ ...user, ...updatedUser});
        setModifiedUser({ ...modifiedUser, ...updatedUser});
        let empresaActual: EmpresaData | null = null;
        
        if (profileType === "empresa") {
          empresaActual = await new Promise<EmpresaData | null>((resolve) => {
            if (company) {
              const payloadCompany: UpdateEmpresaRequest = {
                EMPR_Interno: modifiedCompany?.cod_empresa || "",
                EMPR_RazonSocial: modifiedCompany?.razon_social || "",
                EMPR_Ruc: modifiedCompany?.ruc,
                DIUS_Direccion: ubigeo_usuario.direccion ?? "",
                DIUS_CodigoUbigeo: ubigeo_usuario.cod_ubigeo ?? "",
                DIUS_Latitud: ubigeo_usuario.latitud,
                DIUS_Longitud: ubigeo_usuario.longitud,
              };

              updateEmpresa(company?.cod_empresa || "", payloadCompany, (success, _msg, empresa) => {
                if (success && empresa) {
                  setCompany(empresa);
                  setModifiedCompany(empresa);
                  resolve(empresa);
                } else resolve(null);
              });
            } else {
              const payloadCompany: CreateEmpresaRequest = {
                EMPR_RazonSocial: String(modifiedCompany?.razon_social),
                EMPR_Ruc: String(modifiedCompany?.ruc),
                EMPR_Telefono: modifiedCompany?.telefono,
                DIUS_Direccion: ubigeo_usuario.direccion ?? "",
                DIUS_CodigoUbigeo: ubigeo_usuario.cod_ubigeo ?? "",
                DIUS_Latitud: ubigeo_usuario.latitud,
                DIUS_Longitud: ubigeo_usuario.longitud,
              };

              createEmpresa(payloadCompany, (success, _msg, empresa) => {
                if (success && empresa) {
                  setCompany(empresa);
                  setModifiedCompany(empresa);
                  resolve(empresa);
                } else resolve(null);
              });
            }
          });
        }
        const finalData: CreateServicioRequest = {
          SERV_Nombre: modifiedService?.nombre ?? '',
          SERV_Descripcion: modifiedService?.descripcion ?? '',
          SUBC_Id: Number(modifiedService?.subcategoria?.cod_subcategoria),
          SERV_Abierto24h: !!modifiedService?.abierto24h,
          SERV_HoraInicio: modifiedService?.horaInicio ?? null,
          SERV_HoraFin: modifiedService?.horaFin ?? null,
          SERV_Delivery: !!modifiedService?.delivery,
          SERV_Estado: true,
        };
        if(isServiceEdit){

          await updateServicio(modifiedService?.cod_servicio ?? '',finalData, async(success, message, servicio) => {
            if (success && servicio ) {
                if(multimediaService){

                  // Eliminar archivos
                  const idsAEliminar: string[] = [
                    idsDeleteMultimedia?.logo,
                    idsDeleteMultimedia?.portada,
                    idsDeleteMultimedia?.videoPromocional,
                    idsDeleteMultimedia?.cartaRecomendacion,
                    ...(idsDeleteMultimedia?.imagenes || []),
                  ].filter(Boolean)  as string[];
                  console.log(idsAEliminar);
                   if (idsAEliminar.length > 0) {
                    await eliminarArchivosMultiples(idsAEliminar, (success) => {
                      if (success) {
                        setIdsDeleteMultimedia(null)
                      }
                    });
                  }
                  // AQUI PRA ELIMINAR LOS ARCHIVOS

                  actualizarArchivosMultiples(
                  "servicio",
                  servicio?.cod_servicio ?? '',
                  {
                    logo: multimediaService?.logo instanceof File ? multimediaService.logo : undefined,
                    portada: multimediaService?.portada instanceof File ? multimediaService.portada : undefined,
                    imagenes:
                      multimediaService?.imagenes?.length > 0
                        ? multimediaService.imagenes.filter((img) => img instanceof File)
                        : undefined,
                    video: multimediaService.videoPromocional || undefined,
                    documento: multimediaService?.cartaRecomendacion.url instanceof File
                      ? multimediaService?.cartaRecomendacion?.url
                      : undefined,
                  },
                  (success, _archivos, message) => {
                    if(!success){
                      console.error(message)
                    }
                  }
                );
              }
              if(direccionService){
                getCodUbigeo(
                  direccionService?.departamento ?? '',
                  direccionService?.provincia ?? '',
                  direccionService?.distrito ?? '',
                  async(codUbigeo) => {
                    const payload: DireccionRequest = {
                      cod_entidad:servicio?.cod_servicio || '',
                      codigoUbigeo: codUbigeo,
                      direccion: direccionService?.direccion ?? '',
                      latitud: direccionService?.latitud,
                      longitud: direccionService?.longitud,
                      tipo_entidad:'servicio',
                      referencia:null,
                      predeterminado: true
                    };

                    await updateDireccion(
                      payload,
                      (success, message) => {
                        if (!success) {
                          console.error(message);
                        }
                      }
                    );
                  }
                );
              }
              updateAviso(
                Number(idAviso),
                {
                  AVIS_Estado: "publicado",
                  EMPR_Interno: profileType === "empresa" ? String((empresaActual as EmpresaData)?.cod_empresa ?? "") : null,
                  SERV_Interno: servicio?.cod_servicio,
                  isCompleted: 5,
                },
                async(success, message, avisoData) => {
                  if (success && avisoData) {
                    setMultimediaAvisoPreview({
                      ...multimediaAvisosPreview,
                      AVIS_Id: avisoData.AVIS_Id,
                    })
                    setService(null);
                    setModifiedService(null);
                    navigate("/panel/avisos")
                    showMessage("Se ha actualizado servicio correctamente", "success");
                    setProgressPrincipalService({
                        ...progressPrincipalService,
                        step: 1,
                        currentPath: "/panel/publicador/principales/perfilnegocio",
                    });
                    setMultimediaService(null);
                    setDireccionService(null);
                    setIdAviso(0);
                    await getUserInfo();
                  } else {
                    showMessage(message, "error");
                  }
                }
              );
            } else {
              console.error("Error al crear servicio:", message);
            }
          });
        }else{
          await createServicio(finalData, async(success, message, servicio) => {
            if (success && servicio ) {
              if(multimediaService){
                subirArchivosMultiples(
                  "servicio",
                  servicio?.cod_servicio ?? '',
                  {
                    logo: multimediaService?.logo instanceof File ? multimediaService.logo : undefined,
                    portada: multimediaService?.portada instanceof File ? multimediaService.portada : undefined,
                    imagenes:
                      multimediaService?.imagenes?.length > 0
                        ? multimediaService.imagenes.filter((img: any) => img instanceof File)
                        : undefined,
                    video: multimediaService.videoPromocional || undefined,
                    documento: multimediaService?.cartaRecomendacion.url instanceof File
                      ? multimediaService.cartaRecomendacion.url
                      : undefined,
                  },
                    (success,_data,message) => {
                        if(!success){
                          console.error(message)
                        }
                      }
                );
              }
              if(direccionService){
                getCodUbigeo(
                  direccionService?.departamento ?? '',
                  direccionService?.provincia ?? '',
                  direccionService?.distrito ?? '',
                  async(codUbigeo) => {
                    const payload: DireccionRequest = {
                      cod_entidad:servicio?.cod_servicio || '',
                      codigoUbigeo: codUbigeo,
                      direccion: direccionService?.direccion ?? '',
                      latitud: direccionService?.latitud,
                      longitud: direccionService?.longitud,
                      tipo_entidad:'servicio',
                      referencia:null,
                      predeterminado: true
                    };
      
                    await createDireccion(payload, (success,message) => {
                      if (!success) {
                        console.error(message);
                      }
                    });
                  }
                );
              }
              createAviso(
                {
                  AVIS_Estado: "publicado",
                  EMPR_Interno: profileType === "empresa" ? String((empresaActual as EmpresaData)?.cod_empresa ?? "") : null,
                  SERV_Interno: servicio?.cod_servicio,
                  isCompleted: 5,
                },
                async(success, message, avisoData) => {
                  if (success && avisoData) {
                    setMultimediaAvisoPreview({
                      ...multimediaAvisosPreview,
                      AVIS_Id: avisoData.AVIS_Id,
                    })
                    setService(null);
                    setModifiedService(null);
                    navigate("/panel/avisos");
                    showMessage("Se ha publicado correctamente", "success");
                    setProgressPrincipalService({
                      ...progressPrincipalService,
                      step: 1,
                      currentPath: "/panel/publicador/principales/perfilnegocio",
                    });
                    setMultimediaService(null);
                    setDireccionService(null);
                    await getUserInfo();
                  } else {
                    showMessage(message, "error");
                  }
                }
              );
            } else {
              console.error("Error al crear servicio:", message);
            }
          });
        }
      })

    } catch (error) {
     console.error("Error al guardar ubicación:", error);
    } finally {
      setIsLoadingGuardar(false);
    }
    
  }

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <SeleccionarPlanIndependiente/>
      <div className="max-w-full sm:max-w-[250px] w-full">
          <CustomButton text="Publicar mi huarique" type="button" onClick={handleClickGuardar} disabled={!user?.tienePlan} fullWidth fontSize="14px" variant="secondary-outline" loading={isLoadingGuardar}/>
      </div>
    </div>
  );
}
export default Publicar;