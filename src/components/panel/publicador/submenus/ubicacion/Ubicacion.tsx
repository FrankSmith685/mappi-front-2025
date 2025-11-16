/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { CustomSelected } from "../../../../ui/CustomSelected";
import { CustomInput } from "../../../../ui/CustomInput";
// import MapaUbicacion from "./MapaUbicacion";
import { useUbigeo } from "../../../../../hooks/useUbigeo";
import { debounce } from "../../../../../helpers/debounce";
import { useLocation } from "../../../../../hooks/useLocationHooks/useLocation";
import { useAppState } from "../../../../../hooks/useAppState";
// import CustomMapa from "../../../../ui/CustomMapa";
import { CustomButton } from "../../../../ui/CustomButton";
import { getSubcategoriaImage } from "../../../../../helpers/getCategoria";
import { useDireccion } from "../../../../../hooks/useDireccion";
import type { DireccionRequest } from "../../../../../interfaces/IDireccion";
import type { CreateServicioRequest } from "../../../../../interfaces/IServicio";
import { useServicio } from "../../../../../hooks/useServicio";
import { useAviso } from "../../../../../hooks/useAviso";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { useNavigate } from "react-router-dom";
import type { UpdateUsuarioCompleto } from "../../../../../interfaces/IUser";
import { useUser } from "../../../../../hooks/useUser";
import type { CreateEmpresaRequest, EmpresaData, UpdateEmpresaRequest } from "../../../../../interfaces/IEmpresa";
import { useEmpresa } from "../../../../../hooks/useEmpresa";
import { useArchivo } from "../../../../../hooks/useArchivo";
import ModalGuardarBorrador from "../../components/modalGuardarBorrador";
import CustomSimpleMapa from "../../../../ui/CustomSimpleMap";


type FormValues = {
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
};

