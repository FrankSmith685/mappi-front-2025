/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

interface CulqiOrderRequest {
  amount: number;
  currency_code: string;
  description: string;
  order_number: string;
  expiration_date: string;
  client_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  confirm: boolean;
}

interface CulqiOrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CulqiChargeRequest {
  amount: number;
  currency_code: string;
  email: string;
  source_id: string; // token del cliente (tarjeta, yape, etc.)
  capture: boolean;
  description: string;
  installments: number;
  metadata?: Record<string, any>;
}

interface CulqiChargeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useCulqi = () => {
  /**
   * Crear una orden de pago en Culqi
   */
  const createOrder = async (
    orderData: CulqiOrderRequest,
    callback?: (data: any) => void
  ): Promise<void> => {
    try {
      const response = await api.post<CulqiOrderResponse>(
        "/culqi/crear-orden",
        orderData
      );

      const { success, data, message } = response.data;

      if (success) {
        console.log("Orden Culqi creada:", data);
        callback?.(data);
      } else {
        console.warn("Error al crear orden Culqi:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * Crear un cargo (charge) en Culqi con el token del cliente
   */
  const createCharge = async (
    chargeData: CulqiChargeRequest,
    callback?: (data: any) => void
  ): Promise<void> => {
    try {
      const response = await api.post<CulqiChargeResponse>(
        "/culqi/crear-cargo",
        chargeData
      );

      const { success, data, message } = response.data;

      if (success) {
        console.log("Cargo Culqi exitoso:", data);
        callback?.(data);
      } else {
        console.warn("Error al crear cargo Culqi:", message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    createOrder,
    createCharge,
  };
};
