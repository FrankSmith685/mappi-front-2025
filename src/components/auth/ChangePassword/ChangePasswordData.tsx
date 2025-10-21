import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../ui/CustomInput";
import { CustomButton } from "../../ui/CustomButton";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotificacionHooks/useNotification";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../hooks/useAppState";

const changePasswordSchema = z.object({
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres")
    .max(50, "No puede exceder los 50 caracteres"),
  confirmPassword: z
    .string()
    .nonempty("Debes confirmar la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden",
});

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const {changePasswordToken, setChangePasswordToken} = useAppState();
  const { resetPassword } = useAuth();
  const { showMessage } = useNotification();
  const navigate = useNavigate();

  const onSubmit = async (data: ChangePasswordData) => {
    if (!changePasswordToken) {
      showMessage("Enlace inválido o expirado", "error");
      return;
    }

    await resetPassword(changePasswordToken, data.password, (res) => {
      if (res.success) {
        navigate("/iniciar");
        setChangePasswordToken(null);
      } else {
        showMessage(res.message || "Error al cambiar la contraseña", "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[500px] flex flex-col gap-4" noValidate>
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-primary-gradient text-center">
          Cambiar Contraseña
        </h2>
        <p className="text-gray-800 text-center">
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Nueva Contraseña"
              placeholder="Nueva Contraseña *"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="primary"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Confirmar Contraseña"
              placeholder="Confirmar Contraseña *"
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              variant="primary"
            />
          )}
        />

        <CustomButton
          text="Cambiar Contraseña"
          type="submit"
          fullWidth
          variant="primary"
          fontSize="16px"
          loading={isSubmitting}
        />
      </div>
    </form>
  );
};
