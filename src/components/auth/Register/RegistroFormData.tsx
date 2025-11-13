// components/forms/RegistroForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../../ui/CustomInput";
import { CustomButton } from "../../ui/CustomButton";
import { CustomLink } from "../../ui/CustomLink";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../hooks/useNotificacionHooks/useNotification";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase";
import { useAppState } from "../../../hooks/useAppState";

// Esquema de validación
// Esquema de validación completo
const registroSchema = z.object({
  nombres: z
    .string()
    .nonempty("El nombre es obligatorio")
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, "El nombre solo puede contener letras")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),

  apellidos: z
    .string()
    .nonempty("El apellido es obligatorio")
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, "El apellido solo puede contener letras")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder los 50 caracteres"),

  documento: z
    .string()
    .nonempty("El número de documento es obligatorio")
    .regex(/^\d+$/, "El documento debe contener solo números")
    .min(6, "El documento debe tener al menos 6 dígitos")
    .max(15, "El documento no puede tener más de 15 dígitos"),

  celular: z
    .string()
    .nonempty("El número de celular es obligatorio")
    .regex(/^\d+$/, "El celular solo puede contener números")
    .min(9, "El celular debe tener al menos 9 dígitos")
    .max(15, "El celular no puede tener más de 15 dígitos"),

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


type RegistroFormData = z.infer<typeof registroSchema>;

export const RegistroForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      documento: "",
      celular: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });
  const {registerUser} = useAuth();
  const navigate= useNavigate();
  const {showMessage} = useNotification();
  const {activeIniciarSesionResena, setModalResena, typeUserAuth} = useAppState();

  const onSubmit = async (data: RegistroFormData) => {
    const newData = {
        nombre: data.nombres,
        apellido: String(data.apellidos),
        correo: data.email,
        telefono: Number(data.celular),
        contrasena: data.password,
        dni: Number(data.documento),
        proveedor: "correo",
        type_user: typeUserAuth ? (typeUserAuth == 'comensal' ? 4 : 5 ) : 2
    };

    await registerUser(newData, (res) => {
      if (res.success) {
        if(activeIniciarSesionResena){
            navigate("/servicios?m=map");
            setModalResena(true);
          }else{
            navigate("/");
          }
      }else {
        showMessage(res.message || "error inesperado","error");
      }
    });
  };

  const handleGoogleRegister = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const newData = {
            correo: String(user.email),
            contrasena: result.user.uid,
            proveedor: "google" as const,
            type_user: typeUserAuth ? (typeUserAuth == 'comensal' ? 4 : 5 ) : 2,
        };
        
        await registerUser(newData, async (res) => {
        if (res.success) {
            if(activeIniciarSesionResena){
              navigate("/servicios?m=map");
              setModalResena(true);
            }else{
              navigate("/");
            }
        } else {
           if (res.message?.includes("El usuario ya existe con este correo")) {
                showMessage(
                    "Este correo ya está registrado con otro método. Inicia sesión primero con ese método y luego vincula tu cuenta de Google desde tu perfil.",
                    "error"
                );
                return;
            }else {
            showMessage(res.message || "Error inesperado", "error");
            }
        }
        });
    } catch (error) {
        console.error("Error al registrar con Google:", error);
        showMessage("No se pudo registrar con Google", "error");
    }
    };


  return (
    <div className="max-w-[500px] w-full flex flex-col gap-4">
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
        noValidate
        >
            <div className="w-full flex flex-col gap-2">
                <h2 className="text-4xl font-bold text-primary-gradient text-center">
                Crear cuenta
                </h2>
                <p className="text-gray-800 text-center">
                <strong>Regístrate</strong> y digitaliza tu negocio de comida con Mappi.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <Controller
                        name="nombres"
                        control={control}
                        render={({ field }) => (
                            <CustomInput
                            {...field}
                            label="Nombres"
                            placeholder="Nombres *"
                            fullWidth
                            error={!!errors.nombres}
                            helperText={errors.nombres?.message}
                            variant="primary"
                            />
                        )}
                    />

                    <Controller
                        name="apellidos"
                        control={control}
                        render={({ field }) => (
                            <CustomInput
                            {...field}
                            label="Apellidos"
                            placeholder="Apellidos *"
                            fullWidth
                            error={!!errors.apellidos}
                            helperText={errors.apellidos?.message}
                            variant="primary"
                            />
                        )}
                    />
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <Controller
                        name="documento"
                        control={control}
                        render={({ field }) => (
                            <CustomInput
                            {...field}
                            label="Documento DNI"
                            placeholder="Documento DNI *"
                            fullWidth
                            error={!!errors.documento}
                            helperText={errors.documento?.message}
                            variant="primary"
                            />
                        )}
                        />

                    <Controller
                        name="celular"
                        control={control}
                        render={({ field }) => (
                            <CustomInput
                            {...field}
                            label="Celular (+51)"
                            placeholder="Celular (+51)*"
                            fullWidth
                            error={!!errors.celular}
                            helperText={errors.celular?.message}
                            variant="primary"
                            />
                        )}
                    />
                </div>

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

                <p className="text-center text-base text-gray-600">
                    Al registrarse, aceptas nuestros{" "}
                    <CustomLink
                        fontSize="14px"
                        to="/terminos"
                        text="Términos y Condiciones"
                        variant="primary"
                        fontWeight="bold"
                    />
                </p>

                <CustomButton
                text="Registrarse"
                type="submit"
                fullWidth
                variant="primary"
                fontSize="14px"
                fontWeight={400}
                loading={isSubmitting}
                />
            </div>
        </form>
        <div className="flex items-center justify-center">
            <span className="w-full h-px bg-gray-300" />
            <span className="mx-2 text-gray-500">ó</span>
            <span className="w-full h-px bg-gray-300" />
        </div>

        <CustomButton
            text="Registrate con Google"
            type="button"
            fullWidth
            fontSize="14px"
            fontWeight={400}
            variant="warning"
            icon={<FaGoogle />}
            onClick={handleGoogleRegister}
        />

        <p className="text-center text-base text-gray-600">
            ¿Ya tienes cuenta?, inicia sesión{" "}
            <CustomLink
                fontSize="14px"
                to="/iniciar"
                text="aquí"
                variant="primary"
                fontWeight="bold"
            />
        </p>
    </div>
  );
};
