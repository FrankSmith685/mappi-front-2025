import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CustomInput } from "../../../../ui/CustomInput";
import { CustomButton } from "../../../../ui/CustomButton";
import { useUser } from "../../../../../hooks/useUser";
import { useNotification } from "../../../../../hooks/useNotificacionHooks/useNotification";
import { useAuth } from "../../../../../hooks/useAuth";
// import { useAppState } from "../../../../../hooks/useAppState";

const deleteSchema = z.object({
  deletePassword: z
    .string()
    .nonempty("La contraseña es obligatoria para eliminar la cuenta"),
});

type DeleteFormData = z.infer<typeof deleteSchema>;

const EliminarConPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteOwnAccount } = useUser();
  const { showMessage } = useNotification();
  const { logout } = useAuth();
//   const {user} = useAppState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DeleteFormData>({
    resolver: zodResolver(deleteSchema),
    mode: "onChange",
    defaultValues: {
      deletePassword: "",
    },
  });

  const onSubmit = (data: DeleteFormData) => {
    setIsLoading(true);
    deleteOwnAccount(data.deletePassword, (success: boolean, message?: string) => {
      if (success) {
        showMessage(message || "Cuenta eliminada correctamente", "success");
        logout();
      } else {
        showMessage(message || "Error al eliminar la cuenta", "error");
      }
      setIsLoading(false);
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">

      <div className="max-w-[400px]">
        <p className="text-sm text-gray-700">
          Al eliminar tu cuenta de mappi, se eliminará tu perfil y todos los datos de tus actividades.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Si deseas eliminar tu cuenta, ingresa tu contraseña para confirmar esta acción irreversible.
        </p>
      </div>

      <div className=" w-full md:max-w-[400px]">
        <Controller
          name="deletePassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Contraseña"
              type="password"
              placeholder="••••••"
              error={!!errors.deletePassword}
              helperText={errors.deletePassword?.message}
              fullWidth={true}
            />
          )}
        />
      </div>

      <div className="pt-2 w-full md:max-w-[400px]">
        <CustomButton
          text="Eliminar Cuenta"
          type="submit"
          fullWidth
          fontSize="14px"
          variant="warning-outline"
          disabled={!watch("deletePassword") || isLoading}
        />
      </div>
    </form>
  );
};

export default EliminarConPassword;
