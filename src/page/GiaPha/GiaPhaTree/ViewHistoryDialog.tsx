import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider as MuiDivider,
} from '@mui/material';
import {
  Edit,
  Add,
  Delete,
  Favorite,
  Image,
} from '@mui/icons-material';
import type { GiaPhaNode } from '../../../types/giaPha.types';

interface ViewHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  member: GiaPhaNode | null;
}

export const ViewHistoryDialog = ({
  open,
  onClose,
  member,
}: ViewHistoryDialogProps) => {
  // TODO: Fetch real history from API
  const mockHistory = [
    {
      id: 1,
      type: 'create',
      action: 'Tạo thành viên',
      time: '2024-01-15 10:30',
      user: 'Admin',
    },
    {
      id: 2,
      type: 'edit',
      action: 'Cập nhật thông tin',
      time: '2024-02-01 14:20',
      user: 'Admin',
    },
    {
      id: 3,
      type: 'image',
      action: 'Thay đổi ảnh đại diện',
      time: '2024-02-10 09:15',
      user: 'User123',
    },
    {
      id: 4,
      type: 'marriage',
      action: 'Thêm quan hệ hôn nhân',
      time: '2024-02-20 16:45',
      user: 'Admin',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Add />;
      case 'edit':
        return <Edit />;
      case 'delete':
        return <Delete />;
      case 'image':
        return <Image />;
      case 'marriage':
        return <Favorite />;
      default:
        return <Edit />;
    }
  };

  const getColor = (type: string): "primary" | "success" | "error" | "warning" | "info" => {
    switch (type) {
      case 'create':
        return 'success';
      case 'edit':
        return 'primary';
      case 'delete':
        return 'error';
      case 'image':
        return 'info';
      case 'marriage':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Lịch sử thay đổi - {member?.hoTen}
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Tính năng này đang trong quá trình phát triển. Hiển thị dữ liệu mẫu.
        </Alert>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Thành viên: <strong>{member?.hoTen}</strong> (ID: {member?.id})
        </Typography>

        <Box sx={{ mt: 3 }}>
          <List>
            {mockHistory.map((item, index) => (
              <Box key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        display: 'flex',
                        bgcolor: `${getColor(item.type)}.light`,
                        color: `${getColor(item.type)}.dark`,
                      }}
                    >
                      {getIcon(item.type)}
                    </Paper>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.action}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {item.time} • Bởi: {item.user}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < mockHistory.length - 1 && <MuiDivider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        </Box>

        {mockHistory.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Chưa có lịch sử thay đổi nào
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
