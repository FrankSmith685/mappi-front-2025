import { useEffect, useState } from "react";
import { pendingTask as defaultTasks } from "./data/pendingTask";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Check, WarningAmber } from "@mui/icons-material";
import { useAppState } from "../../../../hooks/useAppState";

const backgroundColor = "#F5FBF9";

const PendingTask = () => {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState(defaultTasks);
  const {listaAvisos} = useAppState();

  useEffect(() => {
    if (!listaAvisos) return;

    const updated = defaultTasks.map((item) => {
      const count = listaAvisos[item.key] || 0;

      let description = "";
      switch (item.key) {
        case "consultas_pendientes":
          description = count > 0
            ? `Tienes ${count} consultas sin responder.`
            : "¡Estás al día, no tienes consultas sin responder!";
          break;
        case "avisos_incompletos":
          description = count > 0
            ? `Tienes ${count} avisos por completar.`
            : "¡Buen trabajo! Tus avisos están muy completos.";
          break;
        case "avisos_duplicados":
          description = count > 0
            ? `Hay ${count} avisos duplicados.`
            : "No tienes avisos duplicados. ¡Vas bien!";
          break;
        case "reportes_pendientes":
          description = count > 0
            ? `Tienes ${count} reportes sin revisar.`
            : "Tus avisos no tienen reportes sin revisar. ¡Vas bien!";
          break;
        default:
          description = "";
      }

      return {
        ...item,
        description,
        count,
      };
    });

    setTasks(updated);
  }, [listaAvisos]);

  return (
    <div
      className={`${open ? "p-4" : "p-0"} rounded-2xl  shadow-md border border-gray-200 transition-all duration-300`}
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className={`${
          open ? "mb-4 p-0" : "mb-0 px-4 py-3"
        } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 hover:cursor-pointer`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start sm:gap-8 w-full gap-4">
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Tareas pendientes
            </h2>
            <button
              className="sm:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle tareas pendientes"
            >
              {open ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />}
            </button>
          </div>

          {/* Íconos cuando está cerrado */}
          {!open && (
            <div className="flex flex-wrap items-center gap-4">
              {tasks.map((item, index) => (
                <div
                  key={index}
                  className="relative text-gray-500 p-1 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  title={item.title}
                >
                  {item.icon}
                  <span className="absolute top-3 -right-3 text-sm">
                    {item.count === 0 ? (
                      <Check className="text-green-600" fontSize="small" />
                    ) : (
                      <WarningAmber className="text-yellow-500" fontSize="small" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="hidden sm:flex text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          aria-label="Toggle tareas pendientes"
        >
          {open ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />}
        </button>
      </div>

      {/* Tareas cuando está abierto */}
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tasks.map((item, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transform hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="relative text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                {item.icon}
                {/* <span className="absolute top-3 -right-3 text-green-600 text-sm"> */}
                  {/* <Check fontSize="small" /> */}
                  <span className="absolute top-3 -right-3 text-sm">
                    {item.count === 0 ? (
                      <Check className="text-green-600" fontSize="small" />
                    ) : (
                      <WarningAmber className="text-yellow-500" fontSize="small" />
                    )}
                  </span>

                {/* </span> */}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingTask;
