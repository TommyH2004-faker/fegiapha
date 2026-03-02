import axios from "axios";
import type { Ho } from "../model/entities";
import { endpointBe } from "../utils/contant";

export interface HoWithThuyToDto {
  hoId: string;
  tenHo: string;
  tenThuyTo?: string;
  ngaySinhThuyTo?: string;
  displayText: string;
}
interface ApiResponse<T> {
    isSuccess: boolean;
    data: {
        $values: T[];
    };
    errorType: string | null;
    errorMessage: string;
}

export const getAvailableHos = async (): Promise<HoWithThuyToDto[]> => {
    const response = await axios.get<ApiResponse<HoWithThuyToDto>>(
        `${endpointBe}/api/Ho/available`
    );

    // 🔥 LẤY ĐÚNG MẢNG
    return response.data?.data?.$values ?? [];
};

export default function getAllHo(): Promise<Ho[]> {
  return fetch(`${endpointBe}/api/Ho`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Lỗi khi lấy danh sách Họ");
      }
      return res.json();
    })
    .then((result) => {
      if (!result.isSuccess) {
        throw new Error(result.errorMessage || "Lấy dữ liệu thất bại");
      }
      return result.data as Ho[];
    });
}

export function getMyHo(): Promise<Ho[]> {
  const token = localStorage.getItem('token');
  
  return fetch(`${endpointBe}/api/Ho/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(async (res) => {
      const result = await res.json();
      
      if (!res.ok) {
        console.error('❌ Status:', res.status);
        console.error('❌ API Error Response:', JSON.stringify(result, null, 2));
        throw new Error(result.errorMessage || result.title || "Lỗi khi lấy danh sách Họ của bạn");
      }
      
      if (!result.isSuccess) {
        console.error('❌ Result not success:', JSON.stringify(result, null, 2));
        throw new Error(result.errorMessage || "Lấy dữ liệu thất bại");
      }
      return result.data as Ho[];
    });
}

export async function getTop3Ho(): Promise<Ho[]> {
  const res = await fetch(`${endpointBe}/api/Ho/top3`);
  const json = await res.json();

  if (!json.isSuccess) {
    throw new Error(json.errorMessage);
  }

  return json.data as Ho[];
}
