import axiosInstance from "../Config/axiosConfig";


interface CreateSuKienData {
  thanhVienId: string;
  loaiSuKien: string;
  moTa?: string;
  ngayXayRa: string;
  diaDiem?: string;
}

interface UpdateSuKienData {
  thanhVienId: string;
  loaiSuKien: string;
  moTa?: string;
  ngayXayRa: string;
  diaDiem?: string;
}

export const getAllSuKien = async () => {
  const response = await axiosInstance.get("/api/SuKien");
  return response.data;
};

export const createSuKien = async (data: CreateSuKienData) => {
  const response = await axiosInstance.post("/api/SuKien", data);
  return response.data;
};

export const updateSuKien = async (id: string, data: UpdateSuKienData) => {
  const response = await axiosInstance.put(`/api/SuKien/${id}`, data);
  return response.data;
};

export const getThanhVien = async () => {
  const response = await axiosInstance.get("/api/ThanhVien");
  return response.data;
};