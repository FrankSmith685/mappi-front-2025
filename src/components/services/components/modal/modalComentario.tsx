/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomModal from "../../../ui/CustomModal";
import { CustomButton } from "../../../ui/CustomButton";
import CustomMapa from "../../../ui/CustomMapa";
import { CustomInput } from "../../../ui/CustomInput";
import { useAppState } from "../../../../hooks/useAppState";
import { useLocation } from "../../../../hooks/useLocationHooks/useLocation";
import { FaStar, FaRegStar, FaImage, FaVideo } from "react-icons/fa";
import { useUbigeo } from "../../../../hooks/useUbigeo";
import { useResena } from "../../../../hooks/useResena";
import { useServicio } from "../../../../hooks/useServicio";
import { useArchivo } from "../../../../hooks/useArchivo";

function getCurrentLocationIcon(): string {
  const baseUrl = "https://mappidevbucket.s3.us-east-1.amazonaws.com/";
  const icon = { key: "mapp_631" };
  return baseUrl + icon.key;
}

const getArchivoIdFromPreview = (url: string) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1]; // "imagen_085460ed-62e0-48d4-a691-d8e1d6ac9577.PNG"
  return filename
    .replace(/^imagen_/, "") // quita el prefijo "imagen_"
    .replace(/\.[^/.]+$/, ""); // quita la extensión (como ".PNG")
};



type FormData = {
  servicio: string;
  nombres: string;
  titulo: string;
  descripcion: string;
};

