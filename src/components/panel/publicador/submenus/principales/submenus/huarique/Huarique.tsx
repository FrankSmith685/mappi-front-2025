/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { CustomInput } from "../../../../../../ui/CustomInput";
import { CustomSelected } from "../../../../../../ui/CustomSelected";
import { CustomButton } from "../../../../../../ui/CustomButton";
import type { CategoriaWithSubcategorias } from "../../../../../../../interfaces/ICategoria";
import type { SubcategoriaAttributes } from "../../../../../../../interfaces/ISubcategoria";
import { useCategoria } from "../../../../../../../hooks/useCategoria.";
import { CustomCheckbox } from "../../../../../../ui/CustomCheckbox";
import { useServicio } from "../../../../../../../hooks/useServicio";
import { useAppState } from "../../../../../../../hooks/useAppState";
import { useAviso } from "../../../../../../../hooks/useAviso";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../../../../../hooks/useNotificacionHooks/useNotification";
import type { ServicioData } from "../../../../../../../interfaces/IServicio";
import type { UpdateUsuarioCompleto } from "../../../../../../../interfaces/IUser";
import { useUser } from "../../../../../../../hooks/useUser";
import type { CreateEmpresaRequest, EmpresaData, UpdateEmpresaRequest } from "../../../../../../../interfaces/IEmpresa";
import { useEmpresa } from "../../../../../../../hooks/useEmpresa";
import { useArchivo } from "../../../../../../../hooks/useArchivo";
import { useUbigeo } from "../../../../../../../hooks/useUbigeo";
import type { DireccionRequest } from "../../../../../../../interfaces/IDireccion";
import { useDireccion } from "../../../../../../../hooks/useDireccion";
import ModalGuardarBorrador from "../../../../components/modalGuardarBorrador";

const huariqueSchema = z
  .object({
    nombre: z.string().min(2, "El nombre del Huarique debe tener al menos 2 caracteres"),
    categoria: z.string().nonempty("Selecciona una categoría"),
    subcategoria: z.string().nonempty("Selecciona una subcategoría"),
    abierto24h: z.string().nonempty("Selecciona una opción"),
    horaInicio: z.string().optional(),
    horaFin: z.string().optional(),
    delivery: z.boolean(),
    descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  })
  .superRefine((data, ctx) => {
    if (data.abierto24h === "no") {
      if (!data.horaInicio || !data.horaFin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes seleccionar hora de inicio y cierre",
          path: ["horaFin"],
        });
        return;
      }

      const validTime = /^([01]\d|2[0-3]):([0-5]\d)$|^24:00$/;
      if (!validTime.test(data.horaInicio) || !validTime.test(data.horaFin)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Formato de hora inválido",
          path: ["horaFin"],
        });
        return;
      }

      const [h1, m1] = data.horaInicio.split(":").map(Number);
      const [h2, m2] = data.horaFin.split(":").map(Number);

      const startMinutes = h1 * 60 + m1;
      const endMinutes = h2 * 60 + m2;

      if (endMinutes <= startMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La hora de cierre debe ser mayor a la de inicio",
          path: ["horaFin"],
        });
      }
    }
  });

type HuariqueFormData = z.infer<typeof huariqueSchema>;

