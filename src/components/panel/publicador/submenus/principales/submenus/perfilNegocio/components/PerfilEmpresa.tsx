/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
import { CustomInput } from "../../../../../../../ui/CustomInput";

type PerfilEmpresaProps = {
  control: any;
  errors: any;
};

const PerfilEmpresa = ({ control, errors }: PerfilEmpresaProps) => {
  return (
    <div className="space-y-8">
      <h4 className="font-semibold text-base mb-4">Datos de la Empresa</h4>
      <div className="grid grid-cols-1 gap-4 w-full md:max-w-[500px]">
        <Controller
          name="razonSocial"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Razón Social"
              placeholder="Ej: Mi Empresa SAC"
              error={!!errors.razonSocial}
              helperText={errors.razonSocial?.message}
            />
          )}
        />
        <Controller
          name="ruc"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="RUC"
              placeholder="Ej: 20123456789"
              error={!!errors.ruc}
              helperText={errors.ruc?.message}
            />
          )}
        />
        <Controller
          name="telefonoEmpresa"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Teléfono de la empresa"
              placeholder="Ej: 926739999"
              error={!!errors.telefonoEmpresa}
              helperText={errors.telefonoEmpresa?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PerfilEmpresa;