const ModalComentario = () => {
  const {
    servicioSeleccionado,
    setModalResena,
    modalResena,
    serviciosActivos,
    setServicioSeleccionado,
    user,
    setServiciosActivos,
    setServiciosFilterActivos,
  } = useAppState();

  const { createResena, updateResena } = useResena();
  const { getServiciosActivos } = useServicio();
  const { getCodUbigeo, getUbigeoByCoords } = useUbigeo();

  // 📍 Función para calcular distancia en metros entre dos coordenadas
  function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371000; // radio de la Tierra en metros
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  // console.log(user?.cod_usuario)


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      servicio: servicioSeleccionado?.nombre || "",
      nombres: "",
      titulo: "",
      descripcion: "",
    },
  });

  type ArchivoResena = {
  name: string;
  preview: string;
  uploaded: boolean;
  file?: File; 
};


  const [rating, setRating] = useState(1);
  const [isAnonimo, setIsAnonimo] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ArchivoResena[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<ArchivoResena | null>(null);

  const {
    lat: currentLat,
    lng: currentLng,
    // direccion,
    // departamento,
    // distrito,
    // provincia,
  } = useLocation();

  const currentIconUrl = getCurrentLocationIcon();
  const mapRef = useRef<any>(null);
  const [resenaExistente, setResenaExistente] = useState<any>(null);
  const { eliminarArchivosMultiples } = useArchivo();
  const [archivosEliminados, setArchivosEliminados] = useState<string[]>([]);

   const [departamento, setDepartamento] = useState<string>("");
   const [direccion, setDireccion] = useState<string>("");
   const [distrito, setDistrito] = useState<string>("");
   const [provincia, setProvincia] = useState<string>("");


    const hasFetchedUbigeo = useRef(false);
      
    useEffect(() => {
      if (!currentLat || !currentLng) return;
      if (hasFetchedUbigeo.current) return;
  
      hasFetchedUbigeo.current = true;
  
      getUbigeoByCoords(
        currentLat,
        currentLng,
        (dep, prov, dist, direccion) => {
          console.log("Ubigeo detectado:", dep);
          setDepartamento(dep);
          setProvincia(prov);
          setDistrito(dist);
          setDireccion(direccion ?? "");
        },
        (err) => {
          console.warn("No se pudo obtener el ubigeo:", err);
        }
      );
    }, [currentLat, currentLng]);

  // 🧩 Autocompletar datos del formulario al abrir el modal
  useEffect(() => {
  if (!modalResena || !user) return;

  if (servicioSeleccionado) {
    // Buscar si el usuario ya tiene una reseña en este servicio
    const resena = servicioSeleccionado.resenas?.find(
      (r: any) => r.usuario_interno === user.cod_usuario
    );

    if (resena) {
    setResenaExistente(resena);
    reset({
      servicio: servicioSeleccionado.nombre,
      nombres: resena.autor?.nombre || user?.nombre || "",
      titulo: resena.titulo || "",
      descripcion: resena.texto || "",
    });
    setRating(resena.rating || 1);

    // ✅ Mostrar archivos previos
    if (Array.isArray(resena.archivos) && resena.archivos.length > 0) {
      const imagenes = resena.archivos.filter((a: any) => a.tipo === "imagen");
      const videos = resena.archivos.filter((a: any) => a.tipo === "video");

      // Simular "archivos seleccionados" con los ya subidos
      // Usamos objetos "simulados" porque File() no puede crearse desde URL directamente
      setSelectedImages(
        imagenes.map((img: any) => ({
          name: img.nombreOriginal,
          preview: img.ruta, // 👈 agregamos campo personalizado
          uploaded: true,
        }))
      );

      if (videos.length > 0) {
        setSelectedVideo({
          name: videos[0].nombreOriginal,
          preview: videos[0].ruta,
          uploaded: true,
        } as any);
      }
    } else {
      setSelectedImages([]);
      setSelectedVideo(null);
    }

    return;
  }

  }

  // Caso sin servicio seleccionado o sin reseña
  setResenaExistente(null);
  reset({
    servicio: servicioSeleccionado?.nombre || "",
    nombres: user?.nombre || "",
    titulo: "",
    descripcion: "",
  });
  setRating(1);
}, [modalResena, servicioSeleccionado, user, reset]);

const limpiarSeleccionServicio = () => {
  // Limpia selección de servicio y el estado de autoselección
  setServicioSeleccionado(null);
  autoSeleccionHecha.current = false;

  if (mapRef.current?.clearSelection) {
    mapRef.current.clearSelection();
  }

  // Limpia parámetro URL
  const url = new URL(window.location.href);
  url.searchParams.delete("s");
  window.history.replaceState({}, "", url.toString());
};



//   useEffect(() => {
//   if (!modalResena || !serviciosActivos?.length) return;

//   // Esperar a que la ubicación esté disponible
//   if (!currentLat || !currentLng) return;

//   // Buscar servicios dentro de 5 metros
//   const serviciosCercanos = serviciosActivos
//     .filter((servicio: any) => {
//       const lat = servicio.direccion?.latitud;
//       const lng = servicio.direccion?.longitud;
//       if (!lat || !lng) return false;
//       const distance = getDistanceInMeters(currentLat, currentLng, lat, lng);
//       return distance <= 100; // 5 metros
//     })
//     .sort((a: any, b: any) => {
//       const distA = getDistanceInMeters(currentLat, currentLng, a.direccion?.latitud, a.direccion?.longitud);
//       const distB = getDistanceInMeters(currentLat, currentLng, b.direccion?.latitud, b.direccion?.longitud);
//       return distA - distB; // ordenar del más cercano al más lejano
//     });

//   if (serviciosCercanos.length > 0) {
//     const servicioMasCercano = serviciosCercanos[0];
//     setServicioSeleccionado(servicioMasCercano);

//     // Si el mapa tiene método para enfocar
//     if (mapRef.current?.flyToService) {
//       mapRef.current.flyToService(servicioMasCercano);
//     }
//   }
// }, [modalResena, currentLat, currentLng, serviciosActivos]);
// 🧭 Seleccionar servicio más cercano solo una vez (si no hay uno ya seleccionado)
const autoSeleccionHecha = useRef<boolean | "closing">(false);

useEffect(() => {
  if (!modalResena) return;
  if (autoSeleccionHecha.current === "closing") return;
  if (!serviciosActivos?.length || !currentLat || !currentLng) return;
  if (servicioSeleccionado || autoSeleccionHecha.current) return;

  const serviciosCercanos = serviciosActivos
    .filter((servicio: any) => {
      const lat = servicio.direccion?.latitud;
      const lng = servicio.direccion?.longitud;
      if (!lat || !lng) return false;
      const distance = getDistanceInMeters(currentLat, currentLng, lat, lng);
      return distance <= 100;
    })
    .sort((a: any, b: any) => {
      const distA = getDistanceInMeters(currentLat, currentLng, a.direccion?.latitud, a.direccion?.longitud);
      const distB = getDistanceInMeters(currentLat, currentLng, b.direccion?.latitud, b.direccion?.longitud);
      return distA - distB;
    });

  if (serviciosCercanos.length > 0) {
    const servicioMasCercano = serviciosCercanos[0];
    setServicioSeleccionado(servicioMasCercano);
    autoSeleccionHecha.current = true;

    if (mapRef.current?.flyToService) {
      mapRef.current.flyToService(servicioMasCercano);
    }
  }
}, [modalResena, currentLat, currentLng, serviciosActivos]);



useEffect(() => {
  if (!modalResena || !servicioSeleccionado) return;

  // Espera unos milisegundos para asegurar que el mapa ya esté montado
  const timer = setTimeout(() => {
    if (
      mapRef.current?.flyToService &&
      servicioSeleccionado.direccion?.latitud &&
      servicioSeleccionado.direccion?.longitud
    ) {
      mapRef.current.flyToService(servicioSeleccionado);
    }
  }, 400); // puedes ajustar a 300-500 ms

  return () => clearTimeout(timer);
}, [modalResena, servicioSeleccionado]);


const onClose = () => {
  autoSeleccionHecha.current = "closing";
  setModalResena(false);

  // limpiar selección ANTES de cerrar
  setServicioSeleccionado(null);
  if (mapRef.current?.clearSelection) {
    mapRef.current.clearSelection();
  }

  reset({
    servicio: "",
    nombres: user?.nombre,
    titulo: "",
    descripcion: "",
  });
  setSelectedImages([]);
  setSelectedVideo(null);
  setRating(1);
  setIsAnonimo(false);
  setArchivosEliminados([]);

  setTimeout(() => {
    autoSeleccionHecha.current = false;
  }, 500);
};





  const handleSelectService = (servicio: any) => {
    if (!servicio) return;
    setServicioSeleccionado(servicio);
    if (
      mapRef.current?.flyToService &&
      servicio.direccion?.latitud &&
      servicio.direccion?.longitud
    ) {
      mapRef.current.flyToService(servicio);
    }
  };

  function obtenerArchivosAEliminar(resenaExistente: any): number[] {
    if (!resenaExistente || !resenaExistente.archivos) return [];
    const archivosEliminados = resenaExistente.archivos
      .filter((a: any) => a.marcadoParaEliminar) // marcados localmente
      .map((a: any) => a.ARCI_Id); // ID real en base de datos
    return archivosEliminados;
  }


  const onSubmit = async (data: FormData) => {
  await getCodUbigeo(
    departamento ?? "",
    provincia ?? "",
    distrito ?? "",
    async (codUbigeo) => {
      try {
        const direccionData = {
          DIUS_Direccion: direccion ?? undefined,
          DIUS_Latitud: currentLat ?? null,
          DIUS_Longitud: currentLng ?? null,
          DIUS_CodigoUbigeo: codUbigeo ?? undefined,
        };

        const archivos: File[] = [
          ...selectedImages.map((a) => a.file!).filter(Boolean),
        ];

        if (selectedVideo?.file) archivos.push(selectedVideo.file);

        // 🗑️ Eliminar archivos marcados antes de actualizar/crear reseña
        if (archivosEliminados.length > 0) {
          await eliminarArchivosMultiples(archivosEliminados, (success, message) => {
            if (success) {
              console.log("✅ Archivos eliminados correctamente:", message);
            } else {
              console.warn("⚠️ Error al eliminar archivos múltiples:", message);
            }
          });
        }


        const servicioData = {
          SERV_Nombre: data.servicio
        }

        const body = {
          servicio: servicioData,
          RESE_Titulo: data.titulo,
          RESE_Texto: data.descripcion,
          RESE_Rating: rating,
          RESE_Anonimo: isAnonimo,
          direccion: direccionData,
          archivos,
          SERV_Interno: servicioSeleccionado?.cod_servicio,
        };

        // Si el usuario ya tiene reseña -> actualizar
        if (resenaExistente) {
          console.log("🛠 Actualizando reseña existente:", resenaExistente);

          await updateResena(
            resenaExistente.id, // 👈 Usa el ID real del backend
            {
              RESE_Titulo: data.titulo,
              RESE_Texto: data.descripcion,
              RESE_Rating: rating,
              RESE_Anonimo: isAnonimo,
              servicio: { SERV_Nombre: data.servicio },
              archivos, // Nuevos archivos (imágenes/videos)
              eliminarArchivos: obtenerArchivosAEliminar(resenaExistente), // función que definimos abajo
            },
            (success, message) => {
              if (success) {
                console.log("✅ Reseña actualizada correctamente:", message);
                getServiciosActivos((success, _message, data) => {
                  if (success && data) {
                    setServiciosActivos(data.servicios);
                    setServiciosFilterActivos(data.servicios);
                    limpiarSeleccionServicio(); // 👈 limpiar antes de cerrar
                    onClose();
                  }
                });
              } else {
                console.warn("⚠️ Error al actualizar reseña:", message);
              }
            }
          );
        } else {
          // Si no tiene reseña -> crear
          await createResena(body, (success, message) => {
            if (success) {
              getServiciosActivos((success, _message, data) => {
                if (success && data) {
                  setServiciosActivos(data.servicios);
                  setServiciosFilterActivos(data.servicios);
                  onClose();
                }
              });
            } else {
              console.warn(message);
            }
          });
        }
        setArchivosEliminados([]);

        // 🧹 Limpieza total del estado de servicio seleccionado
        setServicioSeleccionado(null);
        autoSeleccionHecha.current = false;

        if (mapRef.current?.clearSelection) {
          mapRef.current.clearSelection();
        }

        // 🧭 También limpiar parámetro de URL "s"
        const url = new URL(window.location.href);
        url.searchParams.delete("s");
        window.history.replaceState({}, "", url.toString());

        // 👌 Finalmente cerramos el modal
        onClose();

      } catch (error) {
        console.error(error);
      }
    }
  );
};


  return (
    <CustomModal
      isOpen={modalResena}
      onClose={onClose}
      width="600px"
      height="auto"
      closable={true}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 text-gray-800"
      >
        {/* 🏆 Título general */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          ¡Cuéntanos tu experiencia!
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Comparte tu opinión sobre el servicio recibido. Tu reseña ayuda a otros usuarios a
          tomar mejores decisiones y mejora la calidad de los servicios.
        </p>

        {/* 🏷️ Servicio */}
        <Controller
          name="servicio"
          control={control}
          rules={{ required: "El nombre del servicio es obligatorio" }}
          render={({ field }) => {
            const isOwner = servicioSeleccionado?.cod_usuario === user?.cod_usuario;
            return (
              <CustomInput
                {...field}
                label="Nombre del Servicio"
                placeholder="Ej. Limpieza, transporte, plomería..."
                fullWidth
                size="md"
                error={!!errors.servicio}
                helperText={errors.servicio?.message}
                variant="primary"
                disabled={!!servicioSeleccionado && !isOwner}
              />
            );
          }}
        />


        {/* 👤 Nombre */}
        <Controller
          name="nombres"
          control={control}
          rules={{ required: "Tu nombre es obligatorio" }}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Tu nombre"
              placeholder="Ej. Juan Pérez o 'Cliente satisfecho'"
              fullWidth
              size="md"
              error={!!errors.nombres}
              helperText={errors.nombres?.message}
              variant="primary"
            />
          )}
        />

        {/* 🗺️ Mapa */}
        <div>
          <p className="text-sm font-medium mb-1">Ubicación del servicio</p>
          <p className="text-xs text-gray-500 mb-2">
            Marca o confirma en el mapa dónde se brindó el servicio.
          </p>
          <div className="h-[250px] w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <CustomMapa
              ref={mapRef}
              type="service"
              lat={currentLat ?? -12.0464}
              lng={currentLng ?? -77.0428}
              zoom={17}
              customIcon={currentIconUrl}
              servicios={serviciosActivos}
              servicioSeleccionado={servicioSeleccionado}
              onSelectServicio={handleSelectService}
            />
          </div>
        </div>

        {/* 🏷️ Título */}
        <Controller
          name="titulo"
          control={control}
          rules={{ required: "Agrega un título a tu reseña" }}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Título de la reseña"
              placeholder="Ej. Excelente atención y calidad"
              fullWidth
              size="md"
              error={!!errors.titulo}
              helperText={errors.titulo?.message}
              variant="primary"
            />
          )}
        />

        {/* 📝 Descripción */}
        <Controller
          name="descripcion"
          control={control}
          rules={{
            required: "Describe tu experiencia",
            minLength: { value: 10, message: "Mínimo 10 caracteres" },
          }}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Descripción"
              placeholder="Cuéntanos más sobre tu experiencia..."
              fullWidth
              multiline
              rows={4}
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message}
              variant="primary"
            />
          )}
        />

        {/* ⭐ Calificación */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Puntuación general</label>
          <p className="text-xs text-gray-500">
            Toca las estrellas para calificar tu experiencia.
          </p>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) =>
              rating >= star ? (
                <FaStar
                  key={star}
                  className="text-primary cursor-pointer text-xl transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                />
              ) : (
                <FaRegStar
                  key={star}
                  className="text-gray-400 cursor-pointer text-xl transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                />
              )
            )}
          </div>
        </div>

        {/* 📸 Imágenes y Video */}