const HuariqueForm = () => {
  const { getAllCategorias } = useCategoria();
  const {createServicio} = useServicio();
  const {createAviso} = useAviso();
  const {
    setService, 
    setModifiedService, 
    setProgressPrincipalService,
    setProgressService, 
    progressPrincipalService, 
    profileType, 
    company, 
    modifiedService,
    progressService,
    ubigeo_usuario,
    setUser,
    setModifiedUser,
    modifiedUser,
    user,
    setCompany,
    setModifiedCompany,
    modifiedCompany,
    direccionService,
    multimediaService,
    isServiceEdit,
    setMultimediaService,
    setDireccionService
  } = useAppState();

  const navigate= useNavigate();
   const { showMessage } = useNotification();

  const [categorias, setCategorias] = useState<CategoriaWithSubcategorias[]>([]);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuardarSalir,setIsLoadingGuardarSalir] = useState(false);

  const {updateUser, getUserInfo} = useUser();
  const {updateEmpresa, createEmpresa} = useEmpresa();
  const {subirArchivosMultiples} = useArchivo();
  const {getCodUbigeo} = useUbigeo();
  const {createDireccion} = useDireccion();
  const [showModalBorrador, setShowModalBorrador] = useState(false);
  const [salir, setSalir] = useState(false);


  const newLocal = useForm<HuariqueFormData>({
    mode: "onChange",
    resolver: zodResolver(huariqueSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      subcategoria: "",
      abierto24h: "",
      horaInicio: "00:00",
      horaFin: "01:00",
      delivery: false,
      descripcion: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger
  } = newLocal;

  useEffect(() => {
    getAllCategorias((data) => {
      const filtradas = data.filter((c) => c.CATE_Id !== 6);
      setCategorias(filtradas);
    });
  }, []);

  useEffect(() => {
    if (modifiedService && categorias.length > 0) {
      let categoriaId = "";
      let subcategoriaId = "";

      if (modifiedService.subcategoria?.cod_subcategoria) {
        subcategoriaId = String(modifiedService.subcategoria.cod_subcategoria);

        // 🔎 Buscar categoría que contenga esa subcategoría
        const categoriaEncontrada = categorias.find((c) =>
          c.Subcategorias.some(
            (s) => s.SUBC_Id === modifiedService.subcategoria?.cod_subcategoria
          )
        );

        if (categoriaEncontrada) {
          categoriaId = String(categoriaEncontrada.CATE_Id);

          // 👇 Inicializar subcategorías disponibles en el state
          setSubcategorias(categoriaEncontrada.Subcategorias || []);
        }
      }

      reset({
        nombre: modifiedService.nombre || "",
        categoria: categoriaId,
        subcategoria: subcategoriaId,
        abierto24h: modifiedService.abierto24h ? "si" : "no",
        horaInicio: modifiedService.abierto24h
          ? "00:00"
          : modifiedService.horaInicio || "00:00",
        horaFin: modifiedService.abierto24h
          ? "01:00"
          : modifiedService.horaFin || "01:00",
        delivery: modifiedService.delivery || false,
        descripcion: modifiedService.descripcion || "",
      });
    }
  }, [modifiedService, categorias, reset]);


  // const selectedCategoriaId = watch("categoria");
  const abierto24h = watch("abierto24h");
  const horaInicio = watch("horaInicio") ?? "";

  const horaFin = watch("horaFin") ?? "";

  useEffect(() => {
    if (!horaInicio) return;

    const [hInicio] = horaInicio.split(":").map(Number);
    const [hFin] = horaFin ? horaFin.split(":").map(Number) : [NaN];

    if (!horaFin || isNaN(hFin) || hFin <= hInicio) {
      const nuevaHoraFin = String(hInicio + 1).padStart(2, "0") + ":00";
      setValue("horaFin", nuevaHoraFin, { shouldValidate: true });
    }
  }, [horaInicio, horaFin, setValue]);

  const onSubmit = async (data: HuariqueFormData) => {
  try {
    const isValid = await trigger(); 

    if (!isValid) return;

    setIsLoading(true);

    // 🔹 Transformar HuariqueFormData a ServicioData
    const finalData: ServicioData = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      subcategoria: {
        cod_subcategoria: parseInt(data.subcategoria, 10),
        nombre: subcategorias.find(s => String(s.SUBC_Id) === data.subcategoria)?.SUBC_Nombre,
        descripcion: subcategorias.find(s => String(s.SUBC_Id) === data.subcategoria)?.SUBC_Descripcion || null,
      },
      abierto24h: data.abierto24h === "si",
      horaInicio: data.abierto24h === "si" ? null : data.horaInicio,
      horaFin: data.abierto24h === "si" ? null : data.horaFin,
      delivery: data.delivery,
    };

    setModifiedService({...modifiedService,...finalData});

    setProgressPrincipalService({
      ...progressPrincipalService,
      step: 2,
      currentPath: "/panel/publicador/principales/huarique",
    });

    setProgressService({ ...progressService, step: 2, currentPath: "/panel/publicador/multimedia" });
    // permitir que React aplique el setState antes de navegar
    setTimeout(() => {
      navigate("/panel/publicador/multimedia");
    }, 0);

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};



  const generateHours = () => {
    const hours: { value: string; label: string }[] = [];
    for (let h = 0; h <= 24; h++) {
      const hh = h.toString().padStart(2, "0");
      hours.push({ value: `${hh}:00`, label: `${hh}:00` });
    }
    return hours;
  };

  const horarios = generateHours();

const handleClickGuardarYSalir = async () => {
  const isValid = await trigger();
  if (!isValid) return;

  const data = watch();

  try {
    setIsLoadingGuardarSalir(true);

    const payload: UpdateUsuarioCompleto = {
      USUA_Interno: modifiedUser?.cod_usuario,
      USUA_Nombre: modifiedUser?.nombre,
      USUA_Apellido: modifiedUser?.apellido,
      USUA_Telefono: modifiedUser?.telefono,
      USUA_Dni: modifiedUser?.dni,
      USUA_IdUbigeo: ubigeo_usuario.cod_ubigeo ?? "",
      USUA_Direccion: ubigeo_usuario.direccion ?? "",
      USUA_Latitud: ubigeo_usuario.latitud,
      USUA_Longitud: ubigeo_usuario.longitud,
    };

    updateUser(payload, async (updatedUser) => {
      setUser({ ...user, ...updatedUser });
      setModifiedUser({ ...modifiedUser, ...updatedUser });

      // ✅ Esperar empresa creada/actualizada si corresponde
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

      // ✅ Crear servicio
      const finalData = {
        SERV_Nombre: data.nombre,
        SERV_Descripcion: data.descripcion,
        SUBC_Id: parseInt(data.subcategoria, 10),
        SERV_Abierto24h: data.abierto24h === "si",
        SERV_HoraInicio: data.abierto24h === "si" ? null : data.horaInicio,
        SERV_HoraFin: data.abierto24h === "si" ? null : data.horaFin,
        SERV_Delivery: data.delivery,
        SERV_Estado: false,
      };

      await createServicio(finalData, async (success, message, servicio) => {
        if (!success || !servicio) {
          console.error("Error al crear servicio:", message);
          return;
        }

        // ✅ Subir multimedia
        if (multimediaService) {
          subirArchivosMultiples(
            "servicio",
            servicio?.cod_servicio ?? "",
            {
              logo:
                multimediaService?.logo instanceof File ? multimediaService.logo : undefined,
              portada:
                multimediaService?.portada instanceof File ? multimediaService.portada : undefined,
              imagenes:
                multimediaService?.imagenes?.length > 0
                  ? multimediaService.imagenes.filter((img) => img instanceof File)
                  : undefined,
              video: multimediaService.videoPromocional || undefined,
              documento:
                multimediaService?.cartaRecomendacion instanceof File
                  ? multimediaService.cartaRecomendacion
                  : undefined,
            },
            (success, _data, message) => {
              if (!success) console.error(message);
            }
          );
        }

        // ✅ Crear dirección si hay datos
        if (direccionService) {
          getCodUbigeo(
            direccionService?.departamento ?? "",
            direccionService?.provincia ?? "",
            direccionService?.distrito ?? "",
            async (codUbigeo) => {
              const payload: DireccionRequest = {
                cod_entidad: servicio?.cod_servicio || "",
                codigoUbigeo: codUbigeo,
                direccion: direccionService?.direccion ?? "",
                latitud: direccionService?.latitud,
                longitud: direccionService?.longitud,
                tipo_entidad: "servicio",
                referencia: null,
                predeterminado: true,
              };

              await createDireccion(payload, (success, message) => {
                if (!success) console.error(message);
              });
            }
          );
        }

        // ✅ Crear aviso con empresa ya creada o actualizada
        createAviso(
          {
            AVIS_Estado: "borrador",
            EMPR_Interno:
              profileType === "empresa" ? String((empresaActual as EmpresaData)?.cod_empresa ?? "") : null,
            SERV_Interno: servicio?.cod_servicio,
            isCompleted: direccionService ? 4 : multimediaService ? 3 : 2,
          },
          async(success, message, avisoData) => {
            if (success && avisoData) {
              setService(null);
              setModifiedService(null);
              navigate("/panel/avisos");
              showMessage("Se ha creado el servicio correctamente", "success");

              setProgressPrincipalService({
                ...progressPrincipalService,
                step: 1,
                currentPath: "/panel/publicador/principales/perfilnegocio",
              });
              setMultimediaService(null);
              setDireccionService(null);

              await getUserInfo();

              reset();
            } else {
              showMessage(message, "error");
            }
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:max-w-[500px] w-full">
        <section>
          <div className="flex w-full justify-between">
            <h4 className="font-semibold text-base mb-4 w-full">Datos del Huarique</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 w-full ">
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Nombre del Huarique"
                  placeholder="Ej: Anticuchos Doña Peta"
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              )}
            />

            <div className="w-full flex flex-col gap-4 sm:flex-row">
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => (
                  <CustomSelected
                    value={field.value}
                    onChange={(e) => {
                      const newCategoriaId = e.target.value;
                      field.onChange(newCategoriaId);
                      
                      const categoria = categorias.find(
                        (c) => String(c.CATE_Id) === String(newCategoriaId)
                      );
                      setSubcategorias(categoria?.Subcategorias || []);
                      setValue("subcategoria", "");
                    }}
                    options={categorias.map((c) => ({
                      value: String(c.CATE_Id),
                      label: c.CATE_Nombre,
                    }))}
                    label="Categoría"
                    error={!!errors.categoria}
                    helperText={errors.categoria?.message}
                    fullWidth
                    placeholder="Selecciona una categoría"
                  />
                )}
              />


              <Controller
                name="subcategoria"
                control={control}
                render={({ field }) => (
                  <CustomSelected
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    options={subcategorias.map((s) => ({
                      value: String(s.SUBC_Id),
                      label: s.SUBC_Nombre,
                    }))}
                    label="Subcategoría"
                    error={!!errors.subcategoria}
                    helperText={errors.subcategoria?.message}
                    disabled={subcategorias.length === 0}
                    fullWidth
                    placeholder="Selecciona una subcategoría"
                  />
                )}
              />
            </div>

            {/* Abierto 24 horas */}
            <Controller
              name="abierto24h"
              control={control}
              render={({ field }) => (
                <CustomSelected
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={[
                    { value: "si", label: "Sí, abierto 24 horas" },
                    { value: "no", label: "No, tiene horario de atención" },
                  ]}
                  label="¿Está abierto 24 horas?"
                  error={!!errors.abierto24h}
                  helperText={errors.abierto24h?.message}
                  fullWidth
                  placeholder="Selecciona disponibilidad"
                />
              )}
            />

            {abierto24h === "no" && (
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="horaInicio"
                  control={control}
                  render={({ field }) => (
                    <CustomSelected
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={horarios}
                      label="Hora Inicio"
                      error={!!errors.horaInicio}
                      helperText={errors.horaInicio?.message}
                      placeholder="Selecciona hora inicial"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="horaFin"
                  control={control}
                  render={({ field }) => (
                    <CustomSelected
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={horarios.map((h) => ({
                        ...h,
                        disabled: horaInicio !== "" && h.value <= horaInicio,
                      }))}
                      label="Hora Cierre"
                      error={!!errors.horaFin}
                      helperText={errors.horaFin?.message}
                      placeholder="Selecciona hora final"
                      fullWidth
                    />
                  )}
                />

              </div>
            )}

            {/* Delivery */}
            <div className="w-auto h-[24px] flex items-center justify-start">
              <Controller
                name="delivery"
                control={control}
                render={({ field }) => (
                  <CustomCheckbox
                    label="¿Tiene delivery?"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    variant="primary"
                    size="md"
                  />
                )}
              />
            </div>

            {/* Descripción */}
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Descripción"
                  placeholder="Ej: Vendemos anticuchos al carbón con la receta familiar"
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                  multiline
                  rows={3}
                />
              )}
            />
          </div>
        </section>

        <div className="w-full flex justify-start flex-col gap-4 md:max-w-[500px] ">
          {/* Botón Guardar */}
          <div className="flex items-center justify-center space-x-4">
            <div className="w-full">
                <CustomButton text={isServiceEdit? 'Salir' : 'Guardar y Salir'} type="button" onClick={isServiceEdit ? ()=>setSalir(true) : handleClickGuardarYSalir} fullWidth fontSize="14px" variant="secondary-outline" loading={isLoadingGuardarSalir} />
            </div>
            <div className="w-full">
                <CustomButton text="Continuar" type="submit" fullWidth fontSize="14px" variant="primary" loading={isLoading}/>
            </div>
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

export default HuariqueForm;
