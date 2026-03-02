import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, Male, Female } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { thanhVienApi } from '../../../api/thanhVienApi';

interface UploadPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  currentAvatar: string | null;
  gioiTinh: boolean;
  onSuccess?: () => void;
}

export const UploadPhotoDialog = ({
  open,
  onClose,
  memberId,
  memberName,
  currentAvatar,
  gioiTinh,
  onSuccess,
}: UploadPhotoDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await thanhVienApi.uploadAvatar(memberId, selectedFile);

      if (response.isSuccess) {
        toast.success('Cập nhật ảnh đại diện thành công!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(response.errorMessage || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Có lỗi xảy ra khi tải ảnh lên');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đổi ảnh đại diện</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Thành viên: <strong>{memberName}</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box textAlign="center" my={3}>
          {/* Current/Preview Avatar */}
          <Avatar
            src={previewUrl || currentAvatar || undefined}
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto',
              bgcolor: gioiTinh ? '#f48fb1' : '#42a5f5',
            }}
          >
            {!previewUrl && !currentAvatar && (gioiTinh ? <Female sx={{ fontSize: 60 }} /> : <Male sx={{ fontSize: 60 }} />)}
          </Avatar>

          {/* File Input */}
          <Box mt={3}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-photo-input"
              type="file"
              onChange={handleFileSelect}
              disabled={loading}
            />
            <label htmlFor="upload-photo-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                disabled={loading}
              >
                Chọn ảnh
              </Button>
            </label>
          </Box>

          {selectedFile && (
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" display="block" mt={2}>
            Định dạng: JPG, PNG, GIF. Tối đa: 5MB
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={loading || !selectedFile}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Đang tải lên...' : 'Tải lên'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
