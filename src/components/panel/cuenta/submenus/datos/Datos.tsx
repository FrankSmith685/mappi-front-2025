/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomInput } from "../../../../ui/CustomInput";
import { CustomButton } from "../../../../ui/CustomButton";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "../../../../../hooks/useAppState";
import { useUser } from "../../../../../hooks/useUser";
import type { UpdateUsuarioCompleto } from "../../../../../interfaces/IUser";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { useArchivo } from "../../../../../hooks/useArchivo";

const datosSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
    .nonempty("El nombre es obligatorio"),

  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido es demasiado largo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El apellido solo puede contener letras y espacios")
    .nonempty("El apellido es obligatorio"),

  dni: z
    .string()
    .nonempty("El DNI es obligatorio")
    .regex(/^\d+$/, "El DNI debe contener solo números")
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos"),

  email: z
    .string()
    .nonempty("El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),

  celular: z
    .string()
    .nonempty("El número de celular es obligatorio")
    .regex(/^\d+$/, "El celular solo puede contener números")
    .min(6, "El celular es demasiado corto")
    .max(15, "El celular es demasiado largo"),
});

type DatosFormData = z.infer<typeof datosSchema>;

const Datos = () => {
  const [isLoading, setIsLoading] = useState(false);

  // ── Foto de perfil (preview + validación)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, setUser } = useAppState();
  const { updateUser } = useUser();
  const { subirArchivo, actualizarArchivo } = useArchivo();
  const { showMessage } = useNotification();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DatosFormData>({
    mode: "onChange",
    resolver: zodResolver(datosSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      celular: "",
    },
  });

  // Inicializa datos del usuario + foto actual como preview si existe
  useEffect(() => {
    if (user) {
      reset({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        dni: user.dni || "",
        email: user.correo || "",
        celular: user.telefono || "",
      });

      // Si el usuario ya tiene foto en backend úsala como preview inicial
      const fotoUrl = user?.fotoPerfil || null;
      if (!avatarFile) setAvatarPreview(fotoUrl);

    }
  }, [user, reset]);

  // Limpia objectURL al cambiar/ desmontar
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const validateAvatar = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) return "Formato no permitido (usa JPG, PNG o WEBP)";
    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) return `La imagen supera ${maxMB}MB`;
    return null;
  };

  const onAvatarChange = (file?: File) => {
    if (!file) return;
    const err = validateAvatar(file);
    if (err) {
      setAvatarError(err);
      setAvatarFile(null);
      setAvatarPreview(user?.fotoPerfil || null);
      return;
    }
    setAvatarError(null);
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarError(null);
    setAvatarPreview(user?.fotoPerfil || null);
  };

 const onSubmit = (formData: DatosFormData) => {
    if (!user) return;

    const payload: UpdateUsuarioCompleto = {
      USUA_Interno: user.cod_usuario,
      USUA_Nombre: formData.nombre,
      USUA_Apellido: formData.apellido,
      USUA_Telefono: formData.celular,
      USUA_Dni: formData.dni,
    };

    setIsLoading(true);

    updateUser(payload, (updatedUser, message) => {
      reset({
        nombre: updatedUser.nombre || "",
        apellido: updatedUser.apellido || "",
        dni: updatedUser.dni || "",
        email: updatedUser.correo || "",
        celular: updatedUser.telefono || "",
      });

      if (avatarFile) {
        const hasExistingPhoto = !!user?.fotoPerfil;
        const action = hasExistingPhoto ? actualizarArchivo : subirArchivo;

        action(
          "usuario",
          updatedUser.cod_usuario ?? '',
          "perfil",
          avatarFile,
          (archivo, msg) => {
            const archivoMsg =
              msg ??
              (hasExistingPhoto
                ? "Foto actualizada correctamente"
                : "Foto subida correctamente");

            showMessage(`Datos y ${archivoMsg.toLowerCase()}`, "success");

            setAvatarPreview(archivo.ARCH_Ruta);
            setAvatarFile(null);

            //  Aquí actualizas con datos + foto
            setUser({
              ...updatedUser,
              fotoPerfil: archivo.ARCH_Ruta,
            });

            setIsLoading(false);
          }
        );
      } else {
        showMessage(message ?? "Datos actualizados correctamente", "success");

        //  Aquí actualizas solo con los datos
        setUser({
          ...updatedUser,
          fotoPerfil: user.fotoPerfil, // mantenemos la foto actual si no cambió
        });

        setIsLoading(false);
      }
    });
  };


  // Iniciales para fallback (si no hay foto)
  const initials = `${(user?.nombre || user?.correo || "").charAt(0)}${(user?.apellido || "").charAt(0)}`
    .toUpperCase()
    .trim();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
      {/* ── Foto de perfil (atractiva) */}
      <section>
        <h4 className="font-semibold text-base mb-1">Foto de perfil</h4>
        <p className="text-sm text-gray-600 mb-4">
          Sube una imagen cuadrada (1:1). Formatos: JPG, PNG o WEBP. Máx 2MB.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full md:max-w-[600px]">
          {/* Contenedor Avatar */}
          <div className="relative self-center sm:self-auto">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-2 ring-slate-300 shadow-sm overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              {avatarPreview ? (
                // Imagen
                <img
                  src={avatarPreview}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback con iniciales
                <span className="text-xl sm:text-2xl font-semibold text-slate-700 select-none">
                  {initials || "👤"}
                </span>
              )}
            </div>

            {/* Botón flotante (cámara) */}
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 rounded-full bg-white shadow-md p-2 ring-1 ring-slate-200 hover:shadow-lg transition"
              title="Cambiar foto"
            >
              <FiCamera className="text-slate-700 w-5 h-5" />
            </button>
          </div>

          {/* Controles */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-sm px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                Cambiar foto
              </button>

              {avatarFile && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="text-sm px-3 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 transition inline-flex items-center gap-2 justify-center"
                  title="Quitar imagen seleccionada"
                >
                  <FiTrash2 />
                  Quitar
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Recomendado: 400×400px • Fondo claro • Rostro centrado
            </p>

            {avatarError && (
              <p className="text-xs text-rose-600 mt-2">{avatarError}</p>
            )}
          </div>
        </div>

        {/* input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            onAvatarChange(file);
            e.target.value = "";
          }}
        />

      </section>

      {/* ── Datos Personales */}
      <section>
        <h4 className="font-semibold text-base mb-1">Personales</h4>
        <p className="text-sm text-gray-600 mb-4">Completa con tus datos personales.</p>
        <div className="grid grid-cols-1 gap-4 w-full md:max-w-[400px]">
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Nombre"
                placeholder="Ej: Juan"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            )}
          />
          <Controller
            name="apellido"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Apellido"
                placeholder="Ej: Pérez"
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
              />
            )}
          />
          <Controller
            name="dni"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="DNI"
                placeholder="Ej: 12345678"
                error={!!errors.dni}
                helperText={errors.dni?.message}
              />
            )}
          />
        </div>
      </section>

      {/* ── Datos de Contacto */}
      <section>
        <h4 className="font-semibold text-base mb-1">Contacto</h4>
        <p className="text-sm text-gray-600 mb-4 w-full md:max-w-[400px]">
          Estos datos son para que podamos enviarte información, ofertas y, si publicaste un aviso, para que puedan contactarte.
        </p>

        <div className="grid grid-cols-1 gap-4 w-full md:max-w-[400px]">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Correo"
                placeholder="ejemplo@correo.com"
                disabled
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="celular"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Celular"
                placeholder="Ej: 987654321"
                error={!!errors.celular}
                helperText={errors.celular?.message}
              />
            )}
          />
        </div>
      </section>

      {/* ── Botón Guardar */}
      <div className={`pt-2 w-full md:max-w-[400px]`}>
        <CustomButton
          text="Guardar cambios"
          type="submit"
          fullWidth
          fontSize="14px"
          variant="primary"
          loading={isLoading}
        />
      </div>
    </form>
  );
};

export default Datos;
