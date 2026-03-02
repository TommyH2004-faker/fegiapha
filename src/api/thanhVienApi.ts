import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/giaPha.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export interface ThanhVienResponse {
  id: string;
  avatar: string | null;
  hoTen: string;
  gioiTinh: boolean;
  ngaySinh: string;
  noiSinh: string | null;
  ngayMat: string | null;
  noiMat: string | null;
  doiThu: number;
  tieuSu: string | null;
  chiHoId: string | null;
  trangThai: boolean;
  hoId: string;
  gmail: string;
}

export interface CreateThanhVienRequest {
  hoTen: string;
  gioiTinh: boolean;
  ngaySinh: string;
  noiSinh: string;
  trangThai: boolean;
  chiHoId?: string | null;
  hoId?: string; // Optional: vợ/chồng có thể từ họ khác
  tieuSu?: string;
  parentId?: string | null;
}

export interface UpdateThanhVienRequest {
  id: string;
  hoTen: string;
  gioiTinh: boolean;
  ngaySinh: string;
  noiSinh: string;
  ngayMat?: string | null;
  noiMat?: string | null;
  tieuSu?: string;
  trangThai: boolean;
}

export const thanhVienApi = {
  /**
   * Tạo thành viên mới
   */
  create: async (data: CreateThanhVienRequest): Promise<ThanhVienResponse> => {
    const response = await apiClient.post('/ThanhVien', data);
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết thành viên
   */
  getById: async (id: string): Promise<ThanhVienResponse> => {
  const response = await apiClient.get(`/ThanhVien/${id}`);
  return response.data;
},

  /**
   * Cập nhật thành viên
   */
  update: async (data: UpdateThanhVienRequest): Promise<ApiResponse<ThanhVienResponse>> => {
    const response = await apiClient.put(`/ThanhVien/${data.id}`, data);
    return response.data;
  },

  /**
   * Xóa thành viên
   */
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.delete(`/ThanhVien/${id}`);
    return response.data;
  },

  /**
   * Upload ảnh đại diện
   */
  uploadAvatar: async (id: string, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/ThanhVien/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};