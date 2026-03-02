import { useState } from 'react';
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
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import { thanhVienApi } from '../../../api/thanhVienApi';
import type { CreateThanhVienRequest } from '../../../api/thanhVienApi';

interface AddChildDialogProps {
  open: boolean;
  onClose: () => void;
  parentMember: { id: string; hoId: string; chiHoId: string | null; hoTen: string } | null;
  onSuccess?: () => void;
}

export const AddChildDialog = ({
  open,
  onClose,
  parentMember,
  onSuccess,
}: AddChildDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    hoTen: '',
    gioiTinh: false, // false = Nam, true = Nữ
    ngaySinh: '',
    noiSinh: '',
    tieuSu: '',
  });

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
  if (!formData.noiSinh.trim()) {
    setError('Vui lòng nhập nơi sinh');
    return;
  }

  try {
    setLoading(true);
    setError('');

    if (!parentMember) {
      setError('Thiếu thông tin cha/mẹ');
      return;
    }

    const request: CreateThanhVienRequest = {
      hoTen: formData.hoTen.trim(),
      gioiTinh: formData.gioiTinh,
      ngaySinh: formData.ngaySinh,
      noiSinh: formData.noiSinh.trim(),
      trangThai: true,
      hoId: parentMember.hoId,
      chiHoId: parentMember.chiHoId,
      tieuSu: formData.tieuSu.trim() || undefined,
      parentId: parentMember.id,
    };

    const response = await thanhVienApi.create(request);
    console.log("RESPONSE:", response);

    // Backend trả về trực tiếp ThanhVienResponse
    if (response) {
      toast.success('Thêm con thành công!');
      onClose();
      onSuccess?.();
    } else {
      console.error("Response không hợp lệ:", response);
      setError('Có lỗi xảy ra');
    }

  } catch (err) {
    console.error('Error creating child:', err);

    // Nếu backend trả lỗi qua axios
    if (err instanceof Error) {
      if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
        const errorMessage = (err.response as { data?: { errorMessage?: string } }).data?.errorMessage;
        if (errorMessage) {
          setError(errorMessage);
        } else {
          setError(err.message);
        }
      } else {
        setError(err.message);
      }
    } else {
      setError('Có lỗi xảy ra khi thêm con');
    }

  } finally {
    setLoading(false);
  }
};
  const handleClose = () => {
    if (!loading) {
      setFormData({
        hoTen: '',
        gioiTinh: false,
        ngaySinh: '',
        noiSinh: '',
        tieuSu: '',
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Thêm Con {parentMember && `cho ${parentMember.hoTen}`}
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
              <FormControlLabel value={false} control={<Radio />} label="Nam" />
              <FormControlLabel value={true} control={<Radio />} label="Nữ" />
            </RadioGroup>
          </FormControl>

          <Box display="flex" gap={2}>
            <TextField
              label="Ngày sinh"
              type="date"
              fullWidth
              required
              value={formData.ngaySinh}
              onChange={(e) => handleChange('ngaySinh', e.target.value)}
              disabled={loading}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Nơi sinh"
              fullWidth
              required
              value={formData.noiSinh}
              onChange={(e) => handleChange('noiSinh', e.target.value)}
              disabled={loading}
            />
          </Box>

          <TextField
            label="Tiểu sử"
            fullWidth
            multiline
            rows={4}
            value={formData.tieuSu}
            onChange={(e) => handleChange('tieuSu', e.target.value)}
            disabled={loading}
            placeholder="Nhập tiểu sử của thành viên..."
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
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Đang thêm...' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
