import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import useScrollToTop from '../../hooks/ScrollToTop';


interface Feature {
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  desc: string;
  tags: string[];
}

const features: Feature[] = [
  {
    icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Cây Gia Phả Trực Quan',
    desc: 'Hiển thị toàn bộ cây gia phả theo thế hệ dạng sơ đồ cây. Hỗ trợ zoom in/out, kéo thả tự do và căn giữa tự động.',
    tags: ['Zoom & Pan', 'Đa thế hệ', 'Responsive'],
  },
  {
    icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
    color: '#2563eb',
    bg: '#dbeafe',
    title: 'Thêm Thành Viên',
    desc: 'Thêm thành viên mới vào cây gia phả. Nhập đầy đủ thông tin: họ tên, ngày sinh, ngày mất, giới tính, tiểu sử.',
    tags: ['Click chuột phải', 'Thêm con'],
  },
    {
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      color: '#0ea5e9',
      bg: '#e0f2fe',
      title: 'Xin Vào Họ',
      desc: 'Gửi yêu cầu tham gia vào dòng họ. Nhập thông tin cá nhân, lý do xin vào và chờ phê duyệt từ Trưởng họ.',
      tags: ['Gửi yêu cầu', 'Phê duyệt', 'Tham gia họ'],
    },
  {
    icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
    color: '#db2777',
    bg: '#fce7f3',
    title: 'Quản Lý Hôn Nhân',
    desc: 'Thêm vợ hoặc chồng cho từng thành viên. Tra cứu người đã có trong hệ thống hoặc thêm người ngoài họ.',
    tags: ['Thêm vợ/chồng', 'Ngày kết hôn'],
  },
  {
    icon: <EditIcon sx={{ fontSize: 40 }} />,
    color: '#d97706',
    bg: '#fef3c7',
    title: 'Chỉnh Sửa Thông Tin',
    desc: 'Cập nhật thông tin cá nhân của bất kỳ thành viên nào: tên, ngày sinh, ngày mất, tiểu sử và nhiều hơn nữa.',
    tags: ['Chỉnh sửa', 'Lưu ngay'],
  },
  {
    icon: <PhotoCameraIcon sx={{ fontSize: 40 }} />,
    color: '#7c3aed',
    bg: '#ede9fe',
    title: 'Ảnh Đại Diện',
    desc: 'Upload ảnh đại diện cho từng thành viên lên Cloudinary. Ảnh hiển thị trực tiếp trên thẻ trong cây gia phả.',
    tags: ['Cloudinary', 'Upload ảnh'],
  },
  {
    icon: <PictureAsPdfIcon sx={{ fontSize: 40 }} />,
    color: '#b45309',
    bg: '#fef3c7',
    title: 'Xuất PDF',
    desc: 'Xem trước và xuất toàn bộ cây gia phả ra file PDF với đầy đủ thông tin thành viên theo từng thế hệ.',
    tags: ['Xuất PDF', 'In ấn'],
  },
  {
    icon: <ZoomInIcon sx={{ fontSize: 40 }} />,
    color: '#059669',
    bg: '#d1fae5',
    title: 'Zoom & Điều Hướng',
    desc: 'Phóng to thu nhỏ bằng cuộn chuột, kéo thả để di chuyển, căn giữa tự động. Bộ nút điều khiển chuyên dụng.',
    tags: ['Zoom in/out', 'Kéo thả'],
  },
  {
    icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
    color: '#ea580c',
    bg: '#ffedd5',
    title: 'Thông Báo Email',
    desc: 'Gửi email HTML tới Trưởng họ khi có yêu cầu tham gia. Email có nút Phê duyệt / Từ chối tích hợp sẵn.',
    tags: ['Gmail SMTP', 'HTML Email'],
  },
  {
    icon: <CreateNewFolderIcon sx={{ fontSize: 40 }} />,
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Tạo Họ Mới',
    desc: 'Tạo một dòng họ mới trong hệ thống. Nhập tên họ, mô tả, quê quán và ảnh đại diện cho dòng họ.',
    tags: ['Tạo mới', 'Quản lý họ'],
  },
];

const TinhNangPage = () => {
    useScrollToTop();
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          py: 8,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Tính Năng Hệ Thống
          </Typography>
          <Typography variant="h6" sx={{ color: '#94a3b8', mb: 3 }}>
            Toàn bộ chức năng hiện có trong Hệ Thống Quản Lý Gia Phả Dòng Họ
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Divider sx={{ mb: 5 }}>
          <Chip label="Danh sách tính năng" />
        </Divider>

        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: '16px',
                      bgcolor: f.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                      mb: 2,
                    }}
                  >
                    {f.icon}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {f.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {f.desc}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {f.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ bgcolor: f.bg, color: f.color, fontWeight: 600, fontSize: 11 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TinhNangPage;
