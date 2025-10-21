/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
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
  const { user } = useAppState();
  const { showMessage } = useNotification();
  const {getUserInfo} = useUser();
  const {setProfileType} = useAppState();

  const [planes, setPlanes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"independiente" | "empresa">("independiente");
  const [planActivo, setPlanActivo] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<Record<number, boolean>>({});

  const apiURL: string = import.meta.env.VITE_API_URL;
  const sk: string = import.meta.env.VITE_APP_SK;


  /** 🔹 Inicializar tipo de plan según el usuario */
  useEffect(() => {
    if (user?.tienePlan === "empresa") {
      setTipoSeleccionado("empresa");
      fetchPlanes("empresa");
    } else {
      setTipoSeleccionado("independiente");
      fetchPlanes("independiente")
    }
  }, [user?.tienePlan]);

  /** 🔹 Cargar planes según tipo */
  const fetchPlanes = async (tipo: "independiente" | "empresa") => {
    setLoading(true);
    try {
      let planActivoUsuario: any = null;

      await getPlanUser((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          planActivoUsuario = data[0];
        }
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


  /** 🔹 Actualizar plan activo */
  useEffect(() => {
    const fetchPlanActivo = async () => {
      await getPlanUser((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlanActivo(data[0]);
        } else {
          setPlanActivo(null);
        }
      });
    };
    fetchPlanActivo();
  }, []);

  /** 🔹 Handler de compra */
  const highlightService = (plan: any) => {
    const selectPlan = planes.find(
      (p) => p.TIPL_Id === plan.TIPL_Id && p.PLAN_TipoUsuario === plan.PLAN_TipoUsuario
    );
    const parsedPrice = parseFloat(parseFloat(plan.precioConProrrateo).toFixed(2));
    window?.askOrder(parsedPrice * 100, user as UsuarioData, (orderResponse) => {
      window.setCulqiSettings(parsedPrice * 100, orderResponse.id, selectPlan);
      window.openCulqi();
    }, apiURL, sk);
  };

  /** 🔹 Handler al seleccionar plan */
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
            // 🔹 1. Actualiza el plan activo directamente
            setPlanActivo({
                ...plan,
                PLUS_EstadoPlan: "activo",
                PLUS_FechaInicio: new Date().toISOString(),
            });

            await getUserInfo();

            // 🔹 3. Vuelve a traer la data del backend (para mantener consistencia)
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

//   const handleCambiarTipo = () => {
//     const nuevoTipo = tipoSeleccionado === "independiente" ? "empresa" : "independiente";
//     setTipoSeleccionado(nuevoTipo);
//     fetchPlanes(nuevoTipo);
//   };
useEffect(() => {
  // ✅ Creamos la función global que Culqi invocará después del pago
  window.handleUpdate = async () => {
    try {
      // 🔹 1. Obtener el plan activo actualizado
      await getPlanUser((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlanActivo(data[0]);
        }
      });

      // 🔹 2. Refrescar los planes visibles según el tipo seleccionado actual
      await fetchPlanes(tipoSeleccionado);

      // 🔹 3. Actualizar el contexto global del usuario
      await getUserInfo();
      if(tipoSeleccionado == "empresa"){
        setProfileType("empresa");
      }
      // 🔹 4. Mostrar mensaje de éxito
      showMessage("¡Pago exitoso! Tu plan ha sido activado.", "success");
    } catch (err: any) {
      console.error("❌ Error al actualizar el plan:", err);
      showMessage("Error al actualizar el plan.", "error");
    }
  };
}, [tipoSeleccionado, getPlanUser, fetchPlanes, showMessage]);


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

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 responsive-padding">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary text-center">
        Elige tu{" "}
        <span className="text-primary drop-shadow-md">
          plan {tipoSeleccionado}
        </span>
      </h2>

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
        />
        </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl w-full">
        {planes.map((plan, index) => {
          const planId = plan.PLAN_Id ?? index;
          const esPlanActivo = planActivo && planActivo.PLAN_Id === plan.PLAN_Id;

          return (
            <div
              key={planId}
              className={`relative backdrop-blur-md rounded-2xl border transition-all duration-500 flex flex-col w-full sm:justify-between items-center hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className="flex flex-col">
                {/* === Encabezado === */}
                <div
                  className={`relative rounded-t-2xl overflow-hidden p-4 text-center bg-gradient-to-br ${getPlanColor(
                    index
                  )} shadow-inner`}
                >
                  <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>

                  <div className="relative flex justify-center mb-4 z-10">
                    <CustomImage
                      name="logo_02"
                      alt="Logo"
                      className="object-contain !w-[150px] !h-[80px] drop-shadow-md hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-2xl font-extrabold text-white drop-shadow-md tracking-wide">
                    {plan.TipoPlan.TIPL_Nombre}
                  </h3>
                  {plan.TipoPlan.TIPL_Descripcion && (
                    <p className="text-sm text-white/90 mt-2">
                      {plan.TipoPlan.TIPL_Descripcion}
                    </p>
                  )}
                </div>

                {/* === Cuerpo === */}
                <div className="p-6 flex flex-col items-center text-center text-gray-700">
                  <div className="flex flex-col items-center mb-1">
                    {planActivo &&
                    parseFloat(plan.PLAN_Precio) > parseFloat(planActivo.PLUS_MontoPagado) &&
                    plan.precioConProrrateo &&
                    plan.precioConProrrateo < parseFloat(plan.PLAN_Precio) ? (
                      <>
                        <p className="text-gray-400 line-through text-lg">
                          S/ {parseFloat(plan.PLAN_Precio).toFixed(2)}
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          S/ {parseFloat(plan.precioConProrrateo).toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 font-semibold mt-1">
                          Precio con prorrateo aplicado
                        </p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-primary">
                        {plan.PLAN_Precio !== "0.00"
                          ? `S/ ${parseFloat(plan.PLAN_Precio).toFixed(2)}`
                          : "Gratis"}
                      </p>
                    )}
                  </div>

                  {plan.Duracion && (
                    <p className="text-sm text-gray-500 mb-3">{plan.Duracion}</p>
                  )}
                  <p className="text-gray-600 mb-5 text-sm">{plan.Descripcion}</p>

                  <div className="w-full border-t border-gray-200 mb-4"></div>

                  <ul className="space-y-2 text-left w-full">
                    {Array.isArray(plan.Beneficios) &&
                      plan.Beneficios.map((b: any) => (
                        <li key={b.PLBE_Id} className="flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{b.PLBE_Descripcion}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* === Botón === */}
              <div className="p-6 pt-0 w-full">
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

      <p className="text-gray-500 text-sm mt-4">
        *Los precios están expresados en soles peruanos (PEN). Los beneficios pueden variar según disponibilidad.
      </p>
    </div>
  );
};
