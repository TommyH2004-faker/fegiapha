

import axiosInstance from "../Config/axiosConfig";
import type { ApiResponse } from "../types/giaPha.types";
interface User {
  id: string;
  tenDangNhap: string;
  gmail: string | null;
  enabled: boolean;
    avatar: string | null;
    gioiTinh: boolean;
    soDienThoai: string | null;
    availableHos: { id: string; tenHo: string; role: string }[];
}

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(
    `/api/TaiKhoanNguoiDung/${id}`
  );

  if (!response.data.isSuccess) {
    throw new Error(response.data.errorMessage);
  }

  return response.data.data; 
};

