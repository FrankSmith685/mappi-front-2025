/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { useAppState } from "../../../../../../../../hooks/useAppState";
import { useUser } from "../../../../../../../../hooks/useUser";
import { useNotification } from "../../../../../../../../hooks/useNotificacionHooks/useNotification";
import { CustomInput } from "../../../../../../../ui/CustomInput";
import { CustomButton } from "../../../../../../../ui/CustomButton";
import { CustomSelected } from "../../../../../../../ui/CustomSelected";
import { useUbigeo } from "../../../../../../../../hooks/useUbigeo";
import { debounce } from "../../../../../../../../helpers/debounce";
import type { UpdateUsuarioCompleto } from "../../../../../../../../interfaces/IUser";
import { useNavigate } from "react-router-dom";
import PerfilEmpresa from "./PerfilEmpresa";
import type { CreateEmpresaRequest, UpdateEmpresaRequest } from "../../../../../../../../interfaces/IEmpresa";
import { useEmpresa } from "../../../../../../../../hooks/useEmpresa";
import { useServicio } from "../../../../../../../../hooks/useServicio";
import { useAviso } from "../../../../../../../../hooks/useAviso";
import type { CreateServicioRequest } from "../../../../../../../../interfaces/IServicio";
import { useArchivo } from "../../../../../../../../hooks/useArchivo";
import type { DireccionRequest } from "../../../../../../../../interfaces/IDireccion";
import { useDireccion } from "../../../../../../../../hooks/useDireccion";
import ModalGuardarBorrador from "../../../../../components/modalGuardarBorrador";

const baseSchema = {
  // Independiente
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo letras y espacios"),
  apellido: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo letras y espacios"),
  dni: z.string()
    .regex(/^\d+$/, "El DNI debe contener solo números")
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos"),
  celular: z.string()
    .regex(/^\d+$/, "El celular solo puede contener números")
    .min(6, "El celular es demasiado corto")
    .max(15, "El celular es demasiado largo"),

  // Ubigeo
  departamento: z.string().nonempty("Selecciona un departamento"),
  provincia: z.string().nonempty("Selecciona una provincia"),
  distrito: z.string().nonempty("Selecciona un distrito"),
  direccion: z.string(),
};

