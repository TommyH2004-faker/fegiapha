import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyHo } from '../../api/HoApi';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Avatar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SendIcon from '@mui/icons-material/Send';
import useScrollToTop from '../../hooks/ScrollToTop';
import { permissionService } from '../../utils/permissionService';
import XinVaoHoDialog from './XinVaoHoDialog';

interface HoListItem {
  id: string;
  tenHo: string;
  moTa: string | null;
  queQuan?: string | null;
  hinhAnh: string | null;
  soThanhVien?: number;
}

export const GiaPhaListPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [hos, setHos] = useState<HoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const truongHo = permissionService.isTruongHo();

  // Dialog state
  const [xinVaoDialog, setXinVaoDialog] = useState(false);

  useEffect(() => {
    loadHos();
  }, []);

  const loadHos = async () => {
    try {
      setLoading(true);
      const data = await getMyHo();
      setHos(data as HoListItem[]);
    } catch (error) {
      console.error('Lỗi khi tải danh sách họ:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2, minHeight: '60vh' }}>
      <div className="container">
        {/* Header */}
        <Box mb={4}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {hos.length > 0 ? 'Gia Phả Của Tôi' : 'Quản Lý Gia Phả'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {hos.length > 0 
                ? 'Xem và quản lý thông tin dòng họ của bạn'
                : 'Hãy tạo cây dòng họ mới'}
            </Typography>
          </Box>

          {/* Nút chức năng Trưởng họ */}
          {truongHo && hos.length > 0 && (
            <Box display="flex" justifyContent="flex-start" gap={2}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/pending-requests')}
                sx={{ borderRadius: 2 }}
              >
                Danh sách phê duyệt
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<NotificationsActiveIcon />}
                onClick={() => navigate('/create-notification')}
                sx={{ borderRadius: 2 }}
              >
                Gửi thông báo
              </Button>
            </Box>
          )}
        </Box>

        {/* Danh sách Họ */}
        {hos.length === 0 ? (
          <Box textAlign="center" py={8}>
            <AccountTreeIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={2}>
              Chưa có dòng họ nào
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Bạn có thể tạo dòng họ mới hoặc xin gia nhập dòng họ hiện có
            </Typography>
            
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }} onClose={() => setSuccessMessage('')}>
                {successMessage}
              </Alert>
            )}

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                component={Link}
                to="/giapha/create"
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                Tạo Ngay
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setXinVaoDialog(true)}
                sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                Xin vào họ
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {hos.map((ho) => (
              <Card
                key={ho.id}
                component={Link}
                to={`/giapha/${ho.id}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: 'transparent',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                  {/* Ảnh Cover */}
                  <Box
                    sx={{
                      height: 180,
                      background: ho.hinhAnh
                        ? `url(${ho.hinhAnh})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
                      }}
                    />
                    {/* Icon */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '50%',
                        p: 1,
                      }}
                    >
                      <AccountTreeIcon color="primary" />
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Họ {ho.tenHo}
                    </Typography>

                    {ho.queQuan && (
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {ho.queQuan}
                        </Typography>
                      </Box>
                    )}

                    {ho.moTa && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={2}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {ho.moTa}
                      </Typography>
                    )}

                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        <PeopleIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {ho.soThanhVien || 0} thành viên
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
            ))}
          </Box>
        )}

        {/* XinVaoHo Dialog */}
        <XinVaoHoDialog
          open={xinVaoDialog}
          onClose={() => setXinVaoDialog(false)}
          onSuccess={() => {
            setSuccessMessage('Yêu cầu đã được gửi qua email đến Trưởng họ. Vui lòng chờ phê duyệt.');
            setXinVaoDialog(false);
            // Reload để cập nhật danh sách
            setTimeout(() => loadHos(), 1000);
          }}
        />
      </div>
    </Box>
  );
};
