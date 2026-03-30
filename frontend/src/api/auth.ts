// ========================================
// Archivo: ./auth.ts
// ========================================
import axios from './axios.ts';

// Interfaces para los datos de autenticación
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  numero_tarjeta?: string;
  telefono?: string;
  direccion?: string;
  [key: string]: any; // Permitir campos adicionales si es necesario
}

export interface LoginResponse {
  token: string;
  user?: any;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>('/login/', { username, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.Error || 'Error en el login');
    } else if (error.request) {
      throw new Error('No se pudo conectar al servidor');
    } else {
      throw new Error('Error al enviar la petición');
    }
  }
};

export const registerUser = async (userData: RegisterData): Promise<any> => {
  try {
    const response = await axios.post('/register/', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw new Error('No se pudo conectar al servidor');
    } else {
      throw new Error('Error al enviar la petición');
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post('/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
    // Asegurar limpieza incluso si falla la petición
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};