<div className="flex flex-col gap-4">
  <div>
    <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
      <FaImage className="text-[#FF6C4F]" />
      Agrega imágenes o un video
    </h3>
    <p className="text-xs text-gray-500 mt-1">
      Las imágenes y videos hacen tu reseña más confiable y atractiva.  
      Puedes subir hasta <strong>3 imágenes</strong> y <strong>1 video</strong> (máx. 100 MB).
    </p>
  </div>

  <div className="flex flex-col gap-5 p-5 border border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

    {/* Subida de imágenes */}
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <FaImage className="text-[#FF6C4F]" />
        Imágenes
      </label>
      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-[#FF6C4F] hover:bg-[#FFF4F1] transition-all">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 3) {
              alert("Solo puedes subir hasta 3 imágenes.");
              e.target.value = "";
              return;
            }
            setSelectedImages(
              files.map((file) => ({
                name: file.name,
                preview: URL.createObjectURL(file),
                uploaded: false,
                file,
              }))
            );

          }}
        />
        <FaImage className="text-[#FF6C4F] text-3xl mb-1" />
        <span className="text-sm text-gray-600">
          Arrastra o haz clic para subir imágenes
        </span>
      </label>

      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {selectedImages.map((img, i) => (
            <div
              key={i}
              className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={img.preview}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const imagen = selectedImages[i];
                  if (imagen.uploaded && imagen.preview) {
                    const archivoId = getArchivoIdFromPreview(imagen.preview);
                    // ✅ Guardamos el ID para eliminarlo luego en onSubmit
                    setArchivosEliminados((prev) => [...prev, archivoId]);
                  }
                  setSelectedImages(selectedImages.filter((_, idx) => idx !== i));
                }}




              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Subida de video */}
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <FaVideo className="text-[#FF6C4F]" />
        Video
      </label>
      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-[#FF6C4F] hover:bg-[#FFF4F1] transition-all">
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 100 * 1024 * 1024) {
              alert("El video no puede superar los 100 MB.");
              e.target.value = "";
              return;
            }
            if (file) {
              setSelectedVideo({
                name: file.name,
                preview: URL.createObjectURL(file),
                uploaded: false,
                file,
              });
            } else {
              setSelectedVideo(null);
            }

          }}
        />
        <FaVideo className="text-[#FF6C4F] text-3xl mb-1" />
        <span className="text-sm text-gray-600">
          Arrastra o haz clic para subir un video
        </span>
      </label>

      {selectedVideo && (
        <div className="relative mt-3">
          <video
            src={selectedVideo?.preview}
            controls
            className="w-full h-48 rounded-xl border border-gray-300 shadow-md"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md"
            onClick={() => {
              if (selectedVideo?.uploaded && selectedVideo.preview) {
                const archivoId = getArchivoIdFromPreview(selectedVideo.preview);
                setArchivosEliminados((prev) => [...prev, archivoId]);
              }
              setSelectedVideo(null);
            }}

          >
            ✕
          </button>
        </div>
      )}
    </div>
  </div>
</div>


        {/* 🕵️ Anónimo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonimo"
            checked={isAnonimo}
            onChange={(e) => setIsAnonimo(e.target.checked)}
          />
          <label htmlFor="anonimo" className="text-sm text-gray-700">
            Publicar mi reseña de forma anónima
          </label>
        </div>

        {/* 📤 Botón Enviar */}
        <div className="flex justify-center w-full mt-2">
          <CustomButton
            text={resenaExistente ? "Actualizar reseña" : "Publicar reseña"}
            fullWidth
            type="submit"
            variant="primary"
            fontWeight={600}
            size="md"
            fontSize="16px"
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default ModalComentario;
