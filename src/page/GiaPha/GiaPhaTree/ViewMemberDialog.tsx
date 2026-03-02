import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { Male, Female, CalendarToday, Info } from '@mui/icons-material';
import type { GiaPhaNode } from '../../../types/giaPha.types';

interface ViewMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: GiaPhaNode | null;
}

export const ViewMemberDialog = ({ open, onClose, member }: ViewMemberDialogProps) => {
  if (!member) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có thông tin';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const calculateAge = (birthDate: string, deathDate?: string | null) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    return end.getFullYear() - birth.getFullYear();
  };

  const isAlive = !member.ngayMat;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={member.avatar || undefined}
            sx={{
              width: 64,
              height: 64,
              bgcolor: member.gioiTinh ? '#f48fb1' : '#42a5f5',
            }}
          >
            {!member.avatar && (member.gioiTinh ? <Female /> : <Male />)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {member.hoTen}
            </Typography>
            <Chip
              size="small"
              label={member.gioiTinh ? 'Nữ' : 'Nam'}
              color={member.gioiTinh ? 'secondary' : 'primary'}
            />
            {isAlive ? (
              <Chip size="small" label="Còn sống" color="success" sx={{ ml: 1 }} />
            ) : (
              <Chip size="small" label="Đã mất" color="default" sx={{ ml: 1 }} />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Ngày sinh */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Ngày sinh
              </Typography>
              <Typography variant="body1">
                {formatDate(member.ngaySinh ? member.ngaySinh : '')}
                {isAlive && ` (${calculateAge(member.ngaySinh ? member.ngaySinh : '')} tuổi)`}
              </Typography>
            </Box>
          </Box>

          {/* Ngày mất */}
          {member.ngayMat && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday color="error" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ngày mất
                </Typography>
                <Typography variant="body1" color="error">
                  {formatDate(member.ngayMat)}
                  {` (${calculateAge(member.ngaySinh ? member.ngaySinh : '', member.ngayMat)} tuổi)`}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Đời thứ */}
          <Box display="flex" alignItems="center" gap={1}>
            <Info color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Đời thứ
              </Typography>
              <Typography variant="body1">
                Đời {(member.level ?? 0) + 1}
              </Typography>
            </Box>
          </Box>

          {/* Tiểu sử */}
          {member.tieuSu?.trim() && (
            <>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  Tiểu sử
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  mt={1}
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                  }}
                >
                  {member.tieuSu}
                </Typography>
              </Box>
            </>
          )}

          <Divider />

          {/* Thống kê gia đình */}
          <Box display="flex" gap={3}>
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary">
                Vợ/Chồng
              </Typography>
              <Typography variant="h6" color="primary">
                {Array.isArray(member.danhSachVoChong)
                  ? member.danhSachVoChong.length
                  : 0}
              </Typography>
            </Box>

            <Box flex={1}>
              <Typography variant="caption" color="text.secondary">
                Con cái
              </Typography>
              <Typography variant="h6" color="primary">
                {member.tongSoCon || 0}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
