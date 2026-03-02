import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { thanhVienApi } from '../../../api/thanhVienApi';

interface DeleteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  hasChildren: boolean;
  onSuccess?: () => void;
}

export const DeleteMemberDialog = ({
  open,
  onClose,
  memberId,
  memberName,
  hasChildren,
  onSuccess,
}: DeleteMemberDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await thanhVienApi.delete(memberId);
      console.log("Delete response:", response);
       if (response.isSuccess) {
            toast.success('Xóa thành viên thành công!');
            onClose();
            onSuccess?.();
          } else {
            console.error("Response không hợp lệ:", response);
            setError('Có lỗi xảy ra');
          }
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Có lỗi xảy ra khi xóa thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" />
        Xác nhận xóa thành viên
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {hasChildren && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Cảnh báo:</strong> Thành viên này có con cái. Việc xóa có thể ảnh hưởng đến
            cấu trúc cây gia phả.
          </Alert>
        )}

        <DialogContentText>
          Bạn có chắc chắn muốn xóa thành viên{' '}
          <Typography component="span" fontWeight="bold">
            {memberName}
          </Typography>{' '}
          khỏi gia phả?
        </DialogContentText>

        <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
          Hành động này không thể hoàn tác!
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
