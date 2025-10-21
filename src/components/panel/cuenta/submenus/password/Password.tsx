import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { CustomInput } from "../../../../ui/CustomInput";
import { CustomButton } from "../../../../ui/CustomButton";
import { useUser } from "../../../../../hooks/useUser";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";

// Validación con Zod
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty("La contraseña actual es obligatoria"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const Password = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useUser();
  const { showMessage } = useNotification();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PasswordFormData) => {
    setIsLoading(true);

    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      (success, message) => {
        if (success) {
          showMessage(message || "Contraseña actualizada correctamente", "success");
          reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });

        } else {
          showMessage(message || "Error al cambiar la contraseña", "error");
        }
        setIsLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">

      <div className="grid grid-cols-1 gap-4 w-full md:max-w-[400px]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Contraseña Actual</label>
          <p className="text-sm text-gray-600 md:max-w-[400px] mb-3">
            Contraseña actual para verificar su identidad.
          </p>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Contraseña Actual"
                type="password"
                placeholder="••••••"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <p className="text-sm text-gray-600 md:max-w-[400px] mb-3">
            Ingrese su nueva contraseña y confírmela.
          </p>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            )}
          />
        </div>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="••••••"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />
    </div>

      <div className={`pt-4 w-full md:max-w-[400px]`}>
        <CustomButton
          text="Actualizar Contraseña"
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

export default Password;
