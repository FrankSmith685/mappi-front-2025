// components/forms/LoginForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../ui/CustomInput";
import { CustomButton } from "../../ui/CustomButton";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../hooks/useNotificacionHooks/useNotification";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder los 50 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  React.useEffect(() => {
  return () => reset(); // limpia inputs al desmontar
}, [reset]);

  const {loginUser} = useAuth();
  const navigate = useNavigate();
  const {showMessage} = useNotification();

  const onSubmit = async (data: LoginFormData) => {
    await loginUser(
      {
        correo: data.email,
        contraseña: data.password,
        proveedor: "correo",
      },
      (res) => {
        if (res.success) {
          navigate("/");
        } else {
          showMessage(res.message || "Error al iniciar sesión", "error");
        }
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[500px] flex flex-col gap-4"
      noValidate
    >
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-primary-gradient text-center">
          Iniciar Sesión
        </h2>
        <p className="text-gray-800 text-center">
          Inicia sesión para disfrutar los beneficios que tiene Mappi para tu negocio de comida
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Correo Electrónico"
              placeholder="Correo Electrónico *"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="primary"
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Contraseña"
              placeholder="Contraseña *"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="primary"
            />
          )}
        />

        <CustomButton
          text="Iniciar Sesión"
          type="submit"
          fullWidth
          variant="primary"
          fontSize="14px"
          fontWeight={400}
          loading={isSubmitting}
        />
      </div>
    </form>
  );
};
