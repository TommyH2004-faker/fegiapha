// ============================================
// GIA PHẢ DOMAIN TYPES
// ============================================

export interface VoChongDto {
  honNhanId: string;
  voChongId: string;
  hoTen: string;
  ngaySinh: string | null;  // BE có thể trả về null
  ngayMat: string | null;
  avatar: string | null;
  tieuSu: string | null; // ✅ Tiểu sử của vợ/chồng
  ngayKetHon: string | null;  // BE có thể trả về null khi chưa có ngày cụ thể
  ngayLyHon: string | null;
  trangThaiHonNhan: boolean;
  conIds: string[];
  isDeleted: boolean; // ✅ Đánh dấu vợ/chồng đã bị xóa
}

export interface GiaPhaNode {
  id: string;
  hoTen: string;
  gioiTinh: boolean;
  ngaySinh: string | null;  // BE có thể trả về null
  ngayMat: string | null;
  level: number;
  tieuSu: string | null;
  avatar: string | null;
  hoId: string;
  chiHoId: string | null;
  danhSachVoChong: VoChongDto[];
  con: GiaPhaNode[];
  hasChildren: boolean;
  tongSoCon: number;
  isDeleted: boolean; // ✅ Đánh dấu thành viên đã bị xóa
}

export interface GiaPhaTreeResponse {
  tenHo: string;
  hoId: string;
  thuyTo: GiaPhaNode;
  tongSoThanhVien: number;
  soCapDo: number;
  ngayTao: string;
}

// ============================================
// HỌ TYPES
// ============================================

export interface HoResponse {
  id: string;
  tenHo: string;
  moTa: string | null;
  queQuan: string | null;
  hinhAnh: string | null;
  thuyToId: string | null;
  ngayTao: string;
}

export interface HoListResponse {
  id: string;
  tenHo: string;
  queQuan: string | null;
  thuyToId: string | null;
  soThanhVien: number;
}

// ============================================
// API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  errorType: string | null;
  errorMessage: string;
  errors: string[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
