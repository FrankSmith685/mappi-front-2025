/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { RegisterAuthResponse } from "../interfaces/auth";
import { useAppState } from "./useAppState";

export const useAuth = () => {

    const {setRefreshtoken,setAccessToken, setUser, setMenuOpen,setCompany, setTypeUserAuth } = useAppState();

    const loginUser = async (
        credentials: { correo: string; proveedor: "correo" | "google" | "facebook" ; contraseña: string },
        callback?: (response: { success: boolean; message?: string }) => void
    ): Promise<void> => {
        try {
        const response = await api.post<RegisterAuthResponse>("/auth/login", credentials);
        const { success, message, accessToken, refreshToken } = response.data;

            if (success && accessToken && refreshToken) {
                setAccessToken(accessToken);
                setRefreshtoken(refreshToken);
                callback?.({ success, message });
            }
        } catch (error:any) {
            handleApiError(error);
            callback?.({ success: false, message: error.response.data.message});
        }
    };

    const registerUser = async (
        data: {
            nombre?: string;
            apellido?: string;
            correo: string;
            telefono?: number;
            contrasena: string;
            dni?: number;
            proveedor?:string;
            type_user?: number;
        },
        callback?: (response: { success: boolean; message?: string }) => void
        ): Promise<void> => {
        try {
            const response = await api.post<RegisterAuthResponse>(`/auth/register`, data);
            const { success, message, accessToken, refreshToken } = response.data;
            callback?.({ success, message });
            if(accessToken && refreshToken) {
                setAccessToken(accessToken);
                setRefreshtoken(refreshToken);
            }
        } catch (error:any) {
            handleApiError(error);
            callback?.({ success: false, message: error.response.data.message});
        }
    };

    const loginOrRegisterUser = async (
        data: {
        correo: string;
        contrasena?: string;
        proveedor?: "correo" | "google" | "facebook";
        nombre?: string;
        apellido?: string;
        telefono?: string;
        dni?: string;
        fotoPerfil?: string;
        type_user?: number;
        },
        callback?: (response: { success: boolean; message?: string }) => void
    ): Promise<void> => {
        try {
        const response = await api.post<RegisterAuthResponse>("/auth/auth", data);
        const { success, message, accessToken, refreshToken } = response.data;

        if (success && accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshtoken(refreshToken);
            callback?.({ success, message });
        } else {
            callback?.({ success: false, message: message || "Error desconocido en autenticación" });
        }
        } catch (error: any) {
        handleApiError(error);
        callback?.({
            success: false,
            message: error.response?.data?.message || "Error en autenticación automática",
        });
        }
    };

    const logout = (): void => {
        setAccessToken(null);
        setRefreshtoken(null);
        setUser(null);
        setCompany(null)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setMenuOpen(false);
        setTypeUserAuth(null);
    };

   const sendResetEmail = async (
        correo: string,
        callback?: (response: { success: boolean; message?: string }) => void
        ): Promise<void> => {
        try {
            const response = await api.post(`/auth/send-reset-email`, { correo });
            const { success, message } = response.data;
            callback?.({ success, message });
        } catch (error: any) {
            handleApiError(error);
            callback?.({
            success: false,
            message: error.response?.data?.message || 'Error al enviar el correo de recuperación.',
            });
        }
    };

    const validateResetToken = async (
        token: string,
        callback?: (isValid: boolean, message?: string) => void
    ): Promise<void> => {
        try {
            const response = await api.post(`/auth/validate-reset-token`, {
                token
            });
            const { success, message } = response.data;
            callback?.(success, message);
        } catch (error: any) {
            handleApiError(error);
            callback?.(false, error.response?.data?.message || 'Token inválido o expirado');
        }
    };

    const resetPassword = async (
        token: string,
        nuevaContraseña: string,
        callback?: (response: { success: boolean; message?: string }) => void
        ): Promise<void> => {
        try {
            const response = await api.post(`/auth/reset-password`, {
            token,
            nuevaContraseña,
            });
            const { success, message } = response.data;
            callback?.({ success, message });
        } catch (error: any) {
            handleApiError(error);
            callback?.({
            success: false,
            message: error.response?.data?.message || 'Error al restablecer la contraseña.',
            });
        }
    };

    return {
        registerUser,
        logout,
        loginUser,
        sendResetEmail,
        validateResetToken,
        resetPassword,
        loginOrRegisterUser
    };
};
