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
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { endpointBe } from '../../utils/contant';

interface XinVaoHoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface HoInfo {
  hoId: string;
  tenHo: string;
  truongHoEmail: string;
  truongHoName: string;
}

const steps = ['Email Trưởng họ', 'Lý do xin vào', 'Xác nhận'];

const XinVaoHoDialog = ({ open, onClose, onSuccess }: XinVaoHoDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [emailTruongHo, setEmailTruongHo] = useState('');
  const [hoInfo, setHoInfo] = useState<HoInfo | null>(null);
  const [lyDoXinVao, setLyDoXinVao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    setError('');
    
    if (activeStep === 0) {
      // Bước 1: Validate email và tìm họ
      if (!emailTruongHo.trim()) {
        setError('Vui lòng nhập email Trưởng họ');
        return;
      }
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${endpointBe}/api/ho/by-truongho-email?email=${encodeURIComponent(emailTruongHo.trim())}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.errorMessage || 'Không tìm thấy họ với email này');
        }

        const result = await response.json();
        
        if (!result.isSuccess || !result.data) {
          throw new Error(result.errorMessage || 'Không tìm thấy họ với email Trưởng họ này');
        }

        setHoInfo(result.data);
        setActiveStep(1);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Có lỗi xảy ra khi kiểm tra email');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      // Bước 2: Validate lý do
      if (!lyDoXinVao.trim()) {
        setError('Vui lòng nhập lý do xin vào họ');
        return;
      }
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!hoInfo) {
      setError('Thông tin họ không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`${endpointBe}/api/yeucau/xin-vao/${hoInfo.hoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          lyDoXinVao: lyDoXinVao.trim(),
          emailTruongHo: emailTruongHo.trim()
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        const msg = result.errorMessage || result.message || result.title || 'Gửi yêu cầu thất bại';
        throw new Error(msg);
      }

      // Success (status 200)
      onSuccess();
      handleClose();
    } catch (err) {
      const error = err as Error;
      console.error('Error sending request:', error);
      setError(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setEmailTruongHo('');
    setHoInfo(null);
    setLyDoXinVao('');
    setError('');
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Nhập email của Trưởng họ để gửi yêu cầu tham gia vào dòng họ
            </Typography>
            <TextField
              fullWidth
              label="Email Trưởng họ"
              type="email"
              required
              value={emailTruongHo}
              onChange={(e) => setEmailTruongHo(e.target.value)}
              placeholder="example@email.com"
              disabled={loading}
              autoFocus
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
              <Typography variant="body2" fontWeight="bold">
                Đã tìm thấy: Họ {hoInfo?.tenHo}
              </Typography>
              <Typography variant="caption">
                Trưởng họ: {hoInfo?.truongHoName || emailTruongHo}
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Vui lòng cho biết lý do bạn muốn tham gia vào dòng họ này
            </Typography>

            <TextField
              fullWidth
              label="Lý do xin vào họ"
              required
              multiline
              rows={4}
              value={lyDoXinVao}
              onChange={(e) => setLyDoXinVao(e.target.value)}
              placeholder="VD: Tôi là con/cháu của... / Tôi có quan hệ họ hàng với dòng họ này..."
              disabled={loading}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin
            </Typography>
            
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Họ:</strong> {hoInfo?.tenHo}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Email Trưởng họ:</strong> {emailTruongHo}
              </Typography>
              {hoInfo?.truongHoName && (
                <Typography variant="body2" paragraph>
                  <strong>Trưởng họ:</strong> {hoInfo.truongHoName}
                </Typography>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" mb={1}>
              <strong>Lý do xin vào:</strong>
            </Typography>
            <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: 2, fontStyle: 'italic' }}>
              <Typography variant="body2">
                {lyDoXinVao}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Yêu cầu của bạn sẽ được gửi qua email đến Trưởng họ để phê duyệt
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xin vào Họ</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 4 }}>
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
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Quay lại
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            disabled={loading}
            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Tiếp theo'}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            Gửi yêu cầu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default XinVaoHoDialog;
