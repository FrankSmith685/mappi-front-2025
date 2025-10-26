/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaBuilding, FaCheckCircle, FaHome } from "react-icons/fa";
import { usePlanes } from "../../../hooks/usePlanes";
import { usePlanUser } from "../../../hooks/usePlanUser";
import { useAppState } from "../../../hooks/useAppState";
import { useNotification } from "../../../hooks/useNotificacionHooks/useNotification";
import type { OrderResponse } from "../../../interfaces/IOders";
import type { UsuarioData } from "../../../interfaces/IUser";
import { CustomButton } from "../../ui/CustomButton";
import CustomImage from "../../ui/CustomImage";
import { useUser } from "../../../hooks/useUser";

declare global {
  interface Window {
    askOrder: (
      amount: number,
      user: UsuarioData,
      callback: (orderResponse: OrderResponse) => void,
      apiURL: string,
      sk: string
    ) => void;
    setCulqiSettings: (amount: number, orderId: string, plan: any) => void;
    openCulqi: () => void;
    handleUpdate: () => void;
  }
}

export const MisPlanes: React.FC = () => {
  const { getPlanesPorTipo } = usePlanes();
  const { getPlanUser, createPlanUser, getPlanesConProrrateo } = usePlanUser();
  const { user, setProfileType } = useAppState();
  const { showMessage } = useNotification();
  const { getUserInfo } = useUser();

  const [planes, setPlanes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"independiente" | "empresa">("independiente");
  const [planActivo, setPlanActivo] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<Record<number, boolean>>({});

  const apiURL: string = import.meta.env.VITE_API_URL;
  const sk: string = import.meta.env.VITE_APP_SK;

  /** Inicializar tipo de plan según el usuario */
  useEffect(() => {
    const tipoInicial = user?.tienePlan === "empresa" ? "empresa" : "independiente";
    setTipoSeleccionado(tipoInicial);
    fetchPlanes(tipoInicial);
  }, [user?.tienePlan]);

  /** Cargar planes */
  const fetchPlanes = async (tipo: "independiente" | "empresa") => {
    setLoading(true);
    try {
      let planActivoUsuario: any = null;

      await getPlanUser((data: any) => {
        if (Array.isArray(data) && data.length > 0) planActivoUsuario = data[0];
      });

      await getPlanesPorTipo(tipo, async (success, _msg, dataPlanes) => {
        if (success && Array.isArray(dataPlanes)) {
          await getPlanesConProrrateo(tipo, (dataProrrateo) => {
            if (Array.isArray(dataProrrateo)) {
              const planesCombinados = dataPlanes.map((plan) => {
                const prorrateo = dataProrrateo.find((p) => p.PLAN_Id === plan.PLAN_Id);
                const precioNuevo = parseFloat(plan.PLAN_Precio);
                const precioActual = planActivoUsuario
                  ? parseFloat(planActivoUsuario.PLUS_MontoPagado)
                  : 0;
                const aplicarProrrateo =
                  planActivoUsuario &&
                  precioNuevo > precioActual &&
                  prorrateo &&
                  prorrateo.precioConProrrateo !== plan.PLAN_Precio;

                return {
                  ...plan,
                  precioConProrrateo: aplicarProrrateo
                    ? prorrateo.precioConProrrateo
                    : parseFloat(plan.PLAN_Precio),
                  tieneProrrateo: !!aplicarProrrateo,
                };
              });
              setPlanes(planesCombinados);
            } else {
              setPlanes(dataPlanes);
            }
          });
        } else {
          setPlanes([]);
        }
      });
    } catch (err) {
      console.error("Error al cargar planes:", err);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  };

  /** Obtener plan activo */
  useEffect(() => {
    const fetchPlanActivo = async () => {
      await getPlanUser((data: any) => {
        setPlanActivo(Array.isArray(data) && data.length > 0 ? data[0] : null);
      });
    };
    fetchPlanActivo();
  }, []);

  /** Handler de pago */
  const highlightService = (plan: any) => {
    const selectPlan = planes.find(
      (p) => p.TIPL_Id === plan.TIPL_Id && p.PLAN_TipoUsuario === plan.PLAN_TipoUsuario
    );
    const parsedPrice = parseFloat(parseFloat(plan.precioConProrrateo).toFixed(2));
    window?.askOrder(
      parsedPrice * 100,
      user as UsuarioData,
      (orderResponse) => {
        window.setCulqiSettings(parsedPrice * 100, orderResponse.id, selectPlan);
        window.openCulqi();
      },
      apiURL,
      sk
    );
  };

  /** Handler al seleccionar un plan */
  const handleClickPlanSelected = (plan: any) => {
    if (planActivo) {
      const precioActual = parseFloat(planActivo.PLAN?.PLAN_Precio || planActivo.PLUS_MontoPagado || "0");
      const precioNuevo = parseFloat(plan.PLAN_Precio || "0");
      if (precioNuevo < precioActual) {
        showMessage("No puedes cambiar a un plan inferior al actual.", "info");
        return;
      }
      if (plan.PLAN_Id === planActivo.PLAN_Id) {
        showMessage("Este ya es tu plan actual.", "info");
        return;
      }
    }

    if (plan.PLAN_Precio === "0.00") {
      const planId = plan.PLAN_Id;
      setLoadingPlan((prev) => ({ ...prev, [planId]: true }));

      const nuevoPlan = {
        PLAN_Id: plan.PLAN_Id,
        TIPL_Id: plan.TIPL_Id,
        PLAN_Tipo_Usuario: plan.PLAN_TipoUsuario,
      };

      createPlanUser(nuevoPlan, async (success, message) => {
        setLoadingPlan((prev) => ({ ...prev, [planId]: false }));
        showMessage(message, success ? "success" : "error");

        if (success) {
          setPlanActivo({
            ...plan,
            PLUS_EstadoPlan: "activo",
            PLUS_FechaInicio: new Date().toISOString(),
          });
          await getUserInfo();
          await fetchPlanes(tipoSeleccionado);
          await getPlanUser((data: any) => {
            if (Array.isArray(data) && data.length > 0) {
              setPlanActivo(data[0]);
            }
          });
        }
      });
    } else {
      highlightService(plan);
    }
  };

  /** Refrescar después del pago */
  useEffect(() => {
    window.handleUpdate = async () => {
      try {
        await getPlanUser((data: any) => {
          if (Array.isArray(data) && data.length > 0) setPlanActivo(data[0]);
        });
        await fetchPlanes(tipoSeleccionado);
        await getUserInfo();
        if (tipoSeleccionado === "empresa") setProfileType("empresa");
        showMessage("¡Pago exitoso! Tu plan ha sido activado.", "success");
      } catch (err: any) {
        console.error("❌ Error al actualizar el plan:", err);
        showMessage("Error al actualizar el plan.", "error");
      }
    };
  }, [tipoSeleccionado]);

  const getPlanColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-amber-300 via-yellow-400 to-amber-500";
      case 1:
        return "from-orange-400 via-red-400 to-pink-500";
      default:
        return "from-indigo-400 via-purple-500 to-violet-600";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Cargando planes...
      </div>
    );

  if (planes.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No hay planes disponibles por el momento.
      </div>
    );

    console.log(user);
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 responsive-padding">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center">
        Elige tu{" "}
        <span className="text-primary drop-shadow-lg">
          plan {tipoSeleccionado}
        </span>
      </h2>

    

      {/* Botones de tipo */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <CustomButton
          text="Planes Independientes"
          size="lg"
          fontWeight={600}
          fontSize="14"
          variant={tipoSeleccionado === "independiente" ? "primary" : "secondary"}
          onClick={() => {
            if (tipoSeleccionado !== "independiente") {
              setTipoSeleccionado("independiente");
              fetchPlanes("independiente");
            }
          }}
          icon={<FaHome />}
          disabled={user?.tienePlan === "empresa"}
        />

        <CustomButton
          text="Planes Empresa"
          size="lg"
          fontWeight={600}
          fontSize="14"
          variant={tipoSeleccionado === "empresa" ? "primary" : "secondary"}
          onClick={() => {
            if (tipoSeleccionado !== "empresa") {
              setTipoSeleccionado("empresa");
              fetchPlanes("empresa");
            }
          }}
          icon={<FaBuilding />}
        />
      </div>


      {/* === Tarjetas de planes (Diseño igual a SeleccionarPlanIndependiente) === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {planes.map((plan, index) => {
          const planId = plan.PLAN_Id ?? index;
          const esPlanActivo = planActivo && planActivo.PLAN_Id === plan.PLAN_Id;
          const gradient = getPlanColor(index);

          return (
            <div
              key={planId}
              className={`relative flex flex-col justify-between border rounded-3xl p-6 shadow-lg bg-white/40 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-gray-200`}
            >
              {/* Encabezado */}
              <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} text-center shadow-inner`}>
                <CustomImage
                  name="logo_02"
                  alt="logo"
                  className="object-contain !w-[120px] !h-[60px] mx-auto mb-4 drop-shadow-xl"
                />
                <h3 className="text-2xl font-extrabold text-white drop-shadow-md">
                  {plan.TipoPlan.TIPL_Nombre}
                </h3>
                {plan.TipoPlan.TIPL_Descripcion && (
                  <p className="text-white/90 mt-2 text-sm">
                    {plan.TipoPlan.TIPL_Descripcion}
                  </p>
                )}
              </div>

              {/* Precio */}
              <div className="flex flex-col items-center mt-6 mb-4">
                {planActivo &&
                parseFloat(plan.PLAN_Precio) > parseFloat(planActivo.PLUS_MontoPagado) &&
                plan.precioConProrrateo &&
                plan.precioConProrrateo < parseFloat(plan.PLAN_Precio) ? (
                  <>
                    <p className="text-gray-400 line-through text-lg">
                      S/ {parseFloat(plan.PLAN_Precio).toFixed(2)}
                    </p>
                    <p className="text-4xl font-extrabold text-primary drop-shadow-md">
                      S/ {parseFloat(plan.precioConProrrateo).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Precio con prorrateo aplicado
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-extrabold text-primary drop-shadow-md">
                    {plan.PLAN_Precio !== "0.00"
                      ? `S/ ${parseFloat(plan.PLAN_Precio).toFixed(2)}`
                      : "Gratis"}
                  </p>
                )}
                {plan.Duracion && (
                  <p className="text-gray-500 text-sm mt-1">{plan.Duracion}</p>
                )}
              </div>

              {/* Descripción */}
              <p className="text-gray-700 text-center text-sm mb-5 px-3">
                {plan.Descripcion}
              </p>

              {/* Beneficios */}
              <div className="flex-1 border-t border-gray-200 pt-4">
                <ul className="space-y-3 text-left">
                  {Array.isArray(plan.Beneficios) &&
                    plan.Beneficios.map((b: any) => (
                      <li
                        key={b.PLBE_Id}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{b.PLBE_Descripcion}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Botón */}
              <div className="mt-6">
                <CustomButton
                  text={esPlanActivo ? "Plan activo" : "Elegir este plan"}
                  type="button"
                  fullWidth
                  variant={esPlanActivo ? "secondary" : "primary"}
                  fontSize="16px"
                  disabled={esPlanActivo}
                  loading={!!loadingPlan[plan.PLAN_Id]}
                  onClick={() => !esPlanActivo && handleClickPlanSelected(plan)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm text-center">
        *Precios expresados en soles peruanos (PEN). Los beneficios pueden variar según disponibilidad.
      </p>
    </div>
  );
};
