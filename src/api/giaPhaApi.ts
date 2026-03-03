import axios, { type InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  GiaPhaTreeResponse,
  HoResponse,
  HoListResponse,
} from '../types/giaPha.types';
import { endpointBe } from '../utils/contant';

const API_BASE_URL = import.meta.env.VITE_API_URL || endpointBe + '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const giaPhaApi = {
  /**
   * Lấy gia phả của user hiện tại (yêu cầu đăng nhập)
   */
  getMyGiaPhaTree: async (includeDeleted: boolean = true): Promise<ApiResponse<GiaPhaTreeResponse>> => {
    const response = await apiClient.get('/GiaPha/my-tree', {
      params: { includeDeleted }
    });
    return response.data;
  },

  /**
   * Lấy danh sách tất cả họ
   */
  getAllHo: async (): Promise<ApiResponse<HoListResponse[]>> => {
    const response = await apiClient.get('/Ho');
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết họ
   */
  getHoById: async (hoId: string): Promise<ApiResponse<HoResponse>> => {
    const response = await apiClient.get(`/Ho/${hoId}`);
    return response.data;
  },
};
