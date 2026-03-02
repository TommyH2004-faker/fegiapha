import { getCurrentHoIdByToken, getRoleInHoByToken } from './JwtService';

/**
 * Service quản lý thông tin user permission
 * Đọc trực tiếp từ JWT token thay vì localStorage
 */

export interface UserPermission {
  roleInHo: number; // 0 = Trưởng họ (full quyền), 1 = Thành viên (chỉ xem)
  selectedHoId: string | null;
}

class PermissionService {
  /**
   * Lấy role hiện tại từ JWT token
   */
  getRoleInHo(): number {
    return getRoleInHoByToken();
  }

  /**
   * Check xem user có phải Trưởng họ không (có full quyền)
   */
  isTruongHo(): boolean {
    return this.getRoleInHo() === 0;
  }

  /**
   * Check xem user có quyền chỉnh sửa không
   */
  canEdit(): boolean {
    return this.isTruongHo();
  }

  /**
   * Check xem user có quyền thêm/xóa không
   */
  canModify(): boolean {
    return this.isTruongHo();
  }

  /**
   * Lấy thông tin permission đầy đủ từ JWT token
   */
  getPermission(): UserPermission {
    return {
      roleInHo: this.getRoleInHo(),
      selectedHoId: getCurrentHoIdByToken(),
    };
  }

  /**
   * @deprecated Không còn cần thiết vì đọc từ JWT
   * Chỉ giữ lại để tương thích với code cũ
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPermission(_roleInHo: number | null | undefined, _selectedHoId: string | null | undefined): void {
    // Không làm gì cả - chỉ để tương thích
    console.warn('permissionService.setPermission() is deprecated. Permission is now read from JWT token.');
  }

  /**
   * @deprecated Không còn cần thiết vì đọc từ JWT  
   * Chỉ giữ lại để tương thích với code cũ
   */
  clearPermission(): void {
    // Không làm gì cả - chỉ để tương thích
    console.warn('permissionService.clearPermission() is deprecated. Permission is stored in JWT token only.');
  }
}

export const permissionService = new PermissionService();
