import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Step,
  Stepper,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { endpointBe } from '../../utils/contant';

interface CreateHoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface HoInfo {
  tenHo: string;
  moTa: string;
  queQuan: string;
}

interface ThuyToInfo {
  hoTenThuyTo: string;
  gioiTinhThuyTo: boolean; // false = Nam, true = Nữ
  ngaySinhThuyTo: string; // YYYY-MM-DD format
  noiSinhThuyTo: string;
  tieuSuThuyTo: string;
}

const steps = ['Thông tin Họ', 'Thông tin Thủy Tổ', 'Xác nhận'];

const CreateHoDialog = ({ open, onClose, onSuccess }: CreateHoDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hoInfo, setHoInfo] = useState<HoInfo>({
    tenHo: '',
    moTa: '',
    queQuan: '',
  });

  const [thuyToInfo, setThuyToInfo] = useState<ThuyToInfo>({
    hoTenThuyTo: '',
    gioiTinhThuyTo: false,
    ngaySinhThuyTo: '',
    noiSinhThuyTo: '',
    tieuSuThuyTo: '',
  });

  const handleNext = () => {
    if (activeStep === 0) {
      if (!hoInfo.tenHo.trim()) {
        setError('Vui lòng nhập tên họ');
        return;
      }
    }
    if (activeStep === 1) {
      if (!thuyToInfo.hoTenThuyTo.trim()) {
        setError('Vui lòng nhập họ tên thủy tổ');
        return;
      }
      if (!thuyToInfo.ngaySinhThuyTo) {
        setError('Vui lòng chọn ngày sinh thủy tổ');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập');
        return;
      }

      const userId = getUserIdFromToken(token);
      console.log('Creating Ho with userId:', userId); // Debug
      
      if (!userId) {
        setError('Không thể lấy thông tin người dùng từ token. Vui lòng đăng nhập lại.');
        return;
      }

      const payload = {
        userId,
        tenHo: hoInfo.tenHo,
        moTa: hoInfo.moTa || null,
        queQuan: hoInfo.queQuan || null,
        hoTenThuyTo: thuyToInfo.hoTenThuyTo,
        gioiTinhThuyTo: thuyToInfo.gioiTinhThuyTo,
        ngaySinhThuyTo: thuyToInfo.ngaySinhThuyTo ? new Date(thuyToInfo.ngaySinhThuyTo).toISOString() : new Date().toISOString(),
        noiSinhThuyTo: thuyToInfo.noiSinhThuyTo || null,
        tieuSuThuyTo: thuyToInfo.tieuSuThuyTo || null,
      };

      console.log('Payload:', JSON.stringify(payload, null, 2)); // Debug

      const response = await fetch(endpointBe + '/api/Ho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Response:', result); // Debug

      if (!response.ok) {
        console.error('Error response:', result);
        setError(result.errorMessage || result.message || `Lỗi ${response.status}: ${response.statusText}`);
        return;
      }

      if (!result.isSuccess) {
        setError(result.errorMessage || 'Tạo họ thất bại');
        return;
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err) {
      const error = err as Error;
      console.error('Error creating Ho:', error);
      setError('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError('');
    setHoInfo({ tenHo: '', moTa: '', queQuan: '' });
    setThuyToInfo({
      hoTenThuyTo: '',
      gioiTinhThuyTo: false,
      ngaySinhThuyTo: '',
      noiSinhThuyTo: '',
      tieuSuThuyTo: '',
    });
    onClose();
  };

  const getUserIdFromToken = (token: string): string => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.userId;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Tên Họ"
              required
              value={hoInfo.tenHo}
              onChange={(e) => setHoInfo({ ...hoInfo, tenHo: e.target.value })}
              margin="normal"
              placeholder="VD: Nguyễn, Trần, Lê..."
            />
            <TextField
              fullWidth
              label="Quê quán"
              value={hoInfo.queQuan}
              onChange={(e) => setHoInfo({ ...hoInfo, queQuan: e.target.value })}
              margin="normal"
              placeholder="VD: Hà Nội, Nghệ An..."
            />
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={4}
              value={hoInfo.moTa}
              onChange={(e) => setHoInfo({ ...hoInfo, moTa: e.target.value })}
              margin="normal"
              placeholder="Mô tả về dòng họ..."
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Họ và tên Thủy Tổ"
              required
              value={thuyToInfo.hoTenThuyTo}
              onChange={(e) => setThuyToInfo({ ...thuyToInfo, hoTenThuyTo: e.target.value })}
              margin="normal"
              placeholder="VD: Nguyễn Văn A"
            />
            <FormLabel component="legend" sx={{ mt: 2 }}>Giới tính</FormLabel>
            <RadioGroup
              value={thuyToInfo.gioiTinhThuyTo ? 'female' : 'male'}
              onChange={(e) => setThuyToInfo({ ...thuyToInfo, gioiTinhThuyTo: e.target.value === 'female' })}
              row
            >
              <FormControlLabel value="male" control={<Radio />} label="Nam" />
              <FormControlLabel value="female" control={<Radio />} label="Nữ" />
            </RadioGroup>
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={thuyToInfo.ngaySinhThuyTo}
              onChange={(e) => setThuyToInfo({ ...thuyToInfo, ngaySinhThuyTo: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Nơi sinh"
              value={thuyToInfo.noiSinhThuyTo}
              onChange={(e) => setThuyToInfo({ ...thuyToInfo, noiSinhThuyTo: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tiểu sử"
              multiline
              rows={4}
              value={thuyToInfo.tieuSuThuyTo}
              onChange={(e) => setThuyToInfo({ ...thuyToInfo, tieuSuThuyTo: e.target.value })}
              margin="normal"
              placeholder="Tiểu sử của thủy tổ..."
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin Họ
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Tên họ:</strong> {hoInfo.tenHo}
            </Typography>
            {hoInfo.queQuan && (
              <Typography variant="body2" paragraph>
                <strong>Quê quán:</strong> {hoInfo.queQuan}
              </Typography>
            )}
            {hoInfo.moTa && (
              <Typography variant="body2" paragraph>
                <strong>Mô tả:</strong> {hoInfo.moTa}
              </Typography>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Thông tin Thủy Tổ
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Họ tên:</strong> {thuyToInfo.hoTenThuyTo}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Giới tính:</strong> {thuyToInfo.gioiTinhThuyTo ? 'Nữ' : 'Nam'}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Ngày sinh:</strong> {thuyToInfo.ngaySinhThuyTo ? new Date(thuyToInfo.ngaySinhThuyTo).toLocaleDateString('vi-VN') : 'Chưa nhập'}
            </Typography>
            {thuyToInfo.noiSinhThuyTo && (
              <Typography variant="body2" paragraph>
                <strong>Nơi sinh:</strong> {thuyToInfo.noiSinhThuyTo}
              </Typography>
            )}
            {thuyToInfo.tieuSuThuyTo && (
              <Typography variant="body2" paragraph>
                <strong>Tiểu sử:</strong> {thuyToInfo.tieuSuThuyTo}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Họ Mới</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Quay lại
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Tiếp theo
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Tạo Họ'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateHoDialog;
