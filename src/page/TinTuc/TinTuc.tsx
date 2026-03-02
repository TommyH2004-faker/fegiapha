import React, { useEffect, useState, useCallback } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Container,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import AddEventModal from "./AddEventModal";
import {
  getAllSuKien,
  createSuKien,
  updateSuKien,
  getThanhVien,
} from "../../api/suKienApi";

import tinTucTheme from "./tinTucTheme";

interface SuKien {
  id: string;
  thanhVienId: string;
  loaiSuKien: string;
  ngayXayRa: string;
  diaDiem?: string;
  moTa?: string;
}

interface ThanhVien {
  id: string;
  hoTen: string;
}

interface EventFormPayload {
  thanhVienId: string;
  loaiSuKien: string;
  ngayXayRa: string;
  diaDiem: string;
  moTa: string;
}

const TinTuc: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<SuKien[]>([]);
  const [members, setMembers] = useState<ThanhVien[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEvent, setEditingEvent] = useState<SuKien | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const eventRes = await getAllSuKien();
      let memberRes;
      try {
        memberRes = await getThanhVien();
      } catch {
        setErrorMsg("Không thể lấy danh sách thành viên. Vui lòng đăng nhập và chọn họ để thao tác.");
      }

      const eventData = Array.isArray(eventRes) ? eventRes : (eventRes?.data || []);
      const memberData = Array.isArray(memberRes) ? memberRes : (memberRes?.data || []);

      setEvents(eventData);

      if (memberData.length > 0) {
        setMembers(memberData);
      } else {
        setMembers([]);
        if (!errorMsg) {
          setErrorMsg("Không có thành viên nào trong họ hoặc bạn chưa có quyền truy cập.");
        }
      }
    } catch {
      setErrorMsg("Lỗi tải dữ liệu sự kiện hoặc thành viên. Vui lòng thử lại.");
      setEvents([]);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [errorMsg]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddEvent = async (data: EventFormPayload) => {
    setErrorMsg("");
    try {
      await createSuKien(data);
      await loadData();
    } catch {
      setErrorMsg("Lỗi thêm sự kiện. Vui lòng kiểm tra quyền hoặc đăng nhập lại.");
    }
  };

  const handleUpdateEvent = async (id: string, data: EventFormPayload) => {
    setErrorMsg("");
    try {
      await updateSuKien(id, data);
      await loadData();
    } catch {
      setErrorMsg("Lỗi cập nhật sự kiện. Vui lòng kiểm tra quyền hoặc đăng nhập lại.");
    }
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setOpen(true);
  };

  const handleOpenEdit = (ev: SuKien) => {
    setEditingEvent(ev);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingEvent(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: tinTucTheme.bg, pb: 6 }}>
      {/* ===== HERO SECTION (Giống Homepage) ===== */}
      <Box
        sx={{
          background: tinTucTheme.headerGradient,
          color: '#ffffff',
          textAlign: 'center',
          pt: 8,
          pb: 8,
          mb: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" mb={2}>
            <EventNoteIcon sx={{ fontSize: 48, color: tinTucTheme.btnPrimary }} />
          </Box>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ mb: 2, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
          >
            Tin Tức Dòng Họ
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 700, mx: 'auto', opacity: 0.9, fontWeight: 400, mb: 4 }}
          >
            Nơi cập nhật thông tin về các sự kiện quan trọng, những dịp giỗ chạp thiêng liêng và tin tức mới nhất của đại gia đình.
          </Typography>

          {errorMsg && (
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#fca5a5',
                p: 2,
                borderRadius: 2,
                mt: 1,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                maxWidth: 600,
                mx: 'auto',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <WarningAmberIcon fontSize="small" />
              <Typography variant="body2" fontWeight={500}>{errorMsg}</Typography>
            </Paper>
          )}

          <Button
            variant="contained"
            onClick={handleOpenAdd}
            disabled={members.length === 0}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              px: { xs: 4, md: 5 },
              py: 1.5,
              background: tinTucTheme.btnPrimary,
              color: '#000', // Đen/Xám đậm để nổi trên nền vàng
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              '&:hover': {
                background: tinTucTheme.btnPrimaryHover,
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.5)',
                boxShadow: 'none'
              }
            }}
          >
            Thêm Sự Kiện Mới
          </Button>
        </Container>
      </Box>

      {/* ===== CONTENT SECTION ===== */}
      <Container maxWidth="lg">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={10}>
            <CircularProgress size={50} thickness={4} sx={{ color: tinTucTheme.accentBlue }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 4
            }}
          >
            {events.length === 0 ? (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 4,
                    bgcolor: tinTucTheme.cardBg,
                    border: `1px dashed ${tinTucTheme.borderColor}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 56, color: '#adb5bd', mb: 2 }} />
                  <Typography variant="h5" color={tinTucTheme.textMain} fontWeight={700} gutterBottom>
                    Chưa có sự kiện nào được ghi nhận.
                  </Typography>
                  <Typography variant="body1" color={tinTucTheme.textMuted}>
                    Dòng họ chưa có sự kiện nào. Hãy là người đầu tiên tạo sự kiện!
                  </Typography>
                </Paper>
              </Box>
            ) : (
              events.map((ev, index) => {
                const member = members.find((m) => m.id === ev.thanhVienId);
                const eventDateOriginal = new Date(ev.ngayXayRa);
                const isPastEvent = eventDateOriginal.getTime() < new Date().getTime();

                const options: Intl.DateTimeFormatOptions = {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                };

                let dateStr = "Không xác định";
                if (!isNaN(eventDateOriginal.getTime())) {
                  dateStr = eventDateOriginal.toLocaleDateString('vi-VN', options);
                }

                // Xen kẽ các màu chủ đạo từ Homepage cho thanh gradient đầu thẻ
                const cardAccents = [tinTucTheme.accentBlue, tinTucTheme.accentGreen, '#d97706', '#7c3aed'];
                const cardAccentColor = isPastEvent ? '#adb5bd' : cardAccents[index % cardAccents.length];

                return (
                  <Box key={ev.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.1)'
                        },
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: tinTucTheme.cardBg
                      }}
                    >
                      {/* Top accent bar */}
                      <Box
                        sx={{
                          height: 6,
                          width: '100%',
                          background: cardAccentColor,
                          position: 'absolute',
                          top: 0
                        }}
                      />

                      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Header row: Event type + Status + Edit */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                          <Chip
                            icon={<EventNoteIcon fontSize="small" />}
                            label={ev.loaiSuKien}
                            size="medium"
                            sx={{
                              fontWeight: 700,
                              bgcolor: isPastEvent ? '#f8f9fa' : `${cardAccentColor}1A`,
                              color: isPastEvent ? tinTucTheme.textMuted : cardAccentColor,
                              fontSize: '0.9rem',
                              '& .MuiChip-icon': { color: isPastEvent ? tinTucTheme.textMuted : cardAccentColor }
                            }}
                          />
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                              icon={isPastEvent ? <HistoryIcon sx={{ fontSize: 14 }} /> : <CelebrationIcon sx={{ fontSize: 14 }} />}
                              label={isPastEvent ? "Đã qua" : "Sắp tới"}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                bgcolor: isPastEvent ? '#f1f5f9' : '#dcfce7',
                                color: isPastEvent ? '#64748b' : '#16a34a',
                                '& .MuiChip-icon': { color: isPastEvent ? '#64748b' : '#16a34a' }
                              }}
                            />
                            <Tooltip title="Chỉnh sửa sự kiện" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(ev)}
                                sx={{
                                  color: tinTucTheme.textMuted,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    color: tinTucTheme.accentBlue,
                                    bgcolor: `${tinTucTheme.accentBlue}1A`
                                  }
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                          <Box sx={{ bgcolor: tinTucTheme.iconBg, p: 1, borderRadius: 2, mr: 2, display: 'flex' }}>
                            <PersonIcon sx={{ fontSize: 20, color: tinTucTheme.accentBlue }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: tinTucTheme.textMuted }} display="block">Phụ trách</Typography>
                            <Typography variant="body2" fontWeight={700} color={tinTucTheme.textMain}>
                              {member ? member.hoTen : <span style={{ color: tinTucTheme.accentAmber, fontStyle: 'italic' }}>Không xác định</span>}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                          <Box sx={{ bgcolor: tinTucTheme.iconBg, p: 1, borderRadius: 2, mr: 2, display: 'flex' }}>
                            <CalendarMonthIcon sx={{ fontSize: 20, color: tinTucTheme.accentGreen }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: tinTucTheme.textMuted }} display="block">Ngày diễn ra</Typography>
                            <Typography variant="body2" fontWeight={700} color={tinTucTheme.textMain} sx={{ textTransform: 'capitalize' }}>
                              {dateStr}
                            </Typography>
                          </Box>
                        </Box>

                        {ev.diaDiem && (
                          <Box display="flex" alignItems="center" mb={2}>
                            <Box sx={{ bgcolor: tinTucTheme.iconBg, p: 1, borderRadius: 2, mr: 2, display: 'flex' }}>
                              <LocationOnIcon sx={{ fontSize: 20, color: '#d97706' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: tinTucTheme.textMuted }} display="block">Địa điểm</Typography>
                              <Typography variant="body2" fontWeight={700} color={tinTucTheme.textMain}>
                                {ev.diaDiem}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        <Divider sx={{ my: 2, mt: 'auto', borderColor: tinTucTheme.borderColor }} />

                        <Box display="flex" alignItems="flex-start">
                          <NotesIcon sx={{ fontSize: 20, mr: 1.5, mt: 0.2, color: tinTucTheme.textMuted }} />
                          <Typography variant="body2" sx={{ color: tinTucTheme.textMuted, lineHeight: 1.6 }}>
                            <span style={{ fontStyle: ev.moTa ? 'normal' : 'italic' }}>
                              {ev.moTa || "Chưa có mô tả chi tiết."}
                            </span>
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Container>

      <AddEventModal
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleAddEvent}
        onUpdate={handleUpdateEvent}
        members={members}
        editingEvent={editingEvent}
      />
    </Box>
  );
};

export default TinTuc;