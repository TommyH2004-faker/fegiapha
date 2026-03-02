
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';

const ChinhSach = () => {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          py: 6,
          mb: 6,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <GavelIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Chính Sách & Quy Định
          </Typography>
          <Typography variant="h6" sx={{ color: '#bfdbfe' }}>
            Quy định sử dụng và nguyên tắc hoạt động của hệ thống gia phả dòng họ
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Policy Cards Grid */}
        <Grid container spacing={4}>
          {/* 1. Mục đích sử dụng */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      bgcolor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <AccountTreeIcon sx={{ fontSize: 32, color: '#2563eb' }} />
                  </Box>
                  <Box>
                    <Chip label="1" size="small" color="primary" sx={{ mb: 0.5 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Mục đích sử dụng
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                  Website được xây dựng nhằm lưu trữ, quản lý và chia sẻ thông tin gia phả
                  dòng họ một cách chính xác, minh bạch và bảo mật. Hệ thống giúp gìn giữ
                  và phát huy giá trị văn hóa truyền thống qua từng thế hệ.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Quyền và nghĩa vụ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      bgcolor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 32, color: '#d97706' }} />
                  </Box>
                  <Box>
                    <Chip label="2" size="small" sx={{ bgcolor: '#d97706', color: 'white', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Quyền và nghĩa vụ
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cung cấp thông tin đúng sự thật"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BlockIcon sx={{ color: '#dc2626', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Không đăng tải nội dung phản cảm"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FavoriteIcon sx={{ color: '#db2777', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tôn trọng các thành viên trong dòng họ"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VerifiedUserIcon sx={{ color: '#2563eb', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Bảo vệ danh dự và uy tín của dòng tộc"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Bảo mật thông tin */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      bgcolor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                  </Box>
                  <Box>
                    <Chip label="3" size="small" sx={{ bgcolor: '#16a34a', color: 'white', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Bảo mật thông tin
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LockIcon sx={{ color: '#7c3aed', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mọi dữ liệu cá nhân được mã hóa và bảo mật tuyệt đối"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AdminPanelSettingsIcon sx={{ color: '#2563eb', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phân quyền rõ ràng: Trưởng họ và Thành viên"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VerifiedUserIcon sx={{ color: '#059669', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Chỉ phục vụ mục đích quản lý gia phả"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <InfoIcon sx={{ color: '#0891b2', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Không chia sẻ thông tin cho bên thứ ba"
                      primaryTypographyProps={{ fontSize: 15 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 4. Điều khoản thay đổi */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      bgcolor: '#fce7f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <UpdateIcon sx={{ fontSize: 32, color: '#db2777' }} />
                  </Box>
                  <Box>
                    <Chip label="4" size="small" sx={{ bgcolor: '#db2777', color: 'white', mb: 0.5 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Điều khoản thay đổi
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8} paragraph>
                  Chính sách có thể được cập nhật theo từng giai đoạn phát triển của hệ thống
                  mà không cần thông báo trước. Người dùng nên thường xuyên kiểm tra trang này
                  để nắm bắt những thay đổi mới nhất.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  <strong>Lần cập nhật cuối:</strong> 25/02/2026
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer Note */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: '#f1f5f9',
            borderRadius: 3,
            border: '2px dashed #cbd5e1',
            textAlign: 'center',
          }}
        >
          <InfoIcon sx={{ fontSize: 40, color: '#64748b', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Nếu có bất kỳ thắc mắc nào về chính sách, vui lòng liên hệ với Ban quản trị hệ thống.
            <br />
            Chúng tôi cam kết bảo vệ quyền lợi và thông tin của mọi thành viên trong dòng họ.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ChinhSach;
