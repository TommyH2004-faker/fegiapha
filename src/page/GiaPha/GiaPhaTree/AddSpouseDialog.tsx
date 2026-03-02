import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  Divider,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { toast } from 'react-toastify';
import { honNhanApi, type CreateHonNhanRequest } from '../../../api/honNhanApi';
import { thanhVienApi, type CreateThanhVienRequest } from '../../../api/thanhVienApi';
import type { GiaPhaNode } from '../../../types/giaPha.types';

interface AddSpouseDialogProps {
  open: boolean;
  onClose: () => void;
  member: GiaPhaNode | null;
  onSuccess?: () => void;
}

export const AddSpouseDialog = ({
  open,
  onClose,
  member,
  onSuccess,
}: AddSpouseDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0: Tạo mới, 1: Chọn có sẵn
  const [formData, setFormData] = useState({
    hoTen: '',
    ngaySinh: '',
    noiSinh: '',
    ngayKetHon: '',
    tieuSu: '',
  });

  const spouseGender = member ? !member.gioiTinh : true;
  const spouseLabel = member?.gioiTinh === false ? 'vợ' : 'chồng';

  const handleChange = (field: string, value: string) => {
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
    if (!formData.ngayKetHon) {
      setError('Vui lòng nhập ngày kết hôn');
      return;
    }
    if (!member) {
      setError('Thiếu thông tin thành viên');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Step 1: Tạo thành viên vợ/chồng mới (từ họ khác)
      const createSpouseRequest: CreateThanhVienRequest = {
        hoTen: formData.hoTen.trim(),
        gioiTinh: spouseGender,
        ngaySinh: formData.ngaySinh,
        noiSinh: formData.noiSinh.trim() || 'Không rõ',
        trangThai: true,
        // hoId không gửi (undefined) => vợ/chồng từ họ khác (tránh loạn luân)
        chiHoId: null, // Không thuộc chi nhánh nào
        tieuSu: formData.tieuSu.trim() || undefined,
      };

      const spouseResponse = await thanhVienApi.create(createSpouseRequest);
        console.log("Create spouse response:", spouseResponse);
      if (!spouseResponse) {
      setError("Không thể tạo vợ/chồng");
      return;
      }
      const spouseId = spouseResponse.id;

      // Step 2: Tạo quan hệ hôn nhân
      // Logic: gioiTinh = false (Nam), true (Nữ)
      const createMarriageRequest: CreateHonNhanRequest = {
        chongId: member.gioiTinh ? spouseId : member.id, // Nếu member là Nữ => spouse là Chồng
        voId: member.gioiTinh ? member.id : spouseId, // Nếu member là Nam => spouse là Vợ
        ngayKetHon: formData.ngayKetHon,
      };

      const marriageResponse = await honNhanApi.create(createMarriageRequest);
      console.log("Marriage response:", marriageResponse);
      if (marriageResponse.isSuccess) {
        toast.success(`Thêm ${spouseLabel} thành công!`);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(marriageResponse.errorMessage || 'Có lỗi xảy ra khi tạo hôn nhân');
      }
    } catch (err) {
      console.error('Error adding spouse:', err);
      setError(`Có lỗi xảy ra khi thêm ${spouseLabel}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        hoTen: '',
        ngaySinh: '',
        noiSinh: '',
        ngayKetHon: '',
        tieuSu: '',
      });
      setError('');
      setTabValue(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Thêm {spouseLabel} cho {member?.hoTen}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Thông tin thành viên: <strong>{member?.hoTen}</strong> ({member?.gioiTinh ? 'Nữ' : 'Nam'})
        </Typography>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Tạo mới" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary">
              Thông tin {spouseLabel} mới
            </Typography>

            <TextField
              label={`Họ tên ${spouseLabel}`}
              fullWidth
              required
              value={formData.hoTen}
              onChange={(e) => handleChange('hoTen', e.target.value)}
              disabled={loading}
            />

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
              label="Ngày kết hôn"
              type="date"
              fullWidth
              required
              value={formData.ngayKetHon}
              onChange={(e) => handleChange('ngayKetHon', e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Tiểu sử"
              fullWidth
              multiline
              rows={2}
              value={formData.tieuSu}
              onChange={(e) => handleChange('tieuSu', e.target.value)}
              disabled={loading}
              placeholder="Nhập thông tin tiểu sử..."
            />

            <Alert severity="info" icon={false}>
              Giới tính: <strong>{spouseGender ? 'Nữ' : 'Nam'}</strong> (tự động)
            </Alert>
          </Stack>
        )}
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
          {loading ? 'Đang thêm...' : `Thêm ${spouseLabel}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
