// components/auth/ForgotPassword/ForgotPasswordForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../ui/CustomInput";
import { CustomButton } from "../../ui/CustomButton";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotificacionHooks/useNotification";
import { useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { CustomLink } from "../../ui/CustomLink";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const { sendResetEmail } = useAuth();
  const { showMessage } = useNotification();
  const navigate = useNavigate();

  const [emailSent, setEmailSent] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

    const onSubmit = async (data: ForgotPasswordData) => {
        setSavedEmail(data.email);

        await sendResetEmail(data.email, (res) => {
        if (res.success) {
            setEmailSent(true);
        } else {
            showMessage(
            res.message || "Error al enviar el correo de recuperación",
            "error"
            );
        }
        });
    };

  // Vista cuando ya se envió el correo
    if (emailSent) {
        return (
            <div className="flex flex-col gap-4 text-center items-center">
            <FaEnvelopeOpenText  size={64} className="text-primary" /> {/* ícono grande */}
            
            <h2 className="text-3xl font-bold text-primary-gradient">
                Revisa tu correo
            </h2>
            <p className="text-gray-700">
                Te hemos enviado un enlace de recuperación a:
            </p>
            <p className="font-semibold">{savedEmail}</p>

            <CustomButton
                text="Continuar"
                onClick={() => navigate("/")}
                type="submit"
                fullWidth
                variant="primary"
                fontSize="16px"
            />

            <button
                className="text-primary font-semibold hover:underline hover:cursor-pointer"
                onClick={() => {
                setEmailSent(false);
                reset();
                }}
            >
                No recibí el correo
            </button>
            </div>
        );
    }

  return (
    <>
        <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[500px] flex flex-col gap-4"
      noValidate
    >
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-primary-gradient text-center">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-800 text-center">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña
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

        <CustomButton
          text="Continuar"
          type="submit"
          fullWidth
          variant="primary"
          fontSize="16px"
          loading={isSubmitting}
        />
      </div>
      <div className="text-center">
        <CustomLink
        to="/iniciar"
        text="Volver al inicio de sesión"
        variant="primary"
        />
    </div>
    </form>
    </>
  );
};
