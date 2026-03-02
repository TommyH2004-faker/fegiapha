import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { GiaPhaTreeView } from './GiaPhaTree/GiaPhaTreeView';
import { giaPhaApi } from '../../api/giaPhaApi';
import type { GiaPhaTreeResponse } from '../../types/giaPha.types';
import CreateHoDialog from './CreateHoDialog';

export const GiaPhaPage = () => {
  const [treeData, setTreeData] = useState<GiaPhaTreeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasNoHo, setHasNoHo] = useState(false);
  const [createHoDialogOpen, setCreateHoDialogOpen] = useState(false);
  useEffect(() => {
    fetchMyGiaPha();
  }, []);

  const fetchMyGiaPha = async () => {
    try {
      setLoading(true);
      setError('');
      setHasNoHo(false);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem gia phả');
        setHasNoHo(true);
        setLoading(false);
        return;
      }

      const response = await giaPhaApi.getMyGiaPhaTree(true); // includeDeleted = true để hiển thị tất cả
      
      if (response.isSuccess && response.data) {
        setTreeData(response.data);
      } else {
        // API trả về không thành công
        setError(response.errorMessage || 'Không thể tải gia phả');
        // Nếu error message chứa "chưa thuộc họ nào", đây là trường hợp user chưa có họ
        if (response.errorMessage?.toLowerCase().includes('chưa thuộc họ')) {
          setHasNoHo(true);
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching my gia pha:', error);
      
      // Kiểm tra nếu là 404 - user chưa có họ
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        setHasNoHo(true);
        setError('Bạn chưa thuộc họ nào. Vui lòng tạo họ mới hoặc xin tham gia họ có sẵn.');
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setHasNoHo(true);
      } else {
        setError('Có lỗi xảy ra khi tải gia phả: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHo = () => {
    console.log('Opening CreateHo dialog'); // Debug
    setCreateHoDialogOpen(true);
  };


  const handleHoCreated = () => {
    setCreateHoDialogOpen(false);
    fetchMyGiaPha();
  };


  // Loading state
  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state - User chưa có họ
  if (hasNoHo) {
    return (
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 5, textAlign: 'center' }}>
            <FamilyRestroomIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Chào mừng đến với Gia Phả Dòng Họ
            </Typography>
            
            <Alert severity="info" sx={{ my: 3, textAlign: 'left' }}>
              {error || 'Bạn chưa thuộc họ nào trong hệ thống'}
            </Alert>

            <Typography variant="body1" color="text.secondary" paragraph>
              Để bắt đầu tạo và quản lý gia phả của dòng họ, bạn cần:
            </Typography>

            <Box sx={{ textAlign: 'left', mb: 3, mx: 'auto', maxWidth: 500 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                • <strong>Tạo họ mới:</strong> Nếu họ của bạn chưa có trong hệ thống
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • <strong>Xin vào họ:</strong> Tìm và gửi yêu cầu tham gia họ đã có sẵn
              </Typography>
            </Box>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateHo}
              >
                Tạo Họ Mới
              </Button>

            </Box>
          </Paper>
        </Container>

        {/* Dialogs - PHẢI render ở đây */}
        <CreateHoDialog
          open={createHoDialogOpen}
          onClose={() => setCreateHoDialogOpen(false)}
          onSuccess={handleHoCreated}
        />
      </Box>
    );
  }

  // Error state - Other errors
  if (error && !hasNoHo) {
    return (
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 5, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button variant="outlined" onClick={fetchMyGiaPha}>
              Thử lại
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Success state - Show tree
  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Cây Gia Phả Dòng Họ
              </Typography>
              {treeData && (
                <Typography variant="body2" color="text.secondary">
                  Họ: <strong>{treeData.tenHo}</strong>
                </Typography>
              )}
            </Box>
            
            <Button
              variant="outlined"
              onClick={fetchMyGiaPha}
              size="small"
            >
              Làm mới
            </Button>
          </Box>
        </Paper>

        {/* Cây gia phả */}
        {treeData && <GiaPhaTreeView treeData={treeData} onRefresh={fetchMyGiaPha} />}
      </Container>

      {/* Dialogs */}
      <CreateHoDialog
        open={createHoDialogOpen}
        onClose={() => setCreateHoDialogOpen(false)}
        onSuccess={handleHoCreated}
      />
    </Box>
  );
};
