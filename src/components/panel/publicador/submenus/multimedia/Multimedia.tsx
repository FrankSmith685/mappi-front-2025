/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";

import { CustomButton } from "../../../../ui/CustomButton";
import { useAppState } from "../../../../../hooks/useAppState";
import { FaBullhorn, FaCamera, FaFilePdf, FaImage, FaPlus, FaStore, FaTrash, FaUtensils, FaVideo } from "react-icons/fa";
import CustomImageViewer from "../../../../ui/CustomImageViewer";
import { useAviso } from "../../../../../hooks/useAviso";
import { useServicio } from "../../../../../hooks/useServicio";
import type { CreateServicioRequest } from "../../../../../interfaces/IServicio";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { useArchivo } from "../../../../../hooks/useArchivo";
import type { UpdateUsuarioCompleto } from "../../../../../interfaces/IUser";
import { useUser } from "../../../../../hooks/useUser";
import type { CreateEmpresaRequest, EmpresaData, UpdateEmpresaRequest } from "../../../../../interfaces/IEmpresa";
import { useEmpresa } from "../../../../../hooks/useEmpresa";
import { useUbigeo } from "../../../../../hooks/useUbigeo";
import type { DireccionRequest } from "../../../../../interfaces/IDireccion";
import { useDireccion } from "../../../../../hooks/useDireccion";
import ModalGuardarBorrador from "../../components/modalGuardarBorrador";

// Validaciones Zod
const multimediaSchema = z.object({
  logoNegocio: z.any().optional(),
  portadaNegocio: z.any().optional(),
  imagenesPromocionales: z.any().optional(),
  videoPromocional: z.any().optional(),
  cartaRecomendacion: z.any().optional(),
});

type MultimediaFormData = z.infer<typeof multimediaSchema>;

