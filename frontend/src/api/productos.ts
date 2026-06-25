import axiosInstance from './axios';
import { API_URL } from './config';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  moneda: { id: number; nombre: string; codigo: string; simbolo: string };
  categoria: { id: number; nombre: string };
  ruta_imagen: string | null;
}

export interface ProductosResponse {
  total: number;
  limit: number;
  offset: number;
  results: Producto[];
}

export const getProductos = async (
  categoria_id?: number,
  search?: string,
  offset: number = 0,
  limit: number = 100
): Promise<ProductosResponse> => {
  const params = new URLSearchParams();
  if (categoria_id) params.append('categoria_id', categoria_id.toString());
  if (search) params.append('search', search);
  params.append('offset', offset.toString());
  params.append('limit', limit.toString());
  const response = await axiosInstance.get(`${API_URL}/productos/`, { params });
  return response.data;
};