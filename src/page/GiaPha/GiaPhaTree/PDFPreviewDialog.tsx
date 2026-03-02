import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close, PictureAsPdf, ZoomIn, ZoomOut, CenterFocusStrong } from '@mui/icons-material';
import { Tree, TreeNode } from 'react-organizational-chart';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import type { GiaPhaTreeResponse, GiaPhaNode, VoChongDto } from '../../../types/giaPha.types';
import { Card, CardContent, Avatar, Chip } from '@mui/material';
import { Male, Female, CalendarToday } from '@mui/icons-material';
import { exportToPDF } from '../../../utils/pdfExport';
import { toast } from 'react-toastify';

interface PDFPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  treeData: GiaPhaTreeResponse | null;
}

export const PDFPreviewDialog = ({ open, onClose, treeData }: PDFPreviewDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  };

  const calculateAge = (birthDate: string | null | undefined, deathDate?: string | null): number => {
    if (!birthDate) return 0;
    try {
      const birth = new Date(birthDate);
      if (isNaN(birth.getTime())) return 0;
      const end = deathDate ? new Date(deathDate) : new Date();
      if (isNaN(end.getTime())) return 0;
      return end.getFullYear() - birth.getFullYear();
    } catch {
      return 0;
    }
  };

  const getChildren = (member: GiaPhaNode): GiaPhaNode[] => {
    const raw: unknown = member.con;
    if (Array.isArray(raw)) return raw as GiaPhaNode[];
    if (
      typeof raw === 'object' && raw !== null &&
      '$values' in raw && Array.isArray((raw as { $values: unknown }).$values)
    ) {
      return (raw as { $values: GiaPhaNode[] }).$values;
    }
    return [];
  };

  const getSpouses = (member: GiaPhaNode): VoChongDto[] => {
    const raw: unknown = member.danhSachVoChong;
    if (Array.isArray(raw)) return raw as VoChongDto[];
    if (
      typeof raw === 'object' && raw !== null &&
      '$values' in raw && Array.isArray((raw as { $values: unknown }).$values)
    ) {
      return (raw as { $values: VoChongDto[] }).$values;
    }
    return [];
  };

  // Member Card for PDF Preview
  const MemberCard = ({
    member,
    isSpouse = false,
  }: {
    member: GiaPhaNode | VoChongDto;
    isSpouse?: boolean;
  }) => {
    const gioiTinh = 'gioiTinh' in member ? member.gioiTinh : true;
    const ngayMat = member.ngayMat;
    const isAlive = !ngayMat;
    
    const avatarUrl = member.avatar;
    const hasAvatar = avatarUrl && avatarUrl.trim() !== '';

    return (
      <Card
        sx={{
          minWidth: 240,
          maxWidth: 280,
          borderRadius: '12px',
          border: isSpouse ? '2px dashed #fbcfe8' : '2px solid #3b82f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: isAlive
            ? '#ffffff'
            : '#f8fafc',
          margin: '10px',
        }}
      >
        <CardContent sx={{ padding: '16px !important' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
            <Avatar
              src={hasAvatar ? avatarUrl : undefined}
              sx={{
                width: 52,
                height: 52,
                fontSize: 24,
                background: gioiTinh
                  ? 'linear-gradient(135deg,#f472b6,#ec4899)'
                  : 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                flexShrink: 0,
              }}
            >
              {!hasAvatar && (gioiTinh ? <Female /> : <Male />)}
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography fontWeight="bold" sx={{ fontSize: '0.95rem', mb: 0.5, wordBreak: 'break-word' }}>
                {member.hoTen?.trim()}
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                <Chip
                  size="small"
                  label={gioiTinh ? 'Nữ' : 'Nam'}
                  color={gioiTinh ? 'secondary' : 'primary'}
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={0.5} alignItems="center" mb={0.5}>
            <CalendarToday sx={{ fontSize: 13 }} />
            <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
              {member.ngaySinh ? (
                <>
                  {formatDate(member.ngaySinh)}
                  {isAlive && ` (${calculateAge(member.ngaySinh)} tuổi)`}
                </>
              ) : (
                'Chưa rõ ngày sinh'
              )}
            </Typography>
          </Box>

          {ngayMat && (
            <Typography variant="caption" color="error" sx={{ fontSize: '0.8rem', display: 'block' }}>
              ✝ {formatDate(ngayMat)} (
              {calculateAge(member.ngaySinh, ngayMat)} tuổi)
            </Typography>
          )}

          {'level' in member && (
            <Typography variant="caption" color="primary" sx={{ fontSize: '0.8rem', display: 'block', mt: 0.5 }}>
              Đời {member.level + 1}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // Family Node (Recursive)
  const FamilyNode = ({ member }: { member: GiaPhaNode }) => {
    const spouses = getSpouses(member);
    const children = getChildren(member);

    if (spouses.length === 0) {
      return (
        <TreeNode label={<Box sx={{ p: 1 }}><MemberCard member={member} /></Box>}>
          {children.map((child) => (
            <FamilyNode key={child.id} member={child} />
          ))}
        </TreeNode>
      );
    }

    return (
      <TreeNode
        label={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            sx={{
              background: 'transparent',
              padding: '8px 16px',
              minHeight: '120px',
            }}
          >
            <MemberCard member={member} />

            {spouses.map((sp) => (
              <Box key={sp.voChongId} textAlign="center">
                <MemberCard member={sp} isSpouse />
                {sp.ngayKetHon && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    ⚭ {formatDate(sp.ngayKetHon)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        }
      >
        {children.map((child) => (
          <FamilyNode key={child.id} member={child} />
        ))}
      </TreeNode>
    );
  };

  const handleExportPDF = async () => {
  if (!previewContainerRef.current || !treeData) return;

  try {
    setIsExporting(true);

    await exportToPDF(previewContainerRef.current, {
      filename: `gia-pha-${treeData.tenHo}-${new Date()
        .toISOString()
        .split('T')[0]}.pdf`,
      scale: 2,
      orientation: 'landscape',
    });

    toast.success('Xuất PDF thành công!');
    onClose();
  } catch {
    toast.error('Lỗi khi xuất PDF');
  } finally {
    setIsExporting(false);
  }
};

  const handleZoomIn = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomIn(0.3);
    }
  };

  const handleZoomOut = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomOut(0.3);
    }
  };

  const handleCenterView = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.centerView(0.5, 300);
    }
  };

  if (!treeData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: '#f5f7fa',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: 'white',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Xem trước: Gia phả {treeData.tenHo}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {treeData.tongSoThanhVien} thành viên • {treeData.soCapDo} đời • Không bao gồm người đã xóa
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={isExporting}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
        <Alert severity="info" sx={{ m: 2 }}>
          Kiểm tra kỹ phả đồ trước khi xuất. Sử dụng các nút bên dưới để phóng to/thu nhỏ.
        </Alert>

        {/* Zoom Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            p: 1,
          }}
        >
          <IconButton onClick={handleZoomIn} color="primary" size="small">
            <ZoomIn />
          </IconButton>
          <IconButton onClick={handleZoomOut} color="primary" size="small">
            <ZoomOut />
          </IconButton>
          <IconButton onClick={handleCenterView} color="primary" size="small">
            <CenterFocusStrong />
          </IconButton>
        </Box>

        <Box sx={{ height: 'calc(100vh - 200px)', bgcolor: 'white' }}>
          <TransformWrapper
            ref={transformComponentRef}
            initialScale={0.5}
            minScale={0.1}
            maxScale={2}
            centerOnInit
            limitToBounds={false}
            wheel={{ step: 0.1 }}
          >
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
              }}
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '60px',
                paddingBottom: '60px',
              }}
            >
              <Box
                ref={previewContainerRef}
                sx={{
                  px: 8,
                  py: 6,
                  width: 'fit-content',
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'white',
                  gap: 6,
                }}
              >
                {/* Header for PDF */}
                <Box sx={{ 
                  textAlign: 'center', 
                  width: '100%',
                  pb: 2,
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold" 
                    color="#1e293b" 
                    sx={{ 
                      letterSpacing: 2, 
                      mb: 3,
                      fontSize: '2.5rem'
                    }}
                  >
                    GIA PHẢ {treeData.tenHo.toUpperCase()}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={3} mt={2} flexWrap="wrap">
                    <Chip 
                      label={`${treeData.tongSoThanhVien} thành viên`} 
                      color="primary" 
                      size="medium"
                      sx={{ fontSize: '0.9rem', py: 2.5 }}
                    />
                    <Chip 
                      label={`${treeData.soCapDo} đời`} 
                      color="secondary" 
                      size="medium"
                      sx={{ fontSize: '0.9rem', py: 2.5 }}
                    />
                    <Chip 
                      label={`Thủy tổ: ${treeData.thuyTo.hoTen}`} 
                      color="info" 
                      size="medium"
                      sx={{ fontSize: '0.9rem', py: 2.5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Ngày xuất: {new Date().toLocaleDateString('vi-VN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>

                {/* Tree */}
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center',
                  pt: 4,
                  '& ul': {
                    paddingLeft: '0 !important',
                    marginTop: '40px !important',
                    marginBottom: '40px !important',
                    display: 'flex !important',
                    justifyContent: 'center !important',
                    alignItems: 'flex-start !important',
                    gap: '30px',
                  },
                  '& li': {
                    marginTop: '40px !important',
                    marginBottom: '20px !important',
                    position: 'relative',
                    padding: '10px !important',
                  },
                  '& > div': {
                    display: 'inline-block',
                  },
                  '& table': {
                    borderSpacing: '40px 50px !important',
                  },
                  '& td': {
                    padding: '20px !important',
                  }
                }}>
                  <Tree
                    lineWidth="2px"
                    lineColor="#94a3b8"
                    lineBorderRadius="10px"
                    label={<Box />}
                  >
                    <FamilyNode member={treeData.thuyTo} />
                  </Tree>
                </Box>
              </Box>
            </TransformComponent>
          </TransformWrapper>
        </Box>

        {/* Export Loading Overlay */}
        {isExporting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
              <Typography variant="h6">Đang xuất PDF...</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', bgcolor: 'white', p: 2 }}>
        <Button onClick={onClose} disabled={isExporting}>
          Đóng
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<PictureAsPdf />}
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          Xuất PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};
