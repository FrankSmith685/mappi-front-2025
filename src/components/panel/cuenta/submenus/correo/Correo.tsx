import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { CustomInput } from "../../../../ui/CustomInput";
import { CustomButton } from "../../../../ui/CustomButton";
import { useUser } from "../../../../../hooks/useUser";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { useAppState } from "../../../../../hooks/useAppState";
import { useAuth } from "../../../../../hooks/useAuth";

// Validación con Zod
const emailSchema = z
  .object({
    currentEmail: z
      .string()
      .nonempty("El correo actual es obligatorio")
      .email("Correo actual inválido"),
    newEmail: z
      .string()
      .nonempty("El nuevo correo es obligatorio")
      .email("El nuevo correo debe tener un formato válido"),
    confirmEmail: z
      .string()
      .nonempty("Debes confirmar el nuevo correo"),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    path: ["confirmEmail"],
    message: "Los correos no coinciden",
  });

type EmailFormData = z.infer<typeof emailSchema>;

const Correo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { changeEmail } = useUser();
  const { showMessage } = useNotification();
  const { user } = useAppState();
  const {logout} = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      currentEmail: "",
      newEmail: "",
      confirmEmail: "",
    },
  });

  useEffect(() => {
    if (user?.correo) {
      setValue("currentEmail", user.correo);
    }
  }, [user?.correo, setValue]);

  const onSubmit = (data: EmailFormData) => {
    setIsLoading(true);

    changeEmail(
      {
        currentEmail: data.currentEmail,
        newEmail: data.newEmail,
      },
      (success, message) => {
        if (success) {
          showMessage(message || "Correo actualizado correctamente", "success");
          reset({
            currentEmail: data.newEmail,
            newEmail: "",
            confirmEmail: "",
          });
          logout();
        } else {
          showMessage(message || "Error al cambiar el correo", "error");
        }
        setIsLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">

      <div className="grid grid-cols-1 gap-4 w-full md:max-w-[400px]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Correo Actual</label>
          <p className="text-sm text-gray-600 mb-3">
            Este es el correo que usas actualmente para iniciar sesión.
          </p>
          <Controller
            name="currentEmail"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Correo Actual"
                type="email"
                disabled={true}
                placeholder="ejemplo@correo.com"
                error={!!errors.currentEmail}
                helperText={errors.currentEmail?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nuevo Correo</label>
          <p className="text-sm text-gray-600 mb-3">
            Ingresa el nuevo correo que deseas utilizar.
          </p>
          <Controller
            name="newEmail"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Nuevo Correo"
                type="email"
                placeholder="nuevo@correo.com"
                error={!!errors.newEmail}
                helperText={errors.newEmail?.message}
              />
            )}
          />
        </div>

        <Controller
          name="confirmEmail"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Confirmar Nuevo Correo"
              type="email"
              placeholder="nuevo@correo.com"
              error={!!errors.confirmEmail}
              helperText={errors.confirmEmail?.message}
            />
          )}
        />
      </div>

      <div className={`pt-4 w-full md:max-w-[400px]`}>
        <CustomButton
          text="Actualizar Correo"
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

export default Correo;
