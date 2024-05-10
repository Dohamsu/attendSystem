// CheckSeat.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/system';

type SeatStatus = '0'|'1' | '2' | '3';

interface SeatProps {
  status: SeatStatus;
  onToggle?: () => void;
  className?: string;
  style?: React.CSSProperties; // 스타일 속성 추가
  sx?: SxProps<Theme>; // MUI 시스템 스타일 속성 추가 (선택적)
  occupant?: string; // Add occupant as an optional property
}

const CheckSeat: React.FC<SeatProps> = ({ status, onToggle, className, style, sx, occupant }) => {
  // 좌석 상태에 따른 배경 색상 코드
  const colorMap: Record<SeatStatus, string> = {
    '0': '#A9A9A970', // 주황색
    '1': '#00b38360', // 연두색 투명
    '2': '#00b383', // 연두색
    '3': '#FF6347', // 토마토색
  };

  const textColorMap: Record<SeatStatus, string> = {
    '0': '#333333', // 어두운 회색 (주황색 배경에 대한 대비)
    '1': '#33333397', // 반투명한 하얀색 (연두색 투명 배경에 대한 대비)
    '2': '#FFFFFF', // 하얀색 (연두색 배경에 대한 대비)
    '3': '#FFFFFF', // 하얀색 (토마토색 배경에 대한 대비)
  };

  return (
    <Button
      variant="contained"
      // onClick={onToggle}
      className={className}
      style={style}
      sx={{ ...sx, backgroundColor: colorMap[status], color: textColorMap[status] }}
    >
      {occupant ? occupant : ""}
    </Button>
  );
};

export default CheckSeat;
