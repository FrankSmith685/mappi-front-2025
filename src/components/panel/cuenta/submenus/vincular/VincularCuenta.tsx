/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppState } from "../../../../../hooks/useAppState";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { CustomButton } from "../../../../ui/CustomButton";
import { FaGoogle, FaEnvelope } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../../../config/firebase";
import { useUser } from "../../../../../hooks/useUser";
import CustomModal from "../../../../ui/CustomModal";
import { CustomInput } from "../../../../ui/CustomInput";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type MetodoLogin = "correo" | "google" | "facebook";

const availableMethods: { key: MetodoLogin; label: string; icon: React.ElementType; color: string }[] = [
  { key: "correo", label: "Correo", icon: FaEnvelope, color: "from-blue-100 to-blue-200" },
  { key: "google", label: "Google", icon: FaGoogle, color: "from-red-100 to-red-200" },
];

// esquema de validación solo para correo/contraseña
const vincularCorreoSchema = z.object({
  email: z.string().nonempty("El correo es obligatorio").email("Correo no válido"),
  password: z.string().nonempty("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
});
type VincularCorreoData = z.infer<typeof vincularCorreoSchema>;

const VincularCuenta = () => {
  const { user ,setUser} = useAppState();
  const { showMessage } = useNotification();
  const [loadingProvider, setLoadingProvider] = useState<MetodoLogin | null>(null);
  const { linkAccount, unlinkAccount } = useUser();
  const [showCorreoModal, setShowCorreoModal] = useState(false);

  const [metodosVinculados, setMetodosVinculados] = useState<MetodoLogin[]>([]);

  useEffect(() => {
    if (user?.metodosLogin) {
      setMetodosVinculados(user.metodosLogin);
    }
  }, [user]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VincularCorreoData>({
    resolver: zodResolver(vincularCorreoSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const handleVincular = async (provider: MetodoLogin) => {
    if (provider === "correo") {
      setShowCorreoModal(true);
      return;
    }

    if (provider === "google") {
      setLoadingProvider("google");
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const googleUser = result.user;

        await linkAccount("google", googleUser?.email?.toString(), googleUser.uid, (success, message) => {
          if (!success) {
            showMessage(message || "Error al vincular google", "error");
            return;
          }
          showMessage(message, "success");

          // ✅ actualizar estados
          setMetodosVinculados((prev) => [...prev, "google"]);
          setUser({
            ...user!,
            metodosLogin: [...(user?.metodosLogin || []), "google"],
          });

        });
      } catch (error: any) {
        showMessage(error?.message || "Error al vincular Google", "error");
      } finally {
        setLoadingProvider(null);
      }
    }

  };

  const handleDesvincular = async (provider: MetodoLogin) => {
    setLoadingProvider(provider);

    try {
      await unlinkAccount(provider, (success, message) => {
        if (!success) {
          showMessage(message || "Error al desvincular", "error");
          return;
        }
        showMessage(message, "success");

        // ✅ actualizar estados
        setMetodosVinculados((prev) => prev.filter((m) => m !== provider));
        setUser({
          ...user!,
          metodosLogin: user?.metodosLogin?.filter((m) => m !== provider) || [],
        });


      });
    } catch (error: any) {
      console.error(error);
      showMessage(error?.message || `Error al desvincular cuenta de ${provider}`, "error");
    } finally {
      setLoadingProvider(null);
    }

  };

  const onSubmitCorreo = async (data: VincularCorreoData) => {
    setLoadingProvider("correo");
    try {
        await linkAccount("correo", data.email, data.password, (success, message) => {
    if (!success) {
      showMessage(message || "Error al vincular correo", "error");
      return;
    }
    showMessage(message, "success");

    // ✅ actualizar estados
    setMetodosVinculados((prev) => [...prev, "correo"]);
    setUser({
        ...user!,
        metodosLogin: [...(user?.metodosLogin || []), "correo"],
      });

    setShowCorreoModal(false);
    reset();
  });

    } catch (error: any) {
      showMessage(error?.message || "Error al vincular correo", "error");
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
         <p className="text-sm text-gray-600">
          Gestiona los métodos que usas para iniciar sesión en tu cuenta. 
          Puedes vincular diferentes opciones (correo, Google, etc.) para 
          tener más flexibilidad y recuperar el acceso en caso de que pierdas uno de ellos.
        </p>


        <div className="grid gap-6 md:grid-cols-2">
          {availableMethods.map(({ key, label, icon: Icon, color }) => {
            const isLinked = metodosVinculados.includes(key);

            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl p-5 shadow-md border bg-gradient-to-br ${color} hover:shadow-lg transition`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-3xl text-gray-700" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{label}</span>
                    <span className="text-xs text-gray-500">
                      {isLinked ? "Actualmente vinculado" : "No vinculado todavía"}
                    </span>
                  </div>
                </div>

                {isLinked ? (
                  <CustomButton
                    text="Desvincular"
                    variant="secondary"
                    onClick={() => handleDesvincular(key)}
                    loading={loadingProvider === key}
                    fontSize="14px"
                  />
                ) : (
                  <CustomButton
                    text="Vincular"
                    variant="primary"
                    onClick={() => handleVincular(key)}
                    loading={loadingProvider === key}
                    fontSize="14px"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CORREO */}
      <CustomModal
        width="550px"
        height="auto"
        closable={false}
        isOpen={showCorreoModal}
        onClose={() => {
          setShowCorreoModal(false);
          reset();
        }}
      >
        <form onSubmit={handleSubmit(onSubmitCorreo)} className="space-y-4 w-full">
          <h2 className="text-lg font-semibold text-gray-800">Vincular correo</h2>
          <div className="w-full gap-4 flex flex-col">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  type="email"
                  placeholder="Correo"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  type="password"
                  placeholder="Contraseña"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <CustomButton
              text="Cancelar"
              variant="secondary"
              onClick={() => {
                setShowCorreoModal(false);
                reset();
              }}
              fontSize="14px"
            />
            <CustomButton
              text="Vincular"
              variant="primary"
              type="submit"
              loading={isSubmitting || loadingProvider === "correo"}
              fontSize="14px"
            />
          </div>
        </form>
      </CustomModal>
    </>
  );
};

export default VincularCuenta;
