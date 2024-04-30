// CheckSeat.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/system';

type SeatStatus = '0'|'1' | '2' | '3';

interface SeatProps {
  status: SeatStatus;
  onToggle: () => void;
  className?: string;
  style?: React.CSSProperties; // 스타일 속성 추가
  sx?: SxProps<Theme>; // MUI 시스템 스타일 속성 추가 (선택적)
  occupant?: string; // Add occupant as an optional property
}

const CheckSeat: React.FC<SeatProps> = ({ status, onToggle, className, style, sx, occupant }) => {
  // 좌석 상태에 따른 배경 색상 코드
  const colorMap: Record<SeatStatus, string> = {
    '0': '#FFA500', 
    '1': '#00b38360', 
    '2': '#00b383', 
    '3': '#FF6347',
  };

  return (
    <Button
      variant="contained"
      onClick={onToggle}
      className={className}
      style={style}
      sx={{ ...sx, backgroundColor: colorMap[status] }}
    >
      {occupant ? occupant : ""}
    </Button>
  );
};

export default CheckSeat;
