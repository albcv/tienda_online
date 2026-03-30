import axiosInstance from './axios';
import { API_URL } from './config';

export interface CompraPayload {
  total: number;
  productos: number[];
  moneda: number;  
}

export const crearCompra = async (data: CompraPayload) => {
  const response = await axiosInstance.post(`${API_URL}/compras/`, data);
  return response.data;
};