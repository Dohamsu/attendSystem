// CheckSeat.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/system';

type SeatStatus = 'available' | 'occupied' | 'selected';

interface SeatProps {
  status: SeatStatus;
  onToggle: () => void;
  className?: string;
  style?: React.CSSProperties; // 스타일 속성 추가
  sx?: SxProps<Theme>; // MUI 시스템 스타일 속성 추가 (선택적)
}

const CheckSeat: React.FC<SeatProps> = ({ status, onToggle, className, style, sx }) => {
  // 좌석 상태에 따른 배경 색상 코드
  const colorMap: Record<SeatStatus, string> = {
    available: '#4caf50', // 이용 가능 - 녹색
    occupied: '#f44336', // 이용 중 - 빨간색
    selected: '#2196f3', // 선택됨 - 파란색
  };

  return (
    <Button
      variant="contained"
      onClick={onToggle}
      className={className} // className을 props로 받아서 적용합니다.
      style={style} // style을 props로 받아서 적용합니다.
      sx={{ ...sx, backgroundColor: colorMap[status] }} // sx를 사용하여 스타일링합니다.
    >
      {/* 좌석 번호나 기타 내용을 표시 */}
    </Button>
  );
};

export default CheckSeat;
