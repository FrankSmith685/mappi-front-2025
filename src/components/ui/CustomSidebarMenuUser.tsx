/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronRight, FaRegEdit, FaClipboardList } from "react-icons/fa";
import { quickAccess } from "../HeaderNav/data/menuData";
import { useAppState } from "../../hooks/useAppState";

export const CustomSidebarMenu = () => {
  const location = useLocation();
  const {user} = useAppState();

  const filteredItems = useMemo(() => {
    const activeItems = quickAccess.filter(
      (item) =>
        item.path &&
        (
          item.isActive ||
          item.isActive === undefined ||
          item.label.toLowerCase().includes("actividad") ||
          item.label.toLowerCase().includes("cuenta") ||
          item.label.toLowerCase().includes("avisos") ||
          item.label.toLowerCase().includes("capacitaciones") ||
          item.label.toLowerCase().includes("planes")

        )
    );

    // "Mi cuenta" siempre al inicio
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

    //  Inyectar "Mis Avisos" si no existe
    if (!groups["/panel/avisos"]) {
      groups["/panel/avisos"] = [
        {
          label: "Mis Avisos",
          path: "/panel/avisos",
          icon: FaClipboardList,
          isActive: true,
        } as any,
      ];
    }

    if (user?.tienePlan !== null && !groups["/panel/capacitaciones"]) {
      groups["/panel/capacitaciones"] = [
        {
          label: "Mi Capacitación",
          path: "/panel/capacitaciones",
          icon: FaClipboardList,
          isActive: true,
        } as any,
      ];
    }

    if (user?.tieneServicio && !groups["/panel/planes"]) {
      groups["/panel/planes"] = [
        {
          label: "Mis Planes",
          path: "/panel/planes",
          icon: FaClipboardList,
          isActive: true,
        } as any,
      ];
    }

    //  Inyectar "Mi Publicación" si estamos en /panel/publicador/...
    if (location.pathname.startsWith("/panel/publicador")) {
      if (!groups["/panel/publicador"]) groups["/panel/publicador"] = [];
      groups["/panel/publicador"].push({
        label: "Mi Publicación",
        path: "/panel/publicador",
        icon: FaRegEdit,
        isActive: true,
      } as any);
    }

    return groups;
  }, [filteredItems, location.pathname]);

  // --- 🔑 quedarse solo con el principal de cada grupo ---
  const mainItems = useMemo(() => {
    return Object.values(groupedByBase).map((items) => {
      const mainItem =
        items.find((i) =>
          i.label.toLowerCase().includes("cuenta") ||
          i.label.toLowerCase().includes("actividad") ||
          i.label.toLowerCase().includes("avisos") ||
          i.label.toLowerCase().includes("capacitaciones") ||
          i.label.toLowerCase().includes("planes") ||
          i.label.toLowerCase().includes("publicación")
        ) || items[0]; // fallback al primero
      return mainItem;
    });
  }, [groupedByBase]);

  const { menuOpenUser } = useAppState();

  return (
    <aside
      className={`${
        menuOpenUser ? "ml-[0px] sm:ml-[120px]" : ""
      } w-full max-w-full md:w-[320px] md:sticky top-[96px] h-fit bg-white rounded-xl border border-gray-200 shadow-md p-4`}
    >
      {/*  Título del menú */}
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Menú de navegación del usuario
      </h2>

      <ul className="space-y-2">
        {mainItems.map(({ label, path, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path!}
              end={false}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-sm font-medium group ${
                  isActive
                    ? "bg-primary text-white border-primary shadow"
                    : "bg-gray-50 hover:bg-primary/10 text-gray-700 border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <Icon
                        className={`text-lg transition-colors duration-200 ${
                          isActive ? "text-white" : "text-primary"
                        }`}
                      />
                    )}
                    <span className="text-sm">{label}</span>
                  </div>
                  <FaChevronRight
                    className={`text-xs transform transition-transform duration-200 ${
                      isActive
                        ? "text-white translate-x-1"
                        : "text-gray-500 group-hover:translate-x-1"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};