const Multimedia = () => {
  const { 
    progressPrincipalService, 
    setProgressPrincipalService, 
    setModifiedService, 
    modifiedService, 
    profileType, 
    company, 
    setService, 
    setMultimediaService,
    multimediaService,
    setProgressService,
    progressService,
    modifiedUser,
    ubigeo_usuario,
    setUser,
    setModifiedUser,
    setCompany,
    modifiedCompany,
    setModifiedCompany,
    user,
    direccionService,
    setDireccionService, 
    isServiceEdit,
    setIdsDeleteMultimedia,
    idsDeleteMultimedia
  } = useAppState();
  const navigate = useNavigate();
  const {createAviso} = useAviso();
  const {createServicio} = useServicio();
  const {showMessage} = useNotification();
  const { subirArchivosMultiples } = useArchivo();
  const {updateUser, getUserInfo} = useUser();
  const {updateEmpresa, createEmpresa} = useEmpresa();
  const {getCodUbigeo} = useUbigeo();
  const {createDireccion} = useDireccion();

  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewPortada, setPreviewPortada] = useState<string | null>(null);
  const [previewPromos, setPreviewPromos] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
 


  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
   const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imagenFiles, setImagenFiles] = useState<File[]>([]);




  const [isLoadingGuardarSalir, setIsLoadingGuardarSalir] = useState(false);
  const [showModalBorrador, setShowModalBorrador] = useState(false);

  // Estados separados
  const [isLogoViewerOpen, setIsLogoViewerOpen] = useState(false);
  const [isPortadaViewerOpen, setIsPortadaViewerOpen] = useState(false);

  const [isPromosViewerOpen, setIsPromosViewerOpen] = useState(false);
  const [promoStartIndex, setPromoStartIndex] = useState(0);

  const [salir, setSalir] = useState(false);


  const { control, handleSubmit,reset, getValues,setValue } = useForm<MultimediaFormData>({
    resolver: zodResolver(multimediaSchema),
    defaultValues: {
      logoNegocio: null,
      portadaNegocio: null,
      imagenesPromocionales: [],
      videoPromocional: null,
      cartaRecomendacion: null,
    },
  });

  // const extractServiceCode = (url: string): string | null => {
  //   const match = url.match(/servicio\/(SER\d{4})\//);
  //   return match ? match[1] : null;
  // };

  const extractServiceCode = (url: string): string | null => {
  // Busca un patrón UUID v4 dentro del URL
  const match = url.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return match ? match[1] : null;
};



  useEffect(() => {
  if (!user?.tienePlan) {
    // Si no tiene plan, limitar las imágenes a 1
    setImagenFiles((prev) => prev.slice(0, 1));
    setPreviewPromos((prev) => prev.slice(0, 1));
  }
}, [user]);


  useEffect(() => {
  if (!multimediaService) return;

  // Logo
  if (multimediaService.logo) {
    if (typeof multimediaService.logo === "string") {
      setPreviewLogo(multimediaService.logo);
      console.log(multimediaService.logo);
    } else if (multimediaService.logo instanceof File) {
      setPreviewLogo(URL.createObjectURL(multimediaService.logo));
    }
  }

  // Portada
  if (multimediaService.portada) {
    if (typeof multimediaService.portada === "string") {
      setPreviewPortada(multimediaService.portada);
    } else if (multimediaService.portada instanceof File) {
      setPreviewPortada(URL.createObjectURL(multimediaService.portada));
    }
  }

  // 🖼️ Imágenes promocionales
  if (multimediaService.imagenes && multimediaService.imagenes.length > 0) {
    let imgs = [...multimediaService.imagenes];

    // 🔒 Limitar a 1 si no tiene plan
    if (!user?.tienePlan) {
      imgs = imgs.slice(0, 1);
    }

    const previews = imgs.map((img: any) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );

    setPreviewPromos(previews);
    setImagenFiles(imgs.filter((img: any) => img instanceof File));

    // ⚡️ Sincronizar también el valor del Controller
    setValue("imagenesPromocionales", imgs, { shouldValidate: false });
  } else {
    setPreviewPromos([]);
    setImagenFiles([]);
    setValue("imagenesPromocionales", [], { shouldValidate: false });
  }

  // 🎥 Video promocional
  if (multimediaService.videoPromocional) {
    if (typeof multimediaService.videoPromocional === "string") {
      setVideoUrl(multimediaService.videoPromocional);
      setPreviewVideo(multimediaService.videoPromocional);
    } else if (multimediaService.videoPromocional instanceof File) {
      setVideoFile(multimediaService.videoPromocional);
      setPreviewVideo(URL.createObjectURL(multimediaService.videoPromocional));
    }
  }

  if (multimediaService?.cartaRecomendacion.url) {
    setValue("cartaRecomendacion", multimediaService.cartaRecomendacion.url);
  }
}, [multimediaService, setValue, user]);



  // Guardar multimedia y avanzar
  const onSubmit = (data: MultimediaFormData) => {
    setMultimediaService({
      logo:data.logoNegocio,
      portada:data.portadaNegocio,
      imagenes:data.imagenesPromocionales,
      videoPromocional:data.videoPromocional,
      cartaRecomendacion:{
        url:data.cartaRecomendacion,
        nombre:multimediaService?.cartaRecomendacion.nombre || ""
      }
    });
    setProgressService({ ...progressService, step: 3, currentPath: "/panel/publicador/ubicacion" });
    // permitir que React aplique el setState antes de navegar
    setTimeout(() => {
      navigate("/panel/publicador/ubicacion");
    }, 0);
   
  };



  const getYoutubeEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);

    // ID del video
    const videoId = urlObj.searchParams.get("v");
    if (!videoId) return null;

    // Tiempo de inicio si existe
    const start = urlObj.searchParams.get("t");

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;
    if (start) {
      // convertir "10s" a segundos (quitar la "s")
      const seconds = start.replace("s", "");
      embedUrl += `?start=${seconds}`;
    }

    return embedUrl;
  } catch {
    return null;
  }
};

  const handleClickGuardarYSalir= async()=>{
    try {
      setIsLoadingGuardarSalir(true);

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
        let empresaActual = null;

      if (profileType === "empresa") {
        empresaActual = await new Promise((resolve) => {
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
          SERV_Estado: false,
        };

        await createServicio(finalData, (success, message, servicio) => {
          if (success && servicio ) {
            const values = getValues();
            subirArchivosMultiples(
              "servicio",
              servicio?.cod_servicio ?? '',
              {
                logo: logoFile || undefined,
                portada: portadaFile || undefined,
                imagenes: imagenFiles.length > 0 ? imagenFiles : undefined,
                video: videoUrl
                ? videoUrl
                : videoFile || undefined,
                documento: values.cartaRecomendacion || undefined,
              },
                (success,_data,message) => {
                  if(!success){
                    console.error(message)
                  }
                }
              );
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
                  AVIS_Estado: "borrador",
                  EMPR_Interno: profileType === "empresa" ? String((empresaActual as EmpresaData)?.cod_empresa ?? "") : null,
                  SERV_Interno: servicio?.cod_servicio,
                  isCompleted: direccionService ? 4 : 3,
                },
                async (success, message, avisoData) => {
                  if (success && avisoData) {
                    setService(null);
                    setModifiedService(null);
                    navigate("/panel/avisos")
                    showMessage("Se ha creado el servicio correctamente", "success");
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
              reset();
          } else {
            console.error("Error al crear servicio:", message);
          }
        });
      })
    } catch (error) {
      console.error(error);
    }finally {
      setIsLoadingGuardarSalir(false);
    }
  }

  const handleClickSalir=()=>{
    setSalir(false);
    setService(null);
    setModifiedService(null);
    navigate("/panel/avisos")
    setProgressPrincipalService({
        ...progressPrincipalService,
        step: 1,
        currentPath: "/panel/publicador/principales/perfilnegocio",
    });
    setMultimediaService(null);
    setDireccionService(null);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-100 rounded-xl max-w-[520px] p-6 text-center shadow-sm">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaUtensils className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center justify-center gap-2">
            <FaBullhorn className="text-orange-600" /> Atrae a tus Próximos Clientes
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Agrega el <span className="font-medium text-orange-600">logo de tu negocio</span>, 
            una portada llamativa y fotos que despierten el apetito. 
            <br />
            También puedes complementar con <span className="font-medium text-slate-700">videos promocionales </span> 
            o <span className="font-medium text-slate-700">documentos importantes</span> como recomendaciones, 
            aunque son <span className="italic">opcionales</span>.
            <br />
            Recuerda: <span className="font-medium text-orange-600">un perfil con buenas fotos genera mucha más confianza</span>.
          </p>
        </div>

        {/* Logo del negocio */}
        <Controller
          name="logoNegocio"
          control={control}
          render={({ field }) => {
          const handleFileChange = (file?: File) => {
            setLogoFile(file || null);
            if (!file) {

              field.onChange(null);
              setPreviewLogo(null);
              return;
            }
            field.onChange(file);
            const url = URL.createObjectURL(file);
            setPreviewLogo(url);
          };


          const triggerFileSelect = () => {
            document.getElementById("logoNegocioInput")?.click();
          };

          return (
            <section className="max-w-[500px]">
              <h4 className="font-semibold text-base mb-2">Logo del Negocio</h4>
              <p className="text-sm text-gray-600 mb-4">
                Recomendado: PNG transparente (ideal) o JPG, proporción cuadrada (1:1), tamaño ideal 512×512 px.
              </p>

              {/* Caja clickeable */}
              <div
                onClick={triggerFileSelect}
                className="group cursor-pointer relative w-50 h-50 rounded-xl border-2 border-dashed border-slate-300 
                bg-gradient-to-br from-orange-50 to-blue-50 shadow-inner flex items-center justify-center overflow-hidden 
                hover:border-orange-400 transition"
              >
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Logo del negocio"
                    className="w-full h-full object-contain p-2"
                    onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsLogoViewerOpen(true);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <FaStore className="w-10 h-10 mb-1" />
                    <span className="text-sm font-medium">Haz click para subir</span>
                  </div>
                )}

                {/* Botones flotantes ocultos hasta hover */}
                {previewLogo && (
                  <div
                    className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileSelect();
                      }}
                      className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
                    >
                      <FaCamera className="w-4 h-4 text-slate-700" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (previewLogo && previewLogo.includes("mappidevbucket")) {
                          const code = extractServiceCode(previewLogo);
                          if (code)
                            setIdsDeleteMultimedia({
                              ...idsDeleteMultimedia,
                              logo: code.toString() ?? "",
                            });
                        }
                        handleFileChange(undefined);
                      }}
                      className="p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                    >
                      <FaTrash className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Input oculto */}
              <input
                id="logoNegocioInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleFileChange(file);
                  e.target.value = "";
                }}
              />

              {/* Visor tipo WhatsApp */}
              <CustomImageViewer
                images={previewLogo ? [{ src: previewLogo, alt: "Logo del negocio" }] : []}
                startIndex={0}
                isOpen={isLogoViewerOpen}
                onClose={() => setIsLogoViewerOpen(false)}
              />

            </section>
          );
        }}
      />

      {/* Portada del negocio */}
      <Controller
        name="portadaNegocio"
        control={control}
        render={({ field }) => {
          const handleFileChange = (file?: File) => {
            field.onChange(file || null);
            setPortadaFile(file || null);
            if (file) {
              const url = URL.createObjectURL(file);
              setPreviewPortada(url);
            } else {
              setPreviewPortada(null);
            }
          };

          const triggerFileSelect = () => {
            document.getElementById("portadaNegocioInput")?.click();
          };

          return (
            <section className="max-w-[500px] mt-6">
              <h4 className="font-semibold text-base mb-2">Portada del Negocio</h4>
              <p className="text-sm text-gray-600 mb-4">
                Recomendado: JPG o PNG, proporción horizontal (16:9), tamaño ideal 1920×1080 px.
              </p>

              {/* Caja clickeable */}
              <div
                onClick={triggerFileSelect}
                className="group cursor-pointer relative w-full h-48 rounded-xl border-2 border-dashed border-slate-300 
                bg-gradient-to-br from-orange-50 to-blue-50 shadow-inner flex items-center justify-center overflow-hidden 
                hover:border-orange-400 transition"
              >
                {previewPortada ? (
                  <img
                    src={previewPortada}
                    alt="Portada del negocio"
                    className="w-full h-full object-cover"
                    onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsPortadaViewerOpen(true);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <FaImage className="w-10 h-10 mb-1" />
                    <span className="text-sm font-medium">Haz click para subir portada</span>
                  </div>
                )}

                {/* Botones flotantes si hay portada (solo en hover) */}
                {previewPortada && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileSelect();
                      }}
                      className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
                    >
                      <FaCamera className="w-4 h-4 text-slate-700" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (previewPortada && previewPortada.includes("mappidevbucket")) {
                          console.log(previewPortada);
                          const code = extractServiceCode(previewPortada);
                          console.log(code);
                          if (code)
                            setIdsDeleteMultimedia({
                              ...idsDeleteMultimedia,
                              portada: code.toString() ?? "",
                            });
                        }
                        handleFileChange(undefined);
                      }}
                      className="p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                    >
                      <FaTrash className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Input oculto */}
              <input
                id="portadaNegocioInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleFileChange(file);
                  e.target.value = "";
                }}
              />

              {/*  Visor tipo WhatsApp */}
              <CustomImageViewer
                images={previewPortada ? [{ src: previewPortada, alt: "Portada del negocio" }] : []}
                startIndex={0}
                isOpen={isPortadaViewerOpen}
                onClose={() => setIsPortadaViewerOpen(false)}
              />
            </section>
          );
        }}
      />

      {/* Imágenes Promocionales */}
      <Controller
        name="imagenesPromocionales"
        control={control}
        render={({ field }) => {
          const maxImages = user?.tienePlan ? user?.limitePromocional ?? 5 : 1;

          const handleFilesChange = (files?: FileList) => {
            if (!files) return;

            const newFiles = Array.from(files);
            const updatedFiles = [...(field.value || []), ...newFiles].slice(0, maxImages);
            field.onChange(updatedFiles);
            setImagenFiles(updatedFiles);

            // Generar previews
            const previews = updatedFiles.map((f) => URL.createObjectURL(f));
            setPreviewPromos(previews);
          };

          const removeImage = (index: number) => {
            const imageUrl = previewPromos[index];
            if (imageUrl && imageUrl.includes("mappidevbucket")) {
              const code = extractServiceCode(imageUrl);
              console.log(imageUrl);
              console.log(code)
              if (code) {
                setIdsDeleteMultimedia({
                  ...idsDeleteMultimedia,
                  [`imagen_${index}`]: code,
                });
                setIdsDeleteMultimedia({
                  ...idsDeleteMultimedia,
                  imagenes: [...idsDeleteMultimedia?.imagenes || [], code]
                });
              }
            }
            const updatedFiles = [...(field.value || [])];
            updatedFiles.splice(index, 1);
            field.onChange(updatedFiles);

            const previews = updatedFiles.map((f) => URL.createObjectURL(f));
            setPreviewPromos(previews);
          };

          return (
            <section className="mt-6 max-w-[500px]">
              <h4 className="font-semibold text-base mb-2">Imágenes Promocionales</h4>
              <p className="text-sm text-gray-600 mb-4">
                
                {user?.tienePlan ? (
                  <>
                    Puedes subir hasta <span className="font-medium">{user?.limitePromocional} imágenes</span> en formato JPG o PNG.
                  </>
                ) : (
                  <>
                    Solo puedes subir <span className="font-medium">1 imagen</span> promocional (sin plan activo).
                  </>
                )}
              </p>

              {/* Grid de previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Caja de subir nueva */}
                {(previewPromos.length < (user?.tienePlan ? user?.limitePromocional ?? 5 : 1)) && (
                  <div
                    onClick={() =>
                      document.getElementById("imagenesPromocionalesInput")?.click()
                    }
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed border-slate-300 bg-gradient-to-br from-orange-50 to-blue-50 hover:border-orange-400 transition"
                  >
                    <FaPlus className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-xs text-slate-600">Agregar</span>
                  </div>
                )}

                {/* Previews */}
                {previewPromos?.map((src, index) => (
                  <div
                    key={index}
                    className="group relative w-full h-28 rounded-xl border-2 border-dashed border-slate-300 
                              bg-gradient-to-br from-orange-50 to-blue-50 shadow-inner overflow-hidden 
                              flex items-center justify-center hover:border-orange-400 transition"
                  >
                    <img
                      src={src}
                      alt={`Promocional ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPromoStartIndex(index);
                        setIsPromosViewerOpen(true);
                      }}
                    />

                    {/* Botón eliminar */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                      >
                        <FaTrash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input oculto */}
              <input
                id="imagenesPromocionalesInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple={!!user?.tienePlan && typeof user?.limitePromocional == 'number' && user?.limitePromocional > 1} //  Solo permite múltiples si tiene plan
                className="hidden"
                onChange={(e) => {
                  handleFilesChange(e.target.files || undefined);
                  e.target.value = "";
                }}
              />

              <CustomImageViewer
                images={previewPromos.map((src, i) => ({
                  src,
                  alt: `Promocional ${i + 1}`,
                }))}
                startIndex={promoStartIndex}
                isOpen={isPromosViewerOpen}
                onClose={() => setIsPromosViewerOpen(false)}
              />
            </section>
          );
        }}
      />


        {/* Video Promocional */}
        {
          user?.tieneVideoPromocional && (
            <>
              <Controller
                name="videoPromocional"
                control={control}
                render={({ field }) => {
                  const handleFileChange = (file?: File) => {
                    setVideoFile(file || null);
                    if (!file) {
                      field.onChange(null);
                      
                      setPreviewVideo(null);
                      return;
                    }

                    if (file.size > 30 * 1024 * 1024) {
                      alert("El video no debe superar los 30 MB");
                      return;
                    }

                    // Si subo archivo, limpio el input de URL
                    const inputUrl = document.getElementById("videoPromocionalUrl") as HTMLInputElement;
                    if (inputUrl) inputUrl.value = "";

                    field.onChange(file);
                    const url = URL.createObjectURL(file);
                    setPreviewVideo(url);
                  };

                  const handleUrlChange = (url: string) => {
                    if (!url) {
                      setVideoUrl(null);
                      field.onChange(null);
                      setPreviewVideo(null);
                      return;
                    }

                    setVideoFile(null);
                    field.onChange(url);
                    setVideoUrl(url);
                    setPreviewVideo(url);
                  };

                  const triggerFileSelect = () => {
                    document.getElementById("videoPromocionalInput")?.click();
                  };

                  return (
                    <section className="mt-6 max-w-[500px]">
                      <h4 className="font-semibold text-base mb-2">Video Promocional</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Opcional: puedes subir un video en formato <span className="font-medium">MP4</span> 
                        (recomendado, máx. 30 MB) o pegar un enlace de YouTube.
                      </p>

                      {/* Input URL YouTube */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enlace de YouTube
                        </label>
                        <input
                          id="videoPromocionalUrl"
                          type="url"
                          placeholder="https://youtube.com/..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                          onChange={(e) => handleUrlChange(e.target.value)}
                        />
                      </div>

                      {/* Caja clickeable para subir archivo */}
                      <div
                        onClick={!previewVideo ? triggerFileSelect : undefined} // ✅ solo si no hay video
                        className={`relative w-full h-72 rounded-xl border-2 border-dashed border-slate-300 
                          bg-gradient-to-br from-orange-50 to-blue-50 shadow-inner flex items-center justify-center 
                          overflow-hidden transition ${!previewVideo ? "cursor-pointer hover:border-orange-400" : ""}`}
                      >
                        {previewVideo ? (
                          typeof previewVideo === "string" && previewVideo.includes("youtube") ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src={getYoutubeEmbedUrl(previewVideo) || ""}
                              title="YouTube preview"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={previewVideo}
                              controls
                              className="w-full h-full object-contain"
                            />
                          )
                        ) : (
                          <div className="flex flex-col items-center text-slate-500">
                            <FaVideo className="w-10 h-10 mb-1" />
                            <span className="text-sm font-medium">Haz click para subir</span>
                          </div>
                        )}

                        {/* Botones flotantes */}
                        {previewVideo && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileSelect();
                              }}
                              className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
                            >
                              <FaCamera className="w-4 h-4 text-slate-700" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (previewVideo && previewVideo.includes("mappidevbucket")) {
                                  const code = extractServiceCode(previewVideo);
                                  if (code) setIdsDeleteMultimedia({
                                    ...idsDeleteMultimedia,
                                    videoPromocional: code
                                  });
                                }
                                handleFileChange(undefined);
                              }}
                              className="p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                            >
                              <FaTrash className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Input oculto */}
                      <input
                        id="videoPromocionalInput"
                        type="file"
                        accept="video/mp4,video/webm,video/mov"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleFileChange(file);
                          e.target.value = "";
                        }}
                      />
                    </section>
                  );
                }}
              />
            </>
          )
        }

        {/* Carta de Recomendación */}
        <Controller
          name="cartaRecomendacion"
          control={control}
          render={({ field }) => {
            const handleFileChange = (file?: File) => {
              field.onChange(file || null);
            };

            const triggerFileSelect = () => {
              document.getElementById("cartaRecomendacionInput")?.click();
            };

            return (
              <section className="mt-6 max-w-[500px]">
          <h4 className="font-semibold text-base mb-2">Carta de Recomendación</h4>
          <p className="text-sm text-gray-600 mb-4">
            Opcional: PDF o Word con recomendaciones o certificaciones.
          </p>

          <div
            onClick={triggerFileSelect}
            className="group cursor-pointer relative w-full h-28 rounded-xl border-2 border-dashed border-slate-300 
              bg-gradient-to-br from-orange-50 to-blue-50 shadow-inner flex items-center justify-center overflow-hidden 
              hover:border-orange-400 transition"
          >
            {field.value ? (
              <div className="flex items-center gap-3">
                <FaFilePdf className="w-8 h-8 text-red-500" />
                <span className="text-sm font-medium truncate max-w-[300px]">
                  {(field.value as File).name || multimediaService?.cartaRecomendacion.nombre}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <FiFileText className="w-10 h-10 mb-1" />
                <span className="text-sm font-medium">Subir documento</span>
              </div>
            )}

            {field.value && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileSelect();
                  }}
                  className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
                >
                  <FaCamera className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                     if (
                        typeof field.value === "string" &&
                        field.value.includes("mappidevbucket")
                      ) {
                        const code = extractServiceCode(field.value);
                        if (code) {
                          setIdsDeleteMultimedia({
                            ...idsDeleteMultimedia,
                            cartaRecomendacion: code.toString()
                          });
                        }
                      }

                    handleFileChange(undefined);
                  }}
                  className="p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                >
                  <FaTrash className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}
          </div>

          <input
            id="cartaRecomendacionInput"
            type="file"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleFileChange(file);
              e.target.value = "";
            }}
          />
        </section>

            );
          }}
        />

        {/* Botón Guardar */}
        <div className="pt-2 w-full md:max-w-[500px] flex items-center justify-center space-x-4">
          <div className="w-full">
              <CustomButton text={isServiceEdit? 'Salir' : 'Guardar y Salir'} type="button" onClick={isServiceEdit ? ()=>setSalir(true) : handleClickGuardarYSalir} fullWidth fontSize="14px" variant="secondary-outline" loading={isLoadingGuardarSalir} />
          </div>
          <div className="w-full">
              <CustomButton text="Continuar" type="submit" fullWidth fontSize="14px" variant="primary"/>
          </div>
        </div>
      </form>
      <ModalGuardarBorrador
        isOpen={ isServiceEdit ? salir : showModalBorrador}
        onClose={isServiceEdit ? ()=>setSalir(false) :() => setShowModalBorrador(false)}
        onConfirm={() => {
          if(!isServiceEdit){
            setShowModalBorrador(false);
            handleClickGuardarYSalir();
          }else{
            handleClickSalir()
          }
        }}
        mode={isServiceEdit? 'salir':'borrador'}
      />
    </>
  );
};

export default Multimedia;
