import { useRef, useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Box, Card, CardContent, Typography, Avatar, Chip, CircularProgress } from '@mui/material';
import { Male, Female, CalendarToday } from '@mui/icons-material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import type { GiaPhaTreeResponse, GiaPhaNode, VoChongDto } from '../../../types/giaPha.types';
import { TreeContextMenu, type ContextMenuAction } from './TreeContextMenu';
import { TreeZoomControls } from './TreeZoomControls';
import { ViewMemberDialog } from './ViewMemberDialog';
import { AddChildDialog } from './AddChildDialog';
import { UploadPhotoDialog } from './UploadPhotoDialog';
import { DeleteMemberDialog } from './DeleteMemberDialog';
import { EditMemberDialog } from './EditMemberDialog';
import { AddSpouseDialog } from './AddSpouseDialog';
import { ViewHistoryDialog } from './ViewHistoryDialog';
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { giaPhaApi } from '../../../api/giaPhaApi';
import { toast } from 'react-toastify';

interface Props {
  treeData: GiaPhaTreeResponse;
  onRefresh?: () => void;
}

export const GiaPhaTreeView = ({ treeData, onRefresh }: Props) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const treeContainerRef = useRef<HTMLDivElement | null>(null);
  
  // PDF Export State
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfTreeData, setPdfTreeData] = useState<GiaPhaTreeResponse | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    member: GiaPhaNode;
  } | null>(null);

  // Dialog States
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [uploadPhotoDialogOpen, setUploadPhotoDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addSpouseDialogOpen, setAddSpouseDialogOpen] = useState(false);
  const [viewHistoryDialogOpen, setViewHistoryDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GiaPhaNode | null>(null);

  // Calculate optimal initial scale based on tree size
  const getInitialScale = () => {
    const memberCount = treeData.tongSoThanhVien;
    const generations = treeData.soCapDo;
    
    // Heuristic: larger trees need smaller initial scale
    if (memberCount > 50 || generations > 5) {
      return 0.4;
    } else if (memberCount > 20 || generations > 3) {
      return 0.5;
    } else {
      return 0.6;
    }
  };

  const initialScale = getInitialScale();

  // Auto center view when tree data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transformComponentRef.current) {
        transformComponentRef.current.centerView(initialScale, 0);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [treeData, initialScale]);

  // =======================
  // Event Handlers
  // =======================

  const handleContextMenuAction = (action: ContextMenuAction) => {
    if (!contextMenu) return;

    const member = contextMenu.member;
    setSelectedMember(member);

    switch (action) {
      case 'view':
        setViewDialogOpen(true);
        break;
      case 'edit':
        setEditDialogOpen(true);
        break;
      case 'addChild':
        setAddChildDialogOpen(true);
        break;
      case 'addSpouse':
        setAddSpouseDialogOpen(true);
        break;
      case 'viewHistory':
        setViewHistoryDialogOpen(true);
        break;
      case 'uploadPhoto':
        setUploadPhotoDialogOpen(true);
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
    }
  };

  const handleDialogSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // =======================
  // PDF Export Handler
  // =======================
  
  const handleExportPDF = async () => {
    try {
      setIsLoadingPreview(true);
      toast.info('Đang tải dữ liệu...');

      // Fetch tree data without deleted members
      const response = await giaPhaApi.getMyGiaPhaTree(false); // includeDeleted = false
      
      if (!response.isSuccess || !response.data) {
        toast.error('Không thể tải dữ liệu gia phả');
        return;
      }

      // Set data and open preview dialog
      setPdfTreeData(response.data);
      setPdfPreviewOpen(true);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast.error('Lỗi khi tải dữ liệu xem trước');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // =======================
  // Helper Functions
  // =======================

  // Convert VoChongDto to GiaPhaNode-like structure for context menu
  const convertVoChongToNode = (voChong: VoChongDto, parentMember: GiaPhaNode): GiaPhaNode => {
    // Giới tính của vợ/chồng ngược với giới tính của member chính
    const spouseGender = !parentMember.gioiTinh;
    
    return {
      id: voChong.voChongId,
      hoTen: voChong.hoTen,
      gioiTinh: spouseGender,
      ngaySinh: voChong.ngaySinh,
      ngayMat: voChong.ngayMat,
      level: parentMember.level,
      avatar: voChong.avatar,
      hoId: parentMember.hoId,
      chiHoId: parentMember.chiHoId,
      danhSachVoChong: [],
      con: [],
      hasChildren: false,
      tongSoCon: 0,
      isDeleted: false,
      tieuSu: null, // VoChongDto không có tieuSu, để null hoặc có thể map nếu cần
    };
  };

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

  // =======================
  // Member Card Component
  // =======================

  const MemberCard = ({
    member,
    isSpouse = false,
    parentMember,
  }: {
    member: GiaPhaNode | VoChongDto;
    isSpouse?: boolean;
    parentMember?: GiaPhaNode;
  }) => {

    const gioiTinh = 'gioiTinh' in member ? member.gioiTinh : true;
    const ngayMat = member.ngayMat;
    const isAlive = !ngayMat;
    const isDeleted = 'isDeleted' in member ? member.isDeleted : false; // ✅ Check if deleted
    
    const avatarUrl = member.avatar;
    const hasAvatar = avatarUrl && avatarUrl.trim() !== '';

    const handleContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Handle both GiaPhaNode and VoChongDto
      if ('id' in member) {
        // GiaPhaNode
        setContextMenu({
          mouseX: event.clientX,
          mouseY: event.clientY,
          member: member,
        });
      } else if ('voChongId' in member && parentMember) {
        // VoChongDto - convert to GiaPhaNode-like structure
        const convertedMember = convertVoChongToNode(member, parentMember);
        setContextMenu({
          mouseX: event.clientX,
          mouseY: event.clientY,
          member: convertedMember,
        });
      }
    };

    return (
      <Card
        onContextMenu={handleContextMenu}
        // sx={{
        //   minWidth: 200,
        //   maxWidth: 250,
        //   border: isSpouse ? '2px dashed #f48fb1' : '2px solid #1976d2',
        //   borderRadius: 2,
        //   boxShadow: 3,
        //   bgcolor: isAlive ? 'background.paper' : '#f5f5f5',
        //   cursor: 'pointer',
        //   transition: 'transform 0.2s, box-shadow 0.2s',
        //   '&:hover': {
        //     transform: 'translateY(-4px)',
        //     boxShadow: 6,
        //   },
        // }}
              sx={{
        minWidth: 220,
        maxWidth: 260,
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        background: isAlive
          ? 'linear-gradient(145deg,#ffffff,#f8fafc)'
          : '#f1f5f9',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        opacity: isDeleted ? 0.5 : 1, // ✅ Mờ đi nếu đã xóa

        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        },

        ...(isSpouse && {
          border: '2px dashed #fbcfe8',
        }),
        
        ...(isDeleted && { // ✅ Style đặc biệt cho người đã xóa
          border: '2px solid #ef4444',
          background: '#fef2f2',
          filter: 'grayscale(0.5)',
        }),
      }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {/* <Avatar
              src={hasAvatar ? avatarUrl : undefined}
              sx={{
                bgcolor: gioiTinh ? '#f48fb1' : '#42a5f5',
                width: 48,
                height: 48,
              }}
            >
              {!hasAvatar && (gioiTinh ? <Female /> : <Male />)}
            </Avatar> */}
            <Avatar
          src={hasAvatar ? avatarUrl : undefined}
          sx={{
            width: 56,
            height: 56,
            fontSize: 26,
            background: gioiTinh
              ? 'linear-gradient(135deg,#f472b6,#ec4899)'
              : 'linear-gradient(135deg,#60a5fa,#3b82f6)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {!hasAvatar && (gioiTinh ? <Female /> : <Male />)}
        </Avatar>

            <Box flex={1}>
              <Typography fontWeight="bold">
                {member.hoTen?.trim()}
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                <Chip
                  size="small"
                  label={gioiTinh ? 'Nữ' : 'Nam'}
                  color={gioiTinh ? 'secondary' : 'primary'}
                />
                {isDeleted && ( // ✅ Hiển thị badge "Đã xóa"
                  <Chip
                    size="small"
                    label="Đã xóa"
                    color="error"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14 }} />
            <Typography variant="caption">
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
            <Typography variant="caption" color="error">
              ✝ {formatDate(ngayMat)} (
              {calculateAge(member.ngaySinh, ngayMat)} tuổi)
            </Typography>
          )}

          {'level' in member && (
            <Typography variant="caption" color="primary">
              Đời {member.level + 1}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // =======================
  // Family Node (Recursive)
  // =======================

  const FamilyNode = ({ member }: { member: GiaPhaNode }) => {
    const spouses = getSpouses(member);
    const children = getChildren(member);

    if (spouses.length === 0) {
      return (
        <TreeNode label={<MemberCard member={member} />}>
          {children.map((child) => (
            <FamilyNode key={child.id} member={child} />
          ))}
        </TreeNode>
      );
    }

    return (
      <TreeNode
        // label={
        //   <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
        //     <MemberCard member={member} />
        //     {spouses.map((sp) => (
        //       <Box key={sp.voChongId} textAlign="center">
        //         <MemberCard member={sp} isSpouse />
        //         {sp.ngayKetHon && (
        //           <Typography variant="caption">
        //             ⚭ {formatDate(sp.ngayKetHon)}
        //           </Typography>
        //         )}
        //       </Box>
        //     ))}
        //   </Box>
        // }
              label={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
          sx={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '12px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          <MemberCard member={member} />

          {spouses.map((sp) => (
            <Box key={sp.voChongId} textAlign="center">
              <MemberCard member={sp} isSpouse parentMember={member} />
              {sp.ngayKetHon && (
                <Typography variant="caption" color="text.secondary">
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

  // =======================
  // Main Render
  // =======================

  return (
    <Box sx={{ position: 'relative', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <Box sx={{ p: 3, pb: 2, bgcolor: '#f5f7fa', position: 'sticky', top: 0, zIndex: 100 }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" color="#1e293b" sx={{ letterSpacing: 2 }}>
            GIA PHẢ{' '}
            <span style={{ color: '#e90c0c', textTransform: 'uppercase' }}>
              {treeData.tenHo}
            </span>
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Chip label={`${treeData.tongSoThanhVien} thành viên`} color="primary" />
            <Chip label={`${treeData.soCapDo} đời`} color="secondary" />
            <Chip label={`Thủy tổ: ${treeData.thuyTo.hoTen}`} color="info" />
          </Box>

          <Box 
            sx={{ 
              mt: 2, 
              mx: 'auto', 
              maxWidth: '800px',
              bgcolor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="primary.dark" display="block" textAlign="center" fontWeight={500}>
              <strong>Hướng dẫn:</strong> Click chuột phải vào thành viên để xem menu • Cuộn chuột để zoom in/out • 
              Kéo thả để di chuyển cây • Dùng nút điều khiển bên phải để căn giữa
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tree with Zoom */}
      <Box sx={{ p: 3, pt: 1 }}>
        <TransformWrapper
          ref={transformComponentRef}
          initialScale={initialScale}
          minScale={0.1}
          maxScale={2.5}
          centerOnInit
          limitToBounds={false}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
          panning={{ 
            velocityDisabled: false,
            disabled: false,
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              background: 'linear-gradient(180deg,#f8fafc,#e2e8f0)',
              overflow: 'hidden',
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
            wrapperProps={{
              onContextMenu: (e: React.MouseEvent) => {
                // Cho phép context menu custom, chặn menu mặc định
                e.preventDefault();
              },
            }}
          >
            <Box 
              ref={treeContainerRef}
              sx={{ 
                px: 8,
                py: 4,
                minWidth: 'max-content',
                minHeight: 'max-content',
                display: 'flex',
                justifyContent: 'center',
                '& > div': {
                  // Override react-organizational-chart styles
                  display: 'inline-block',
                },
                '& ul': {
                  paddingLeft: 0,
                  display: 'flex',
                  justifyContent: 'center',
                },
              }}
              onContextMenu={(e) => {
                // Chặn context menu mặc định của trình duyệt
                // Event từ MemberCard sẽ tự xử lý
                if ((e.target as HTMLElement).closest('.MuiCard-root')) {
                  e.preventDefault();
                }
              }}
            >
              <Tree
                lineWidth="1.5px"
                lineColor="#cbd5e1"
                lineBorderRadius="8px"
                label={<Box />}
              >
                <FamilyNode member={treeData.thuyTo} />
              </Tree>
              
            </Box>
          </TransformComponent>
        </TransformWrapper>
      </Box>

      {/* Zoom Controls */}
      <TreeZoomControls 
        transformComponentRef={transformComponentRef}
        onExportPDF={handleExportPDF}
        isExporting={isLoadingPreview}
      />

      {/* Export Loading Overlay */}
      {isLoadingPreview && (
        <Box
          sx={{
            position: 'fixed',
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
            <Typography variant="h6">Đang tải dữ liệu...</Typography>
          </Box>
        </Box>
      )}

      {/* PDF Preview Dialog */}
      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        treeData={pdfTreeData}
      />

      {/* Context Menu */}
      <TreeContextMenu
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : null
        }
        onClose={() => setContextMenu(null)}
        onAction={handleContextMenuAction}
        selectedMember={contextMenu?.member || null}
      />

      {/* Dialogs */}
      <ViewMemberDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        member={selectedMember}
      />

      <EditMemberDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        member={selectedMember}
        onSuccess={handleDialogSuccess}
      />

      <AddChildDialog
        open={addChildDialogOpen}
        onClose={() => setAddChildDialogOpen(false)}
        parentMember={selectedMember ? {
          id: selectedMember.id,
          hoId: selectedMember.hoId,
          chiHoId: selectedMember.chiHoId,
          hoTen: selectedMember.hoTen
        } : null}
        onSuccess={handleDialogSuccess}
      />

      <AddSpouseDialog
        open={addSpouseDialogOpen}
        onClose={() => setAddSpouseDialogOpen(false)}
        member={selectedMember}
        onSuccess={handleDialogSuccess}
      />

      <UploadPhotoDialog
        open={uploadPhotoDialogOpen}
        onClose={() => setUploadPhotoDialogOpen(false)}
        memberId={selectedMember?.id || ''}
        memberName={selectedMember?.hoTen || ''}
        currentAvatar={selectedMember?.avatar || null}
        gioiTinh={selectedMember?.gioiTinh || false}
        onSuccess={handleDialogSuccess}
      />

      <ViewHistoryDialog
        open={viewHistoryDialogOpen}
        onClose={() => setViewHistoryDialogOpen(false)}
        member={selectedMember}
      />

      <DeleteMemberDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        memberId={selectedMember?.id || ''}
        memberName={selectedMember?.hoTen || ''}
        hasChildren={selectedMember?.hasChildren || false}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
};
