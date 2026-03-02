import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Fade,
  Backdrop
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";


const theme = {
  bg: '#f8f9fa',
  cardBg: '#ffffff',
  headerBg: '#16213e',
  headerText: '#ffffff',
  accentAmber: '#f59e0b',
  accentAmberHover: '#d97706',
  accentBlue: '#2563eb',
  accentBlueHover: '#1d4ed8',
  textMain: '#212529',
  textMuted: '#6c757d',
  borderColor: '#dee2e6',
  white: '#ffffff',
};

interface ThanhVien {
  id: string;
  hoTen: string;
}

interface EventFormData {
  thanhVienId: string;
  loaiSuKien: string;
  ngayXayRa: string;
  diaDiem: string;
  moTa: string;
}

interface SuKienToEdit {
  id: string;
  thanhVienId: string;
  loaiSuKien: string;
  ngayXayRa: string;
  diaDiem?: string;
  moTa?: string;
}

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  members: ThanhVien[];
  onSubmit: (data: EventFormData) => void;
  onUpdate?: (id: string, data: EventFormData) => void;
  editingEvent?: SuKienToEdit | null;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  members,
  editingEvent,
}) => {
  const [thanhVienId, setThanhVienId] = useState("");
  const [loaiSuKien, setLoaiSuKien] = useState("");
  const [ngayXayRa, setNgayXayRa] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [moTa, setMoTa] = useState("");

  const isEditMode = !!editingEvent;

  useEffect(() => {
    if (editingEvent) {
      setThanhVienId(editingEvent.thanhVienId);
      setLoaiSuKien(editingEvent.loaiSuKien);
      const dateVal = editingEvent.ngayXayRa
        ? editingEvent.ngayXayRa.split("T")[0]
        : "";
      setNgayXayRa(dateVal);
      setDiaDiem(editingEvent.diaDiem || "");
      setMoTa(editingEvent.moTa || "");
    } else {
      resetForm();
    }
  }, [editingEvent, open]);

  const resetForm = () => {
    setThanhVienId("");
    setLoaiSuKien("");
    setNgayXayRa("");
    setDiaDiem("");
    setMoTa("");
  };

  const handleSubmit = () => {
    if (!thanhVienId) return alert("Vui lòng chọn thành viên");
    if (!loaiSuKien) return alert("Vui lòng nhập loại sự kiện");
    if (!ngayXayRa) return alert("Vui lòng nhập ngày xảy ra");

    const formData: EventFormData = { thanhVienId, loaiSuKien, ngayXayRa, diaDiem, moTa };

    if (isEditMode && onUpdate && editingEvent) {
      onUpdate(editingEvent.id, formData);
    } else {
      onSubmit(formData);
    }

    resetForm();
    onClose();
  };

  const inputSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      bgcolor: theme.white,
      '& fieldset': { borderColor: theme.borderColor },
      '&:hover fieldset': { borderColor: theme.textMuted },
      '&.Mui-focused fieldset': { borderColor: isEditMode ? theme.accentAmber : theme.accentBlue },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: isEditMode ? theme.accentAmber : theme.accentBlue },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(26, 26, 46, 0.6)', backdropFilter: 'blur(4px)' } // Darker backdrop matching Hero
        }
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            bgcolor: theme.cardBg,
            borderRadius: 3,
            width: { xs: '92%', sm: 500 },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          {/* ===== HEADER ===== (Navy Background) */}
          <Box
            sx={{
              p: 3,
              bgcolor: theme.headerBg,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `4px solid ${isEditMode ? theme.accentAmber : theme.accentBlue}`
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              {isEditMode
                ? <EditOutlinedIcon sx={{ fontSize: 26, color: theme.accentAmber }} />
                : <AddCircleOutlineIcon sx={{ fontSize: 26, color: theme.accentAmber }} />
              }
              <Typography variant="h6" fontWeight={700} color={theme.headerText}
                sx={{ fontFamily: 'system-ui, -apple-system, sans-serif', mt: '2px' }}>
                {isEditMode ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ===== BODY ===== */}
          <Box sx={{ p: 4, overflowY: 'auto', bgcolor: theme.white }}>
            {/* Thành viên */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <Typography variant="caption" fontWeight={600} color={theme.textMain}>Thành viên liên quan *</Typography>
            </Box>
            <FormControl fullWidth sx={{ ...inputSx }}>
              <InputLabel>Chọn thành viên</InputLabel>
              <Select value={thanhVienId} label="Chọn thành viên"
                onChange={(e) => setThanhVienId(e.target.value)}>
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.hoTen}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Loại sự kiện */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <EventNoteIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <Typography variant="caption" fontWeight={600} color={theme.textMain}>Sự kiện gì? *</Typography>
            </Box>
            <TextField fullWidth value={loaiSuKien} onChange={(e) => setLoaiSuKien(e.target.value)}
              placeholder="VD: Giỗ tổ, Họp mặt dòng họ, Đám cưới..." sx={inputSx} />

            {/* Ngày */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <Typography variant="caption" fontWeight={600} color={theme.textMain}>Ngày diễn ra *</Typography>
            </Box>
            <TextField type="date" fullWidth value={ngayXayRa} onChange={(e) => setNgayXayRa(e.target.value)}
              InputLabelProps={{ shrink: true }} sx={inputSx} />

            {/* Địa điểm */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOnIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <Typography variant="caption" fontWeight={600} color={theme.textMain}>Địa điểm diễn ra</Typography>
            </Box>
            <TextField fullWidth value={diaDiem} onChange={(e) => setDiaDiem(e.target.value)}
              placeholder="VD: Nhà thờ tổ, Gia đình chú Ba..." sx={inputSx} />

            {/* Mô tả */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <NotesIcon sx={{ fontSize: 18, color: theme.textMuted }} />
              <Typography variant="caption" fontWeight={600} color={theme.textMain}>Mô tả chi tiết</Typography>
            </Box>
            <TextField fullWidth multiline rows={3} value={moTa} onChange={(e) => setMoTa(e.target.value)}
              placeholder="Ghi chú thêm (chuẩn bị gì, ai tham gia...)" sx={inputSx} />
          </Box>

          {/* ===== FOOTER ===== */}
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${theme.borderColor}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              bgcolor: theme.bg
            }}
          >
            <Button variant="outlined" onClick={onClose}
              sx={{
                borderRadius: '8px', px: 3, textTransform: 'none', fontWeight: 600,
                color: theme.textMuted, borderColor: theme.borderColor,
                '&:hover': { borderColor: theme.textMain, bgcolor: 'rgba(0,0,0,0.04)' }
              }}>
              Hủy bỏ
            </Button>
            <Button variant="contained" onClick={handleSubmit}
              disabled={!thanhVienId || !loaiSuKien || !ngayXayRa}
              startIcon={isEditMode ? <SaveIcon /> : <AddCircleOutlineIcon />}
              sx={{
                borderRadius: '8px', px: 4, textTransform: 'none', fontWeight: 600,
                bgcolor: isEditMode ? theme.accentAmber : theme.accentBlue,
                color: isEditMode ? '#000' : '#fff', // Chữ đen cho nền vàng, trắng cho xanh
                boxShadow: isEditMode ? '0 4px 12px rgba(245,158,11,0.2)' : '0 4px 12px rgba(37,99,235,0.2)',
                '&:hover': { bgcolor: isEditMode ? theme.accentAmberHover : theme.accentBlueHover },
                '&.Mui-disabled': { bgcolor: theme.borderColor, color: theme.textMuted }
              }}>
              {isEditMode ? 'Lưu thay đổi' : 'Tạo sự kiện'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEventModal;