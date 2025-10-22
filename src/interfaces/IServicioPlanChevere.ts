/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ObtenerServicioActivoChevereResponse {
  success: boolean;
  message: string;
  data: ServicioActivoDataChevere[];
}

export interface ServicioActivoDataChevere {
  SERV_Interno: string;
  SERV_Nombre: string;
  SERV_Descripcion: string;
  SERV_Estado: boolean;
  SERV_Archivado: boolean;
  SERV_FechaRegistro: string;
  USUA_Interno: string;
  SUBC_Id: number;
  SERV_Abierto24h: boolean;
  SERV_HoraInicio: string;
  SERV_HoraFin: string;
  SERV_Delivery: boolean;

  Subcategoria: {
    SUBC_Id: number;
    SUBC_Nombre: string;
    Categoria: {
      CATE_Id: number;
      CATE_Nombre: string;
    };
  };

  Archivos: any[];

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
      PLUS_EstadoPago: string;
      PLUS_EstadoPlan: string;

      Plan: {
        PLAN_Id: number;
        PLAN_TipoUsuario: string;
        PLAN_Precio: string;
        TipoPlan: {
          TIPL_Id: number;
          TIPL_Nombre: string;
        };
      };
    }[];
  };
}
