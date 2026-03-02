// Album
export interface Album {
  id: string;
  tenAlbum: string;
  thanhVienId?: string;
  suKienId?: string;
  tepTins: TepTin[];
  createdAt: string;
}

// AuditLog
export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  changedBy?: string;
  changedAt: string;
  oldValues?: string;
  newValues?: string;
}

// HonNhan
export interface HonNhan {
  id: string;
  chongId: string;
  voId: string;
  ngayKetHon?: string;
  noiKetHon?: string;
  ngayLyHon?: string;
}

// Ho
export interface Ho {
  id: string;
  tenHo: string;
  moTa?: string;
  hinhAnh?: string;
  cacChiHo: ChiHo[];
}

// ChiHo
export interface ChiHo {
  id: string;
  tenChiHo: string;
  moTa?: string;
  idHo: string;
  truongChiId?: string;
  thanhViens: ThanhVien[];
}

// Comment
export interface Comment {
  id: string;
  noiDung: string;
  thanhVienId?: string;
  suKienId?: string;
  createdById?: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  noiDung: string;
  nguoiNhanId?: string;
  isGlobal: boolean;
  createdAt: string;
  daDoc: boolean;
  chiHoId?: string;
}

// QuanHeChaCon
export interface QuanHeChaCon {
  id: string;
  chaMeId: string;
  conId: string;
  loaiQuanHe: string;
}

// SuKien
export interface SuKien {
  id: string;
  thanhVienId: string;
  loaiSuKien: string;
  ngayXayRa?: string;
  diaDiem?: string;
  moTa?: string;
}

// TaiKhoanNguoiDung
export interface TaiKhoanNguoiDung {
  id: string;
  tenDangNhap: string;
  matKhauMaHoa: string;
  email: string;
  gioiTinh: string;
  role: string;
  activationCode?: string;
  enabled: boolean;
  refreshTokenExpiry?: string;
  refreshToken?: string;
}

// ThanhTuu
export interface ThanhTuu {
  id: string;
  thanhVienId: string;
  tenThanhTuu: string;
  namDatDuoc?: number;
  moTa?: string;
}

// ThanhVien
export interface ThanhVien {
  id: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh?: string;
  noiSinh?: string;
  ngayMat?: string;
  noiMat?: string;
  doiThu: number;
  tieuSu?: string;
  anhDaiDien?: string;
  email: string;
  chiHoId?: string;
}

// TepTin
export interface TepTin {
  id: string;
  duongDan: string;
  loaiTep: string;
  thanhVienId?: string;
  suKienId?: string;
  moTa?: string;
}
