import axios from 'axios';
import type { ApiResponse } from '../types/giaPha.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface HonNhanResponse {
  id: string;
  chongId: string;
  voId: string;
  ngayKetHon: string;
  trangThai: boolean;
  ngayLyHon: string | null;
}

export interface CreateHonNhanRequest {
  chongId: string;
  voId: string;
  ngayKetHon: string;
}

export const honNhanApi = {
  /**
   * Tạo quan hệ hôn nhân mới
   */
  create: async (data: CreateHonNhanRequest): Promise<ApiResponse<HonNhanResponse>> => {
    const response = await apiClient.post('/HonNhan', data);
    return response.data;
  },
};
