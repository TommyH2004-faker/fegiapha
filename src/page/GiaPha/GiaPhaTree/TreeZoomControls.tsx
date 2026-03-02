import { IconButton, ButtonGroup, Tooltip, Paper } from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  FitScreen,
  PictureAsPdf,
} from '@mui/icons-material';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface TreeZoomControlsProps {
  transformComponentRef: React.RefObject<ReactZoomPanPinchRef | null>;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export const TreeZoomControls = ({ 
  transformComponentRef, 
  onExportPDF, 
  isExporting
}: TreeZoomControlsProps) => {
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

  const handleResetTransform = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  };

  const handleCenterView = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.centerView(1, 300);
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        zIndex: 1000,
        boxShadow: 4,
      }}
    >
      <ButtonGroup orientation="vertical" variant="contained">
        <Tooltip title="Phóng to (hoặc cuộn chuột)" placement="left">
          <IconButton onClick={handleZoomIn} color="primary">
            <ZoomIn />
          </IconButton>
        </Tooltip>

        <Tooltip title="Thu nhỏ (hoặc cuộn chuột)" placement="left">
          <IconButton onClick={handleZoomOut} color="primary">
            <ZoomOut />
          </IconButton>
        </Tooltip>

        <Tooltip title="Căn giữa" placement="left">
          <IconButton onClick={handleCenterView} color="primary">
            <CenterFocusStrong />
          </IconButton>
        </Tooltip>

        <Tooltip title="Đặt lại" placement="left">
          <IconButton onClick={handleResetTransform} color="primary">
            <FitScreen />
          </IconButton>
        </Tooltip>

        {onExportPDF && (
          <Tooltip title="Xem trước và xuất PDF" placement="left">
            <span>
              <IconButton 
                onClick={onExportPDF} 
                color="success"
                disabled={isExporting}
              >
                <PictureAsPdf />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </ButtonGroup>
    </Paper>
  );
};
