import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Stack,
  Switch,
} from '@mui/material';
import { toast } from 'react-toastify';
import { thanhVienApi, type UpdateThanhVienRequest } from '../../../api/thanhVienApi';
import type { GiaPhaNode } from '../../../types/giaPha.types';

interface EditMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: GiaPhaNode | null;
  onSuccess?: () => void;
}

export const EditMemberDialog = ({
  open,
  onClose,
  member,
  onSuccess,
}: EditMemberDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    hoTen: '',
    gioiTinh: false,
    ngaySinh: '',
    noiSinh: '',
    ngayMat: '',
    noiMat: '',
    tieuSu: '',
    trangThai: true,
  });

  // Load member data when dialog opens
  useEffect(() => {
    if (member && open) {
      const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        hoTen: member.hoTen,
        gioiTinh: member.gioiTinh,
        ngaySinh: formatDateForInput(member.ngaySinh),
        noiSinh: '', // Không có trong GiaPhaNode
        ngayMat: formatDateForInput(member.ngayMat),
        noiMat: '',
        tieuSu: '',
        trangThai: true,
      });
    }
  }, [member, open]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.hoTen.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!formData.ngaySinh) {
      setError('Vui lòng nhập ngày sinh');
      return;
    }
    if (!member) {
      setError('Thiếu thông tin thành viên');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const request: UpdateThanhVienRequest = {
        id: member.id,
        hoTen: formData.hoTen.trim(),
        gioiTinh: formData.gioiTinh,
        ngaySinh: formData.ngaySinh,
        noiSinh: formData.noiSinh.trim() || 'Không rõ',
        ngayMat: formData.ngayMat || null,
        noiMat: formData.noiMat.trim() || null,
        tieuSu: formData.tieuSu.trim() || undefined,
        trangThai: formData.trangThai,
      };

        const response = await thanhVienApi.update(request);
        console.log("Update response:", response);

        if (response) {
          toast.success('Cập nhật thành viên thành công!');
          onClose();
          if (onSuccess) onSuccess();
        } else {
          setError('Có lỗi xảy ra khi cập nhật thành viên');
        }
    } catch (err) {
      console.error('Error updating member:', err);
      setError('Có lỗi xảy ra khi cập nhật thành viên');
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chỉnh sửa thông tin {member?.hoTen}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Họ và tên"
            fullWidth
            required
            value={formData.hoTen}
            onChange={(e) => handleChange('hoTen', e.target.value)}
            disabled={loading}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">Giới tính</FormLabel>
            <RadioGroup
              row
              value={formData.gioiTinh}
              onChange={(e) => handleChange('gioiTinh', e.target.value === 'true')}
            >
              <FormControlLabel value={false} control={<Radio />} label="Nam" disabled={loading} />
              <FormControlLabel value={true} control={<Radio />} label="Nữ" disabled={loading} />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Ngày sinh"
            type="date"
            fullWidth
            required
            value={formData.ngaySinh}
            onChange={(e) => handleChange('ngaySinh', e.target.value)}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Nơi sinh"
            fullWidth
            value={formData.noiSinh}
            onChange={(e) => handleChange('noiSinh', e.target.value)}
            disabled={loading}
          />

          <TextField
            label="Ngày mất (nếu có)"
            type="date"
            fullWidth
            value={formData.ngayMat}
            onChange={(e) => handleChange('ngayMat', e.target.value)}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          {formData.ngayMat && (
            <TextField
              label="Nơi mất"
              fullWidth
              value={formData.noiMat}
              onChange={(e) => handleChange('noiMat', e.target.value)}
              disabled={loading}
            />
          )}

          <TextField
            label="Tiểu sử"
            fullWidth
            multiline
            rows={3}
            value={formData.tieuSu}
            onChange={(e) => handleChange('tieuSu', e.target.value)}
            disabled={loading}
            placeholder="Nhập thông tin tiểu sử..."
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.trangThai}
                onChange={(e) => handleChange('trangThai', e.target.checked)}
                disabled={loading}
              />
            }
            label="Trạng thái hoạt động"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
