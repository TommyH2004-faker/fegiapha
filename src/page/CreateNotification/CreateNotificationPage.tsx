import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { endpointBe } from '../../utils/contant';

export default function CreateNotificationPage() {
  const navigate = useNavigate();
  const [noiDung, setNoiDung] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noiDung.trim()) {
      setError('Vui lòng nhập nội dung thông báo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(endpointBe + '/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ noiDung }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gửi thông báo thất bại');
      }

      setSuccess('Đã gửi thông báo đến toàn bộ thành viên trong dòng họ!');
      setNoiDung('');
      
      // Auto redirect sau 2 giây
      setTimeout(() => {
        navigate('/giapha');
      }, 2000);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi thông báo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/giapha')}
        sx={{ mb: 3 }}
      >
        Quay lại Gia phả
      </Button>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            py: 3,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <NotificationsActiveIcon sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold">
            Gửi Thông Báo
          </Typography>
          <Typography variant="body2" sx={{ color: '#fef3c7', mt: 1 }}>
            Gửi thông báo đến toàn bộ thành viên trong dòng họ
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Nội dung thông báo <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Nhập nội dung thông báo cho toàn bộ thành viên..."
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {noiDung.length}/1000 ký tự
                </Typography>
              </Box>

              <Alert severity="info" icon={<NotificationsActiveIcon />}>
                <Typography variant="body2" fontWeight={600}>
                  Lưu ý:
                </Typography>
                <Typography variant="caption">
                  • Chỉ Trưởng họ mới có quyền gửi thông báo<br />
                  • Thông báo sẽ được gửi đến tất cả thành viên trong dòng họ<br />
                  • Thành viên sẽ nhận được thông báo trong menu chuông 🔔
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/giapha')}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={loading || !noiDung.trim()}
                  sx={{
                    minWidth: 120,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    },
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi thông báo'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
