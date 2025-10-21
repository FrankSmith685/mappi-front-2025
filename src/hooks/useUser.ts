/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import type { ChangeEmailRequest, ChangeEmailResponse, ChangePasswordRequest, ChangePasswordResponse, UpdateUsuarioCompleto, UsuarioData, UsuarioResponse,  } from "../interfaces/IUser";
import { useAppState } from "./useAppState";

export const useUser = () => {

    const {setUser,setLoadingUser, setModifiedUser} = useAppState();


    const getUserInfo = async (
        callback?: (user: UsuarioData) => void
    ): Promise<void> => {
        try {
            setLoadingUser(true)
            const response = await apiWithAuth.get<UsuarioResponse>(`/user/user-info`);
            const { success, data, message } = response.data;

            if (success && data) {
                callback?.(data);
                setUser(data);
                setModifiedUser(data);
            } else {
                console.warn("No se encontró información del usuario. Mensaje:", message);
            }
        } catch (error) {
            handleApiError(error);
        } finally{
            setLoadingUser(false);
        }
    };

    const updateUser = async (
        data: UpdateUsuarioCompleto,
        callback?: (user: UsuarioData, message: string) => void
        ): Promise<void> => {
        try {
            const response = await apiWithAuth.put<UsuarioResponse>('/user/update-user', data);
            const { success, message, data: updatedUser } = response.data;

            if (success && updatedUser) {
                setUser(updatedUser);
                setModifiedUser(updatedUser);
                callback?.(updatedUser, message);
            } else {
            console.warn("Error al actualizar:", message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const changePassword = async (
        data: ChangePasswordRequest,
        callback?: (success: boolean, message: string) => void
        ): Promise<void> => {
        try {
            const response = await apiWithAuth.put<ChangePasswordResponse>('/user/change-password', data);
            const { success, message } = response.data;

            if (callback) callback(success, message);
        } catch (error) {
            handleApiError(error);
            if (callback) callback(false, "Error al cambiar la contraseña");
        }
    };

    const changeEmail = async (
        data: ChangeEmailRequest,
        callback?: (success: boolean, message: string) => void
        ): Promise<void> => {
        try {
            const response = await apiWithAuth.put<ChangeEmailResponse>('/user/change-email', data);
            const { success, message } = response.data;

            if (callback) callback(success, message);
        } catch (error) {
            handleApiError(error);
            if (callback) callback(false, "Error al cambiar el correo");
        }
    };

    const linkAccount = async (
        proveedor: "correo" | "google" | "facebook",
        emailProveedor?: string,
        clave?: string,
        callback?: (success: boolean, message: string) => void
    ): Promise<void> => {
        try {
            const response = await apiWithAuth.post("/user/link-account", {
            proveedor,
            emailProveedor,
            clave,
            });

            const { success, message, data } = response.data;

            if (success && data) {
            // actualizar estado global
            setUser(data);
            }

            callback?.(success, message);
        } catch (error: any) {
            handleApiError(error);
            callback?.(false, error.response.data.message);
        }
        };

    const unlinkAccount = async (
        proveedor: "correo" | "google" | "facebook",
        callback?: (success: boolean, message: string) => void
    ): Promise<void> => {
        try {
            const response = await apiWithAuth.delete("/user/unlink-account", {
            data: { proveedor },
            });

            const { success, message, data } = response.data;

            if (success && data) {
            setUser(data);
            }

            callback?.(success, message);
        } catch (error:any) {
            handleApiError(error);
            callback?.(false, error.response.data.message);
        }
    };


    const deleteOwnAccount = async (
        password: string,
        callback?: (success: boolean, message: string) => void
        ): Promise<void> => {
        try {
            const response = await apiWithAuth.delete('/user/delete-account', {
            data: { password },
            });
            const { success, message } = response.data;
            if (callback) callback(success, message);
        } catch (error) {
            handleApiError(error);
            if (callback) callback(false, "Error al eliminar la cuenta");
        }
    };

    const deleteOwnAccountGoogle = async (
        idToken: string,
        callback?: (success: boolean, message: string) => void
    ): Promise<void> => {
        try {
            const response = await apiWithAuth.delete("/user/delete-account", {
            data: { idToken }, // 👈 se envía al backend
            });
            const { success, message } = response.data;
            if (callback) callback(success, message);
        } catch (error) {
            handleApiError(error);
            if (callback) callback(false, "Error al eliminar la cuenta con Google");
        }
    };




    return {
        getUserInfo,
        updateUser,
        changePassword,
        changeEmail,
        deleteOwnAccount,
        linkAccount,
        unlinkAccount,
        deleteOwnAccountGoogle
    };
   
};