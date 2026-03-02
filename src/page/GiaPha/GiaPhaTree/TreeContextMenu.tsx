import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip } from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  PhotoCamera,
  Lock,
} from '@mui/icons-material';
import { permissionService } from '../../../utils/permissionService';

export type ContextMenuAction = 
  | 'view'
  | 'edit'
  | 'addChild'
  | 'addSpouse'
  | 'viewHistory'
  | 'uploadPhoto'
  | 'delete';

interface TreeContextMenuProps {
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onAction: (action: ContextMenuAction) => void;
  selectedMember: {
    id: string;
    hoTen: string;
    gioiTinh: boolean;
    isDeleted?: boolean; // ✅ Thêm isDeleted
  } | null;
}

export const TreeContextMenu = ({
  anchorPosition,
  onClose,
  onAction,
  selectedMember,
}: TreeContextMenuProps) => {
  const open = Boolean(anchorPosition);
  
  // Check permission
  const canEdit = permissionService.canEdit();
  const canModify = permissionService.canModify();
  const isDeleted = selectedMember?.isDeleted || false; // ✅ Kiểm tra đã xóa

  const handleMenuAction = (action: ContextMenuAction) => {
    // ❌ Người đã xóa KHÔNG thể Edit, Delete, AddChild, AddSpouse, UploadPhoto
    if (isDeleted && ['edit', 'delete', 'addChild', 'addSpouse', 'uploadPhoto'].includes(action)) {
      return;
    }
    
    // Double check permission trước khi thực hiện action
    if (!canEdit && ['edit', 'uploadPhoto'].includes(action)) {
      return;
    }
    if (!canModify && ['addChild', 'addSpouse', 'delete'].includes(action)) {
      return;
    }
    
    onAction(action);
    onClose();
  };

  if (!selectedMember) return null;

  // Helper function để render menu item với tooltip nếu disabled
  const renderMenuItem = (
    action: ContextMenuAction,
    icon: React.ReactNode,
    text: string,
    needsEdit: boolean = false,
    needsModify: boolean = false,
    isDanger: boolean = false
  ) => {
    const isDisabledByPermission = (needsEdit && !canEdit) || (needsModify && !canModify);
    const isDisabledByDeleted = isDeleted && ['edit', 'delete', 'addChild', 'addSpouse', 'uploadPhoto'].includes(action);
    const isDisabled = isDisabledByPermission || isDisabledByDeleted;
    
    // Tùy chỉnh tooltip message
    let tooltipMessage = '';
    if (isDisabledByDeleted) {
      tooltipMessage = 'Không thể thực hiện với người đã xóa';
    } else if (isDisabledByPermission) {
      tooltipMessage = 'Chỉ Trưởng họ mới có quyền này';
    }
    
    const menuItem = (
      <MenuItem 
        onClick={() => handleMenuAction(action)}
        disabled={isDisabled}
        sx={{ 
          color: isDanger ? 'error.main' : undefined,
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        <ListItemIcon>
          {isDisabled ? <Lock fontSize="small" /> : icon}
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    );

    if (isDisabled) {
      return (
        <Tooltip key={action} title={tooltipMessage} placement="left">
          <span>{menuItem}</span>
        </Tooltip>
      );
    }

    return <span key={action}>{menuItem}</span>;
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorPosition ? { top: anchorPosition.top, left: anchorPosition.left } : undefined
      }
      sx={{
        '& .MuiPaper-root': {
          minWidth: 220,
          boxShadow: 3,
        },
      }}
    >
      {/* Xem chi tiết - Ai cũng được */}
      {renderMenuItem('view', <Visibility fontSize="small" />, 'Xem chi tiết')}

      {/* Chỉnh sửa - Cần quyền edit */}
      {renderMenuItem('edit', <Edit fontSize="small" />, 'Chỉnh sửa', true)}

      <Divider />

      {/* Thêm con - Cần quyền modify */}
      {renderMenuItem('addChild', <PersonAdd fontSize="small" />, 'Thêm con', false, true)}

      {/* Thêm vợ/chồng - Cần quyền modify */}
      {renderMenuItem('addSpouse', <Add fontSize="small" />, 'Thêm vợ/chồng', false, true)}

      <Divider />

      {/* Xem lịch sử - Ai cũng được */}
   

      {/* Đổi ảnh - Cần quyền edit */}
      {renderMenuItem('uploadPhoto', <PhotoCamera fontSize="small" />, 'Đổi ảnh đại diện', true)}

      <Divider />

      {/* Xóa - Cần quyền modify */}
      {renderMenuItem('delete', <Delete fontSize="small" color="error" />, 'Xóa thành viên', false, true, true)}
    </Menu>
  );
};
