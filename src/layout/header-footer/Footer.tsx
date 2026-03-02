import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e293b',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo & Giới thiệu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src="/logo_main.png"
                alt="Logo"
                style={{
                  height: 80,
                  width: 'auto',
                  borderRadius: 12,
                  background: '#fff',
                  padding: 8,
                  marginRight: 12,
                }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#f59e0b' }}>
                Gia Phả Dòng Họ
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8, mb: 2 }}>
              Hệ thống quản lý gia phả hiện đại, giúp gìn giữ và phát huy giá trị văn hóa
              truyền thống qua từng thế hệ.
            </Typography>
            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  color: '#60a5fa',
                  bgcolor: '#1e3a8a',
                  '&:hover': { bgcolor: '#1e40af' },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#38bdf8',
                  bgcolor: '#075985',
                  '&:hover': { bgcolor: '#0c4a6e' },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#f472b6',
                  bgcolor: '#831843',
                  '&:hover': { bgcolor: '#9f1239' },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Liên kết nhanh */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#f59e0b' }}>
              Liên kết nhanh
            </Typography>
            <Stack spacing={1}>
              <Link
                to="/"
                style={{
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <HomeIcon sx={{ fontSize: 18, mr: 1 }} />
                Trang chủ
              </Link>
              <Link
                to="/giapha"
                style={{
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <AccountTreeIcon sx={{ fontSize: 18, mr: 1 }} />
                Gia phả
              </Link>
              <Link
                to="/tinh-nang"
                style={{
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <FeaturedPlayListIcon sx={{ fontSize: 18, mr: 1 }} />
                Tính năng
              </Link>
              <Link
                to="/tin-tuc"
                style={{
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <InfoIcon sx={{ fontSize: 18, mr: 1 }} />
                Tin tức
              </Link>
              <Link
                to="/policy"
                style={{
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                <PolicyIcon sx={{ fontSize: 18, mr: 1 }} />
                Chính sách
              </Link>
            </Stack>
          </Grid>

          {/* Liên hệ */}
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#f59e0b' }}>
              Thông tin liên hệ
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'start' }}>
                <LocationOnIcon sx={{ fontSize: 20, mr: 1.5, color: '#f59e0b', mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  Số nhà, Đường, Quận/Huyện, Tỉnh/Thành phố
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 20, mr: 1.5, color: '#f59e0b' }} />
                <Typography
                  component="a"
                  href="tel:0123456789"
                  variant="body2"
                  sx={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    '&:hover': { color: '#f59e0b' },
                  }}
                >
                  0123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 20, mr: 1.5, color: '#f59e0b' }} />
                <Typography
                  component="a"
                  href="mailto:info@nhathodongho.vn"
                  variant="body2"
                  sx={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    '&:hover': { color: '#f59e0b' },
                  }}
                >
                  info@nhathodongho.vn
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#475569' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © {new Date().getFullYear()} Hệ Thống Gia Phả Dòng Họ. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
            Made with ❤️ for Vietnamese families
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
