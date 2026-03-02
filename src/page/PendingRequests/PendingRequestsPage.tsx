import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { permissionService } from '../../utils/permissionService';
import { endpointBe } from '../../utils/contant';

interface YeuCauItem {
  id: string;
  userId: string;
  email: string;
  tenDangNhap: string;
  avatar?: string;
  lyDoXinVao: string;
  ngayTao: string;
}

export default function PendingRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<YeuCauItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dialog từ chối
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [ghiChu, setGhiChu] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${endpointBe}/api/yeucau/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Không thể tải danh sách');
      const data = await res.json();
      setRequests(data);
    } catch {
      setError('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect nếu không phải Trưởng họ
    if (!permissionService.isTruongHo()) {
      navigate('/giapha');
      return;
    }
    loadRequests();
  }, [navigate]);

  const handleDuyet = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${endpointBe}/api/yeucau/${id}/duyet`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch {
      setError('Lỗi khi duyệt yêu cầu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTuChoi = async () => {
    const id = rejectDialog.id;
    setActionLoading(id);
    try {
      const res = await fetch(`${endpointBe}/api/yeucau/${id}/tu-choi`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ghiChu }),
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      setRejectDialog({ open: false, id: '' });
      setGhiChu('');
    } catch {
      setError('Lỗi khi từ chối yêu cầu');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/giapha')}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: '#fff3e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PeopleIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Yêu Cầu Tham Gia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách thành viên đang chờ phê duyệt vào dòng họ
            </Typography>
          </Box>
          <Chip
            label={`${requests.length} đang chờ`}
            color={requests.length > 0 ? 'warning' : 'default'}
            sx={{ ml: 'auto', fontWeight: 600 }}
          />
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không có yêu cầu nào đang chờ
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            Tất cả yêu cầu đã được xử lý
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {requests.map((req) => (
            <Card
              key={req.id}
              sx={{
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'transparent',
                '&:hover': { borderColor: '#f59e0b', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
                transition: 'all 0.2s',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <Avatar
                    src={req.avatar}
                    alt={req.tenDangNhap}
                    sx={{ width: 56, height: 56, bgcolor: '#f59e0b', fontSize: 22 }}
                  >
                    {req.tenDangNhap.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {req.tenDangNhap}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {req.email}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(req.ngayTao).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                      <strong>Lý do:</strong> {req.lyDoXinVao}
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={actionLoading === req.id ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                        onClick={() => handleDuyet(req.id)}
                        disabled={!!actionLoading}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => setRejectDialog({ open: true, id: req.id })}
                        disabled={!!actionLoading}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Từ chối
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Dialog từ chối */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, id: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Từ chối yêu cầu</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (không bắt buộc)"
            placeholder="Nhập lý do từ chối..."
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => { setRejectDialog({ open: false, id: '' }); setGhiChu(''); }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleTuChoi}
            disabled={!!actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <CancelIcon />}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
