/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CustomTable from "../../../ui/CustomTable";
import { usePlanUser } from "../../../../hooks/usePlanUser";
import type { PlanUserData } from "../../../../interfaces/IPlanUser";

const backgroundColor = "#F5FBF9";

const ProductoState = () => {
  const [open, setOpen] = useState(false);
  const [planes, setPlanes] = useState<PlanUserData[]>([]);
  const [loading, setLoading] = useState(true);

  const { getAllPlanesUsuario } = usePlanUser();

  useEffect(() => {
    getAllPlanesUsuario((data) => {
      setPlanes(data);
      setLoading(false);
    });
  }, []);

  //  Encabezados ampliados
  const headers = [
    "Tipo de Plan",
    "Usuario",
    "Precio",
    "Duración (meses)",
    "Estado del plan",
    "Estado de pago",
    "Inicio",
    "Expiración",
  ];

  //  Mapeo de datos reales
  const rows =
    planes.length > 0
      ? planes.map((plan) => [
          plan.PLAN?.TipoPlan?.TIPL_Nombre || "—",
          plan.PLAN?.PLAN_TipoUsuario || "—",
          `${plan.PLAN?.PLAN_Moneda || ""} ${plan.PLAN?.PLAN_Precio || "—"}`,
          plan.PLAN?.PLAN_DuracionMeses?.toString() || "—",
          plan.PLUS_EstadoPlan || "—",
          plan.PLUS_EstadoPago || "—",
          new Date(plan.PLUS_FechaInicio).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          new Date(plan.PLUS_FechaExpiracion).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        ])
      : [];

  return (
    <div
      className="rounded-2xl shadow-md border border-gray-200 transition-all duration-300"
      style={{ backgroundColor }}
    >
      {/*  Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <ShoppingBasketIcon className="text-primary" />
          <span className="text-base sm:text-lg font-semibold text-gray-800">
            Mis planes:{" "}
            <span className="text-gray-500">
              {loading
                ? "cargando..."
                : `${planes.length} ${planes.length === 1 ? "plan" : "planes"}`}
            </span>
          </span>
        </div>
        <div className="text-gray-600 hover:text-gray-800 transition-colors">
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </div>
      </div>

      {/*  Tabla */}
      {open && (
        <div className="px-4 pb-4">
          <div className="overflow-x-auto">
            <CustomTable
              headers={headers}
              data={rows}
              rows={rows.length || 3}
              columns={headers.length}
              loading={loading}
              columnWidths={[
                "120px", // Tipo de Plan
                "150px", // Usuario
                "130px", // Precio
                "150px", // Duración
                "140px", // Estado del plan
                "140px", // Estado de pago
                "120px", // Inicio
                "120px", // Expiración
              ]}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoState;
