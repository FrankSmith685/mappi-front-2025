// interfaces/IServicioActivoPremium.ts

export interface ObtenerServicioActivoPremiumResponse {
  success: boolean;
  message: string;
  data: ServicioActivoDataPremium[];
}

export interface ServicioActivoDataPremium {
  SERV_Interno: string;
  SERV_Nombre: string;
  SERV_Descripcion: string;
  SERV_Estado: boolean;
  SERV_Archivado: boolean;
  SERV_FechaRegistro: string;
  USUA_Interno: string;
  SUBC_Id: number;
  SERV_Abierto24h: boolean;
  SERV_HoraInicio: string | null;
  SERV_HoraFin: string | null;
  SERV_Delivery: boolean;

  Subcategoria: {
    SUBC_Id: number;
    SUBC_Nombre: string;
    Categoria: {
      CATE_Id: number;
      CATE_Nombre: string;
    };
  };

  Archivos: {
    ARCH_ID: string;
    ARCH_Tipo: string;
    ARCH_Ruta: string;
  }[];

  Usuario: {
    USUA_Interno: string;
    USUA_Nombre: string;
    USUA_Apellido: string;

    Empresas: {
      EMPR_Interno: string;
      EMPR_RazonSocial: string;
    }[];

    PlanesAsignados: {
      PLUS_Id: number;
      USUA_Interno: string;
      PLAN_Id: number;
      TIPL_Id: number;
      PLUS_TokenPago: string;
      PLUS_MontoPagado: string;
      PLUS_Moneda: string;
      PLUS_FechaInicio: string;
      PLUS_FechaExpiracion: string;
      PLUS_EsPremium: boolean;
      PLUS_EstadoPago: "pendiente" | "pagado" | "fallido" | "gratuito";
      PLUS_EstadoPlan: "activo" | "inactivo" | "expirado" | "cancelado";
      Plan: {
        PLAN_Id: number;
        PLAN_TipoUsuario: string;
        PLAN_Precio: string;
        PLAN_DuracionMeses: number;
        TipoPlan: {
          TIPL_Id: number;
          TIPL_Nombre: string;
        };
      };
    }[];
  };
}