const Ubicacion: React.FC = () => {
  const { control,formState: { errors }, handleSubmit, setValue, getValues, watch, reset } = useForm<FormValues>({
    defaultValues: {
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",
    },
  });

  const {
    getProvincias,
    getDistritos,
    searchDirecciones,
    getUbigeoByCoords,
    getCoordsByUbigeo,
    getCodUbigeo
  } = useUbigeo();

  const {
    createDireccion
  } = useDireccion();

  const navigate = useNavigate();

  const {createServicio} = useServicio();
  const {createAviso} = useAviso();

  const {
    lat,
    lng,
  } = useLocation();

  const {
    departamentos,
    setProvincias,
    setDistritos,
    distritos,
    provincias,
    modifiedService,
    profileType,
    company,
    setService,
    setModifiedService,
    setProgressPrincipalService,
    progressPrincipalService,
    setDireccionService,
    setProgressService,
    progressService,
    direccionService,
    modifiedUser,
    ubigeo_usuario,
    setUser,
    setModifiedUser,
    user,
    modifiedCompany,
    setModifiedCompany,
    setCompany,
    multimediaService,
    setMultimediaService,
    isServiceEdit,
    setMultimediaAvisoPreview,
    multimediaAvisosPreview
  } = useAppState();

  const selectedDepartamento = watch("departamento");
  const selectedDistrito = watch("distrito");

  const [sugerencias, setSugerencias] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [loadingDireccion, setLoadingDireccion] = useState(false);
  const [direccionError, setDireccionError] = useState("");
  const direccionRef = useRef<HTMLDivElement | null>(null);

  const direccionValue = watch("direccion");

  const [activeDireccion,setActiveDireccion] = useState(true);
  const [activeDirecciones,setActiveDirecciones] = useState(false);
  const [latAux,setLatAux]= useState(0);
  const [lngAux,setLngAux]= useState(0);

  const [selectedDepartamentoAux,setSelectedDepartamentoAux] = useState('');
  const [selectedProviniciaAux,setSelectedProvinciaAux] = useState('');
  const [selectedDistritoAux,setSelectedDistritoAux] = useState('');

  const [isLoadingGuardarSalir,setIsLoadingGuardarSalir] = useState(false);

  const {showMessage} = useNotification();
  const {updateUser, getUserInfo} = useUser();
  const {updateEmpresa, createEmpresa} = useEmpresa();
  const {subirArchivosMultiples} = useArchivo();
  const [showModalBorrador, setShowModalBorrador] = useState(false);

   const [salir, setSalir] = useState(false);

   const [depCtx, setDepCtx] = useState<string>("");
  const [provCtx, setProvCtx] = useState<string>("");
  const [distCtx, setDistCtx] = useState<string>("");
  const [dirCtx, setDirCtx] = useState<string>("");


   const hasFetchedUbigeo = useRef(false);
   
     useEffect(() => {
       if (!lat || !lng) return;
       if (hasFetchedUbigeo.current) return;
   
       hasFetchedUbigeo.current = true;
   
       getUbigeoByCoords(
         lat,
         lng,
         (dep, prov, dist, direccion) => {
           console.log("Ubigeo detectado:", dep);
           setDepCtx(dep);
           setProvCtx(prov);
           setDistCtx(dist);
           setDirCtx(direccion ?? "");
         },
         (err) => {
           console.warn("No se pudo obtener el ubigeo:", err);
         }
       );
     }, [lat, lng]);


  useEffect(() => {
    if (direccionService && direccionService.direccion) {
      setValue("departamento", direccionService.departamento || "");
      setValue("provincia", direccionService.provincia || "");
      setValue("distrito", direccionService.distrito || "");
      setValue("direccion", direccionService.direccion || "");
      setLatAux(Number(direccionService.latitud) || 0);
      setLngAux(Number(direccionService.longitud) || 0);
      setSelectedDepartamentoAux(String(direccionService.departamento));
      setSelectedProvinciaAux(String(direccionService.provincia));
      setSelectedDistritoAux(String(direccionService.distrito));

      isInitialRef.current = false;

    } else {
      setLatAux(Number(lat));
      setLngAux(Number(lng));
      setSelectedDepartamentoAux(String(depCtx));
      setSelectedProvinciaAux(String(provCtx));
      setSelectedDistritoAux(String(distCtx));
      if (depCtx) setValue("departamento", depCtx);
      if (provCtx) setValue("provincia", provCtx);
      if (distCtx) setValue("distrito", distCtx);
      if (dirCtx) setValue("direccion", dirCtx);
    }
  }, [depCtx,provCtx,distCtx,dirCtx]);

  const isInitialRef = useRef(false);
  
  useEffect(() => {
    if (isInitialRef.current) {
      getCoordsByUbigeo(
        selectedDepartamentoAux,
        selectedProviniciaAux,
        selectedDistritoAux,
        (coords) => {
          setLatAux(coords.lat);
          setLngAux(coords.lng);
          getUbigeoByCoords(coords.lat, coords.lng, (_dep, _prov, _dis, direccion) => {
            setValue("direccion", direccion || "");
          });
          isInitialRef.current = false;
        }
      );
    }
  }, [selectedDepartamentoAux, selectedProviniciaAux, selectedDistritoAux]);

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

  const [pruebaProvincia,setPruebaProvincia] = useState(true);
  const [pruebaDistrito,setPruebaDistrito] = useState(true);

  // cargar provincias
  useEffect(() => {
    if(pruebaProvincia){
      if (!selectedDepartamentoAux) {
        setProvincias([]);
        setDistritos([]);
        return;
      }

      getProvincias(selectedDepartamentoAux, (provData: string[]) => {
        setProvincias(provData || []);

        if (provData && provData.length > 0 && !getValues("provincia")) {
          const firstProv = provData[0];
          setValue("provincia", firstProv);
        }
      });
      setPruebaProvincia(false);
    }
  }, [selectedDepartamentoAux,pruebaProvincia]);

    // cargar distritos
  useEffect(() => {
    if(pruebaDistrito){
      if (!selectedProviniciaAux || !selectedDepartamentoAux) {
        setDistritos([]);
        return;
      }

      getDistritos(selectedDepartamentoAux, selectedProviniciaAux, (distData: string[]) => {
        setDistritos(distData || []);
        if (distData && distData.length > 0 && !getValues("distrito")) {
          setValue("distrito", distData[0]);
        }
      });
      setPruebaDistrito(false);
    }
  }, [selectedProviniciaAux, selectedDepartamentoAux, pruebaDistrito]);

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
  }, [sugerencias, watch, latAux, lngAux, activeDireccion]);

  const onSubmit = () => {
    setDireccionService({
      departamento: selectedDepartamentoAux,
      provincia: selectedProviniciaAux,
      distrito: selectedDistritoAux,
      direccion: direccionValue,
      latitud: latAux,
      longitud: lngAux,
    });
    setProgressService({ ...progressService, step: 4, currentPath: "/panel/publicador/publicar" });
    setTimeout(() => {
      navigate("/panel/publicador/publicar");
    }, 0);
  };

  const handleClickGurdarYSalir = async () => {
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
        SERV_Estado: false,
      };
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
          await getCodUbigeo(
            selectedDepartamentoAux,
            selectedProviniciaAux,
            selectedDistritoAux,
            async(codUbigeo) => {
              const payload: DireccionRequest = {
                cod_entidad:servicio?.cod_servicio || '',
                codigoUbigeo: codUbigeo,
                direccion: direccionValue,
                latitud: latAux,
                longitud: lngAux,
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
          createAviso(
            {
              AVIS_Estado: "borrador",
              EMPR_Interno: profileType === "empresa" ? String((empresaActual as EmpresaData)?.cod_empresa ?? "") : null,
              SERV_Interno: servicio?.cod_servicio,
              isCompleted: 4,
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
                showMessage("Se ha creado el aviso como borrador correctamente", "success");
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
      console.error("Error al guardar ubicación:", error);
    } finally {
      setIsLoadingGuardarSalir(false);
    }
  };

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
    <section>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 w-full md:max-w-[500px]">
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
                        isInitialRef.current = true;
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
                      isInitialRef.current=true;
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
                isInitialRef.current = true;
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
                          setLatAux(s.lat);
                          setLngAux(s.lng);
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

        {/* Mapa */}
        {latAux != null && lngAux != null && (
          <div className="mt-0 h-[400px] w-full z-40">
            <CustomSimpleMapa
              lat={latAux}
              lng={lngAux}
              onMove={(newLat: number, newLng: number) => {
                if (typeof getUbigeoByCoords === "function") {
                  getUbigeoByCoords(newLat, newLng, (dep, prov, dist, direccion) => {
                    setValue("departamento", dep);
                    setValue("provincia", prov);
                    setValue("distrito", dist);
                    setValue("direccion", direccion || "");
                    setSelectedDepartamentoAux(dep || "");
                    setLatAux(newLat);
                    setLngAux(newLng);
                    getProvincias(dep, (data) => {
                      setProvincias(data);
                      if (data.length > 0) {
                      setValue("provincia", data[0]);
                      setValue("distrito", "");
                      setSelectedProvinciaAux(data[0]);
                      setSelectedDistritoAux("");

                      getDistritos(dep, data[0], (distData) => {
                          setDistritos(distData);
                          if (distData.length > 0) {
                          setValue("distrito", distData[0]);
                          setSelectedDistritoAux(distData[0]);
                          setActiveDireccion(true);
                          }
                      });
                      }
                  });
                  });
                }
              }}
              customIcon={getSubcategoriaImage(modifiedService?.subcategoria)}
            />

          </div>
        )}

        <div className="pt-2 w-full md:max-w-[500px] flex items-center justify-center space-x-4">
          <div className="w-full">
              <CustomButton text={isServiceEdit? 'Salir' : 'Guardar y Salir'} type="button" onClick={isServiceEdit ? ()=>setSalir(true) : ()=>setShowModalBorrador(true)} fullWidth fontSize="14px" variant="secondary-outline" loading={isLoadingGuardarSalir} />
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
            handleClickGurdarYSalir();
          }else{
            handleClickSalir()
          }
        }}
        mode={isServiceEdit? 'salir':'borrador'}
      />
    </section>
  );
};

export default Ubicacion;
