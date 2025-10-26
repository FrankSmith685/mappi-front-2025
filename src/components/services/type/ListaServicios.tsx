    /* eslint-disable @typescript-eslint/no-explicit-any */
    import { useAppState } from "../../../hooks/useAppState";
    import { useSearchParams, useNavigate } from "react-router-dom";
    import { FiMap, FiStar, FiPhone, FiMail } from "react-icons/fi";
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/es";
    import BotonOpinion from "../components/BotonOption";

    dayjs.extend(relativeTime);
    dayjs.locale("es");

    const ListaServicios = () => {
    const { serviciosFilterActivos } = useAppState();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleToggleView = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("m", "map");
        setSearchParams(newParams);
    };

    const handleGoToService = (cod: string) => {
        const encoded = btoa(cod);
        navigate(`/servicios/${encoded}`);
    };

    return (
        <div className="relative flex flex-col p-4 bg-gray-50 rounded-3xl shadow-lg w-full">
        {/* Contador de servicios */}
        {/* Contenedor superior */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-4">
            {/* Contador de servicios */}
             <div className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 text-base font-semibold">
                <span>{serviciosFilterActivos.length}</span>
                <span>servicios disponibles</span>
            </div>

            {/* Botones: Mapa + Opinión */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                onClick={handleToggleView}
                className="bg-white/90 backdrop-blur-md shadow-md border border-gray-200 rounded-full px-3 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                title="Cambiar a mapa"
                >
                <FiMap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <span>Mapa</span>
                </button>

                <BotonOpinion
                />
            </div>
            </div>



        {/* Lista de servicios */}
        {serviciosFilterActivos?.length > 0 ? (
            <ul className="flex flex-col gap-4 mt-2 w-full">
            {serviciosFilterActivos.map((servicio: any) => {
                const logo =
                servicio.archivos?.find((a: any) => a.tipo === "logo")?.ruta ||
                "https://cdn-icons-png.flaticon.com/512/684/684908.png";

                const isDestacado = servicio.destacado;
                const isNuevo =
                dayjs().diff(dayjs(servicio.fechaRegistro), "day") <= 7;

                return (
                <li
                    key={servicio.cod_servicio}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 cursor-pointer hover:-translate-y-0.5 duration-200 w-full"
                    onClick={() => handleGoToService(servicio.cod_servicio)}
                >
                    {/* Logo */}
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border border-gray-200">
                    <img
                        src={logo}
                        alt={servicio.nombre}
                        className="w-12 h-12 object-contain"
                    />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-base sm:text-lg break-words">
                        {servicio.nombre}
                        </h3>
                        {isDestacado && (
                        <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FiStar className="w-3 h-3" /> Destacado
                        </span>
                        )}
                        {isNuevo && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Nuevo
                        </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 break-words">
                        {servicio.subcategoria?.nombre || "Sin subcategoría"}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                         {servicio.direccion?.direccion || "Sin dirección"}
                    </p>
                    <p className="text-xs text-gray-400">
                        ⏱ {dayjs(servicio.fechaRegistro).fromNow()}
                    </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition">
                        Ver
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2">
                        <FiPhone className="w-4 h-4" /> Llamar
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2">
                        <FiMail className="w-4 h-4" /> Contactar
                    </button>
                    </div>
                </li>
                );
            })}
            </ul>
        ) : (
            <div className="mt-12 text-center text-gray-500">
            No hay servicios disponibles
            </div>
        )}
        {/* <BotonOpinion onClick={() => alert("Función de compartir opinión")} /> */}

        </div>
    );
    };

    export default ListaServicios;
