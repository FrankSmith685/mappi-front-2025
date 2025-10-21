/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { CustomSwitch } from "../../../../ui/CustomSwitch";
import { useNotificaciones } from "../../../../../hooks/useNotificaciones";

type TipoNotificacion = {
  TINO_Codigo: number;
  TINO_Nombre: string;
   TINO_Descripcion?: string;
};

type UsuarioTipoNotificacion = {
  TINO_Id: number;
  UTNO_Activo: boolean;
};

const Notificaciones = () => {
  const {
    getTiposNotificaciones,
    getNotificacionesUsuario,
    updateEstadoNotificacion,
  } = useNotificaciones();

  const [tiposNotificacion, setTiposNotificacion] = useState<TipoNotificacion[]>([]);
  const [estadoSwitch, setEstadoSwitch] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // 1. Traer todos los tipos de notificaciones
    getTiposNotificaciones((tipos) => {
      setTiposNotificacion(tipos);

      // 2. Luego traer configuraciones del usuario
      getNotificacionesUsuario((userNotifs) => {
        const estadoInicial: Record<number, boolean> = {};

        tipos.forEach((tipo) => {
          const userNotif = userNotifs.find(
            (n: UsuarioTipoNotificacion) => n.TINO_Id === tipo.TINO_Codigo
          );
          estadoInicial[tipo.TINO_Codigo] = userNotif ? userNotif.UTNO_Activo : false;
        });

        setEstadoSwitch(estadoInicial);
      });
    });
  }, []);

  const toggleSwitch = (codTipoNotificacion: number) => {
    const nuevoEstado = !estadoSwitch[codTipoNotificacion];

    // 3. Optimistic UI: actualizamos primero en el frontend
    setEstadoSwitch((prev) => ({
      ...prev,
      [codTipoNotificacion]: nuevoEstado,
    }));

    // 4. Mandar al backend
    updateEstadoNotificacion(
      codTipoNotificacion,
      nuevoEstado,
      (success, message) => {
        if (!success) {
          // rollback si falló
          setEstadoSwitch((prev) => ({
            ...prev,
            [codTipoNotificacion]: !nuevoEstado,
          }));
        }
        console.log(message);
      }
    );
  };

  return (
    <div className="w-full">
      <p className="text-gray-600 text-sm mb-6">
        Activa las suscripciones para recibir novedades en tu correo electrónico.
        <br />
        <span className="text-gray-500 text-xs">
          (Por ahora solo se enviarán a tu correo registrado)
        </span>
      </p>

      <div className="space-y-5">
        {tiposNotificacion.map((tipo) => {
          const activo = estadoSwitch[tipo.TINO_Codigo];
          return (
            <div
              key={tipo.TINO_Codigo}
              className={`flex flex-col sm:flex-row sm:justify-between sm:items-center rounded-xl p-4 sm:p-5 transition-all duration-300 border 
                ${activo ? "bg-orange-50 border-orange-300" : "bg-white border-gray-200"} 
                hover:shadow-md`}
            >
              <div className="w-full sm:max-w-[75%] mb-4 sm:mb-0">
                <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                  {tipo.TINO_Nombre}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {tipo.TINO_Descripcion}
                </p>
              </div>

              <div className="self-end sm:self-auto">
                <CustomSwitch
                  checked={!!activo}
                  onChange={() => toggleSwitch(tipo.TINO_Codigo)}
                  variant={activo ? "primary" : "secondary"}
                  size="lg"
                  label=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notificaciones;