const PerfilIndependiente = () => {
  const { 
    user, 
    setUser, 
    profileType, 
    departamentos, 
    provincias, 
    distritos, 
    setProvincias, 
    setDistritos, 
    ubigeo_usuario, 
    setUbigeo_Usuario, 
    company, 
    setCompany, 
    setProgressPrincipalService, 
    progressPrincipalService, 
    setModifiedUser, 
    setModifiedCompany,
    modifiedCompany,
    modifiedUser, 
    setService, 
    setModifiedService, 
    modifiedService,
    multimediaService,
    setMultimediaService, 
    setDireccionService,
    direccionService,
    isServiceEdit,
    } = useAppState();
  const perfilIndSchema = z.object({
    ...baseSchema,
    razonSocial: z.string().optional(),
    ruc: z.string().optional(),
    telefonoEmpresa: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (profileType === "empresa") {
      if (!data.razonSocial || data.razonSocial.trim().length < 2) {
        ctx.addIssue({
          path: ["razonSocial"],
          code: "custom",
          message: "La Razón Social es obligatoria",
        });
      }
      if (!data.ruc || !/^\d{11}$/.test(data.ruc)) {
        ctx.addIssue({
          path: ["ruc"],
          code: "custom",
          message: "El RUC debe tener 11 dígitos",
        });
      }
      if (!data.telefonoEmpresa || !/^\d+$/.test(data.telefonoEmpresa)) {
        ctx.addIssue({
          path: ["telefonoEmpresa"],
          code: "custom",
          message: "El teléfono de la empresa es obligatorio",
        });
      }
    }
  });
  type PerfilIndFormData = z.infer<typeof perfilIndSchema>;
  const direccionRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingGuardarSalir, setIsLoadingGuardarSalir] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const { updateUser } = useUser();
  const { showMessage } = useNotification();
  const { getProvincias, getDistritos, getUbigeoByCodigo, getCoordsByUbigeo, getUbigeoByCoords, searchDirecciones, getCodUbigeo } = useUbigeo();
  const [lat,setLat]= useState(0);
  const [lng,setLng]= useState(0);
  const [direccionError, setDireccionError] = useState("");
  const [activeDireccion,setActiveDireccion] = useState(true);
  const navigate = useNavigate();
  const {updateEmpresa, createEmpresa} = useEmpresa();
  const { createAviso } = useAviso();
  const {createServicio} = useServicio();
  const {subirArchivosMultiples} = useArchivo();
  const {createDireccion} = useDireccion();
  const [salir, setSalir] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<PerfilIndFormData>({
    mode: "onChange",
    resolver: zodResolver(perfilIndSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      celular: "",
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",

      razonSocial: "",
      ruc: "",
      telefonoEmpresa: "",
    },
  });

  const selectedDepartamento = watch("departamento");
  const selectedDistrito = watch("distrito");

  
  useEffect(() => {
    if (modifiedUser) {
      reset({
        nombre: modifiedUser.nombre || "",
        apellido: modifiedUser.apellido || "",
        dni: modifiedUser.dni || "",
        celular: modifiedUser.telefono || "",
        departamento: ubigeo_usuario.departamento || "", 
        provincia: ubigeo_usuario.provincia || "",       
        distrito: ubigeo_usuario.distrito || "",
        direccion: ubigeo_usuario.direccion || "", 
        
        razonSocial: modifiedCompany?.razon_social,
        ruc: modifiedCompany?.ruc,
        telefonoEmpresa: modifiedCompany?.telefono,
      });
    }
  }, [modifiedUser, ubigeo_usuario, reset, modifiedCompany]);


  const [isInitialUbigeo, setIsInitialUbigeo] = useState(true);
  const [selectedDepartamentoAux,setSelectedDepartamentoAux] = useState('');
  const [selectedProviniciaAux,setSelectedProvinciaAux] = useState('');
  const [selectedDistritoAux,setSelectedDistritoAux] = useState('');

  const [loadingDireccion, setLoadingDireccion] = useState(false);
  const direccionValue = watch("direccion");
  const [sugerencias, setSugerencias] = useState<{ label: string; lat: number; lng: number }[]>([]);

  const [activeDirecciones,setActiveDirecciones] = useState(false);
  const [isInitial,setIsInitial] = useState(true);

  useEffect(() => {
    if (isInitialUbigeo && user?.idUbigeo) {
      getUbigeoByCodigo(modifiedUser?.idUbigeo ?? "150101", (dep, prov, dis) => {
        if (!dep || !prov || !dis) return;
        setSelectedDepartamentoAux(dep);
        setSelectedProvinciaAux(prov);
        setSelectedDistritoAux(dis);

        getProvincias(dep, (provData) => {
          setProvincias(provData);

          getDistritos(dep, prov, (distData) => {
            setDistritos(distData);
          });
        });

        setIsInitialUbigeo(false);
      });
    }
  }, [isInitialUbigeo,user?.idUbigeo]);

  useEffect(() => {
    if(isInitial){
      if (selectedDepartamentoAux && selectedProviniciaAux && selectedDistritoAux) {
        getCoordsByUbigeo(selectedDepartamentoAux, selectedProviniciaAux, selectedDistritoAux, (coords) => {
          getUbigeoByCoords(coords.lat, coords.lng, (_dep, _prov, _dis, direccion) => {
              setValue("departamento", selectedDepartamentoAux);
              setValue("provincia", selectedProviniciaAux);
              setValue("distrito", selectedDistritoAux);
              setValue("direccion", direccion || "");
              setLat(coords.lat);
              setLng(coords.lng);
              setIsInitial(false);
          });
        });
      }
    }
  }, [setValue,selectedDepartamentoAux, selectedProviniciaAux, selectedDistritoAux, isInitial]);

  useEffect(() => {
    if(activeDirecciones){
      if (!direccionValue) {
        setSugerencias([]);
        return;
      }
      let activo = true;
      setLoadingDireccion(true);
      searchDirecciones(
        direccionValue,
        selectedDepartamentoAux,
        selectedDistritoAux,
        (data) => {
          if (activo) {
            setSugerencias(data || []);
            setLoadingDireccion(false);
            setActiveDirecciones(false);
          }
        }
      );
      return () => {
        activo = false;
      };
    }
  }, [direccionValue, selectedDepartamentoAux, selectedDistritoAux, activeDirecciones]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (direccionRef.current && !direccionRef.current.contains(event.target as Node)) {
      // Si había texto pero no seleccionó ninguna sugerencia
      if (watch("direccion") && sugerencias.length === 0 && !activeDireccion) {
        setDireccionError("Escribe la dirección correctamente");
      }
      setSugerencias([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [sugerencias, watch, lat, lng, activeDireccion]);

  const onSubmit = async (formData: PerfilIndFormData) => {
    if (direccionError) {
        return;
      }

      try {
        setIsLoading(true);
        await getCodUbigeo(
          formData.departamento,
          formData.provincia,
          formData.distrito,
          (codUbigeo) => {
            setModifiedUser({
              ...modifiedUser,
              nombre:formData.nombre,
              apellido:formData.apellido,
              telefono:formData.celular,
              dni:formData.dni,
              idUbigeo:codUbigeo
            })
            setUbigeo_Usuario({
              ...ubigeo_usuario,
              cod_ubigeo:codUbigeo,
              departamento:formData.departamento,
              provincia:formData.provincia,
              distrito:formData.distrito,
              direccion:formData.direccion,
              latitud:lat,
              longitud:lng
            });

            if(profileType === "empresa"){
              setModifiedCompany({
                ...modifiedCompany,
                razon_social:formData.razonSocial,
                ruc:formData.ruc,
                telefono:formData.telefonoEmpresa,
              })
            }
            setProgressPrincipalService({
                ...progressPrincipalService,
                step: 2,
                currentPath: "/panel/publicador/principales/huarique",
            })
            navigate("/panel/publicador/principales/huarique")
          }
        );
      } catch (error) {
        console.error("Error obteniendo codUbigeo:", error);
      } finally{
        setIsLoading(false);
      }
  };

  const handleClickGurdarYSalir= async ()=>{
    const formData= getValues()
    if (direccionError) {
        return;
      }

      try {
        setIsLoadingGuardarSalir(true);
        await getCodUbigeo(
          formData.departamento,
          formData.provincia,
          formData.distrito,
          (codUbigeo) => {
            const payload: UpdateUsuarioCompleto = {
              USUA_Interno: user?.cod_usuario,
              USUA_Nombre: formData.nombre,
              USUA_Apellido: formData.apellido,
              USUA_Telefono: formData.celular,
              USUA_Dni: formData.dni,
              USUA_IdUbigeo: codUbigeo,
              USUA_Direccion: formData.direccion,
              USUA_Latitud: lat,
              USUA_Longitud: lng,
            };
            
            updateUser(payload, async(updatedUser) => {
              
              setUser({ ...user, ...updatedUser});
              setModifiedUser({ ...modifiedUser, ...updatedUser});
              setUbigeo_Usuario({
                ...ubigeo_usuario,
                cod_ubigeo:codUbigeo,
                departamento:formData.departamento,
                provincia:formData.provincia,
                distrito:formData.distrito,
                direccion:formData.direccion,
                latitud:lat,
                longitud:lng
              });
              if(profileType === "empresa"){
                if(company){
                  const payloadCompany:UpdateEmpresaRequest = {
                    EMPR_Interno: company?.cod_empresa || "",
                    EMPR_RazonSocial: formData.razonSocial,
                    EMPR_Ruc: formData.ruc,
                    DIUS_Direccion: formData.direccion,
                    DIUS_CodigoUbigeo: codUbigeo,
                    DIUS_Latitud: lat,
                    DIUS_Longitud: lng,
                  }
                  updateEmpresa(company?.cod_empresa || "", payloadCompany, (success, _message, empresa) => {
                    if (success && empresa) {
                      setCompany({
                        ...company,
                        razon_social:empresa.razon_social,
                        ruc:empresa.ruc,
                        telefono:empresa.telefono
                      })
                      setModifiedCompany({
                        ...company,
                        razon_social:empresa.razon_social,
                        ruc:empresa.ruc,
                        telefono:empresa.telefono
                      })
                    }
                  });
                }else{
                  const payloadCompany:CreateEmpresaRequest = {
                    EMPR_RazonSocial: String(formData.razonSocial),
                    EMPR_Ruc: String(formData.ruc),
                    EMPR_Telefono: formData.telefonoEmpresa,
                    DIUS_Direccion: formData.direccion,
                    DIUS_CodigoUbigeo: codUbigeo,
                    DIUS_Latitud: lat,
                    DIUS_Longitud: lng,
                }
                  createEmpresa(payloadCompany,(success, _message, empresa)=>{
                    if (success && empresa) {
                      setCompany(empresa);
                      setModifiedCompany(empresa);

                    }
                  })
                }
              }
              if(modifiedService){
                  const finalData: CreateServicioRequest = {
                    SERV_Nombre: modifiedService?.nombre ?? '',
                    SERV_Descripcion: modifiedService?.descripcion ?? '',
                    SUBC_Id: Number(modifiedService?.subcategoria?.cod_subcategoria),
                    SERV_Abierto24h: !!modifiedService?.abierto24h,
                    SERV_HoraInicio: modifiedService?.horaInicio ?? null,
                    SERV_HoraFin: modifiedService?.horaFin ?? null,
                    SERV_Delivery: !!modifiedService?.delivery,
                  };

                  await createServicio(finalData, (success, message, servicio) => {
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
                                ? multimediaService.imagenes.filter((img) => img instanceof File)
                                : undefined,
                            video: multimediaService.videoPromocional || undefined,
                            documento: multimediaService?.cartaRecomendacion instanceof File
                              ? multimediaService.cartaRecomendacion
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
                          AVIS_Estado: "borrador",
                          EMPR_Interno: profileType === "empresa" ? String(company?.cod_empresa) : null,
                          SERV_Interno: servicio?.cod_servicio,
                          isCompleted: direccionService ? 4 : multimediaService ? 3 : 2,
                        },
                        (success, message, avisoData) => {
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
                setService(null);
                setModifiedService(null);
                navigate("/")
                showMessage("Se guardado los datos correctamente", "success");
                setProgressPrincipalService({
                    ...progressPrincipalService,
                    step: 1,
                    currentPath: "/panel/publicador/principales/perfilnegocio",
                });
              }
            });
          }
        );
      } catch (error) {
        console.error("Error obteniendo codUbigeo:", error);
      } finally{
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
        {/* ── Datos Personales */}
        <section>
          <h4 className="font-semibold text-base mb-4">Datos Personales</h4>
          <div className="grid grid-cols-1 gap-4 w-full md:max-w-[500px]">
            <Controller name="nombre" control={control} render={({ field }) => <CustomInput {...field} label="Nombre" placeholder="Ej: Juan" error={!!errors.nombre} helperText={errors.nombre?.message} />} />
            <Controller name="apellido" control={control} render={({ field }) => <CustomInput {...field} label="Apellido" placeholder="Ej: Pérez" error={!!errors.apellido} helperText={errors.apellido?.message} />} />
            <Controller name="dni" control={control} render={({ field }) => <CustomInput {...field} label="DNI" placeholder="Ej: 12345678" error={!!errors.dni} helperText={errors.dni?.message} />} />
            <Controller name="celular" control={control} render={({ field }) => <CustomInput {...field} label="Celular" placeholder="Ej: 987654321" error={!!errors.celular} helperText={errors.celular?.message} />} />
          </div>
        </section>
        {
          profileType === "empresa" && (
            <PerfilEmpresa 
              control={control}
              errors={errors}
            />
          )
        }
        {/* ── Ubicación */}
        <section>
          <h4 className="font-semibold text-base mb-4">Ubicación</h4>
          <div className="grid grid-cols-1 gap-4 w-full md:max-w-[500px]">
            {/* Departamento */}
              <Controller
                  name="departamento"
                  control={control}
                  render={({ field }) => (
                      <CustomSelected
                      value={field.value}
                      // Cuando cambia departamento
                        onChange={(e) => {
                        const value = String(e.target.value);
                        field.onChange(value);
                        setSelectedDepartamentoAux(String(e.target.value));

                        getProvincias(value, (data) => {
                            setProvincias(data);
                            if (data.length > 0) {
                            setValue("provincia", data[0]);
                            setValue("distrito", "");
                            setSelectedProvinciaAux(data[0]);
                            setSelectedDistritoAux("");

                            getDistritos(value, data[0], (distData) => {
                                setDistritos(distData);
                                if (distData.length > 0) {
                                setValue("distrito", distData[0]);
                                setSelectedDistritoAux(distData[0])
                                setIsInitial(true);
                                setActiveDireccion(true);
                                }
                            });
                            }
                        });
                      }}
                      options={departamentos.map((d) => ({ value: d, label: d }))}
                      label="Departamento"
                      fullWidth
                      error={!!errors.departamento}
                      helperText={errors.departamento?.message}
                      />
                  )}
                  />


            {/* Provincia */}
            <Controller
              name="provincia"
              control={control}
              render={({ field }) => (
                  <CustomSelected
                  value={field.value}
                  onChange={(e) => {
                      const value = String(e.target.value);
                      field.onChange(value);
                      setSelectedProvinciaAux(String(e.target.value));

                      getDistritos(selectedDepartamento, value, (data) => {
                        setDistritos(data);
                        if (data.length > 0) {
                          setValue("distrito", data[0]);
                          setSelectedDistritoAux(data[0])
                          setIsInitial(true);
                          setActiveDireccion(true);
                        }
                      });
                  }}
                  options={provincias.map((p) => ({ value: p, label: p }))}
                  label="Provincia"
                  fullWidth
                  error={!!errors.provincia}
                  helperText={errors.provincia?.message}
                  />
              )}
              />


            {/* Distrito */}
            <Controller
              name="distrito"
              control={control}
              render={({ field }) => (
                  <CustomSelected
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedDistritoAux(String(e.target.value));
                    setIsInitial(true);
                    setActiveDireccion(true);
                  }}
                  options={distritos.map((d) => ({ value: d, label: d }))}
                  label="Distrito"
                  fullWidth
                  error={!!errors.distrito}
                  helperText={errors.distrito?.message}
                  
                  />
              )}
            />


            {/* Dirección */}
            <Controller
              name="direccion"
              control={control}
              render={({ field }) => {
                const handleSearch = debounce(async (value: string) => {
                  if (value.length < 1) {
                    setSugerencias([]);
                    return;
                  }
                  setLoadingDireccion(true);
                  try {
                    await searchDirecciones(
                      value,
                      selectedDepartamento,
                      selectedDistrito,
                      (data) => {
                        setSugerencias(data || []);
                      }
                    );
                  } finally {
                    setLoadingDireccion(false);
                  }
                }, 400);

                return (
                  <div className="" ref={direccionRef}>
                    <CustomInput
                      {...field}
                      label="Dirección"
                      placeholder="Ej: Av. Siempre Viva 123"
                      error={!!errors.direccion || !!direccionError}
                      helperText={errors.direccion?.message || direccionError}
                      fullWidth={true}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!e.target.value.trim()) {
                          setDireccionError("La dirección no puede estar vacía");
                        }
                        if (e.target.value.trim() && sugerencias.length === 0 && !activeDireccion) {
                          setDireccionError("Escribe la dirección correctamente");
                        }
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        handleSearch(e.target.value);
                        setActiveDirecciones(true);
                        setDireccionError("");
                        setActiveDireccion(false);
                      }}
                    />

                    {/* Dropdown de sugerencias */}
                    {sugerencias.length > 0 && (
                      <ul className="z-10 bg-white mt-4 border border-[#FF6C4F] rounded-md w-full max-h-40 overflow-y-auto shadow">
                        {sugerencias.map((s, i) => (
                          <li
                            key={i}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              field.onChange(s.label);
                              setSugerencias([]);
                              setLat(s.lat);
                              setLng(s.lng);
                              setDireccionError("");
                              setActiveDireccion(true);
                            }}
                          >
                            {s.label}
                          </li>
                        ))}
                      </ul>
                    )}

                    {loadingDireccion && (
                      <p className="text-xs text-gray-400 mt-1">Buscando direcciones...</p>
                    )}
                  </div>
                );
              }}
            />



          </div>
        </section>

        {/* ── Botón Guardar */}
        <div className="pt-2 w-full md:max-w-[500px] flex items-center justify-center space-x-4">
          <div className="w-full">
              <CustomButton text={isServiceEdit? 'Salir' : 'Guardar y Salir'} type="button" onClick={isServiceEdit ? ()=>setSalir(true) : handleClickGurdarYSalir} fullWidth fontSize="14px" variant="secondary-outline" loading={isLoadingGuardarSalir} />
          </div>
          <div className="w-full">
              <CustomButton text="Continuar" type="submit" fullWidth fontSize="14px" variant="primary" loading={isLoading}/>
          </div>
        </div>
      </form>
      <ModalGuardarBorrador
        isOpen={salir}
        mode="salir"
        onClose={()=>setSalir(false)}
        onConfirm={handleClickSalir}
      />
    </>
  );
};

export default PerfilIndependiente;
