/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import { useMemo } from "react";
import { quickAccess } from "./data/menuData";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";

const MainMenu = () => {
  const location = useLocation();
  const isPanelRoute = location.pathname.startsWith("/panel");
  const navigate = useNavigate();
  const {user} = useAppState();

  const filteredItems = useMemo(() => {
    const activeItems = quickAccess.filter(
      (item) => item.path && (item.isActive || item.isActive === undefined)
    );

    // Reordenar: "Mi cuenta" siempre al inicio
    return activeItems.sort((a, b) =>
      a.label === "Mi cuenta" ? -1 : b.label === "Mi cuenta" ? 1 : 0
    );
  }, []);

  const groupedByBase = useMemo(() => {
    const groups: { [key: string]: typeof filteredItems } = {};

    filteredItems.forEach((item) => {
      const match = item.path?.match(/^\/panel\/[^\/]+/);
      const basePath = match?.[0] ?? "otros";

      if (!groups[basePath]) groups[basePath] = [];
      groups[basePath].push(item);
    });

    if (!groups["/panel/avisos"]) {
      groups["/panel/avisos"] = [
        {
          label: "Mis Avisos",
          path: "/panel/avisos",
          isActive: true,
        } as any,
      ];
    }

    if (user?.tienePlan !== null && !groups["/panel/capacitaciones"]) {
      groups["/panel/capacitaciones"] = [
        {
          label: "Mi Capacitación",
          path: "/panel/capacitaciones",
          isActive: true,
        } as any,
      ];
    }

    if (user?.tieneServicio && !groups["/panel/planes"]) {
      groups["/panel/planes"] = [
        {
          label: "Mis Planes",
          path: "/panel/planes",
          isActive: true,
        } as any,
      ];
    }

    //  Inyectar "Mi Publicación" si estamos en /panel/publicador/...
      if (location.pathname.startsWith("/panel/publicador")) {
      if (!groups["/panel/publicador"]) groups["/panel/publicador"] = [];
      groups["/panel/publicador"].push({
        label: "Mi Publicación",
        path: "/panel/publicador/principales/perfilnegocio",
        isActive: true,
      } as any);
    }

    const orderedKeys = Object.keys(groups).sort((a, b) => {
      if (a.includes("cuenta")) return -1;
      if (b.includes("cuenta")) return 1;

      if (a.includes("actividad")) return -1;
      if (b.includes("actividad")) return 1;

      if (a.includes("avisos")) return -1;
      if (b.includes("avisos")) return 1;

      if (a.includes("capacitaciones")) return -1;
      if (b.includes("capacitaciones")) return 1;

      if (a.includes("publicador")) return 1;
      if (b.includes("publicador")) return -1;

      return 0;
    });

    const orderedGroups: { [key: string]: typeof filteredItems } = {};
    orderedKeys.forEach((key) => {
      orderedGroups[key] = groups[key];
    });

    return orderedGroups;
  }, [filteredItems, location.pathname]);

  return (
    <nav className="z-50 bg-transparent text-white h-[80px]">
      <div className="flex gap-0 items-center justify-center h-full px-0 w-full text-sm">
        {!isPanelRoute ? (
          <></>
        ) : (
          <div className="flex gap-4 h-full items-center pr-4">
            {Object.entries(groupedByBase).map(([base, items]) => {
              return (
                <div
                  key={base}
                  className="cursor-pointer h-full flex items-center"
                  onClick={() => navigate(items[0].path!)}
                >
                  <span
                    className={`text-sm text-center border-b-[1px] pb-1 ${
                      location.pathname.startsWith(base)
                        ? "border-white text-white"
                        : "border-transparent text-white"
                    }`}
                  >
                    {base.includes("cuenta")
                      ? "Mi Cuenta"
                      : base.includes("actividad")
                      ? "Mi Actividad"
                      : base.includes("avisos")
                      ? "Mis Avisos"
                      : base.includes("capacitaciones")
                      ? "Mi Capacitación"
                      : base.includes("planes")
                      ? "Mis Planes"
                      : base.includes("publicador")
                      ? "Mi Publicación"
                      : base.replace("/panel/", "").charAt(0).toUpperCase() +
                        base.replace("/panel/", "").slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainMenu;
