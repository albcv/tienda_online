// ========================================
// Archivo: ./perfil.ts
// ========================================
import axios from './axios';

// Interfaces para el perfil y cambio de contraseña
export interface PerfilData {
  id?: number;
  username: string;
  email: string;
  [key: string]: any; // Datos adicionales que pueda devolver el backend
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface PasswordChangeResponse {
  message: string;
  error?: string;
}

export const getPerfil = async (): Promise<PerfilData> => {
  try {
    const response = await axios.get<PerfilData>('/perfil/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

export const cambiarPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<PasswordChangeResponse> => {
  try {
    const response = await axios.post<PasswordChangeResponse>('/cambiar-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Error al cambiar contraseña');
    } else {
      throw new Error('Error de conexión');
    }
  }
};