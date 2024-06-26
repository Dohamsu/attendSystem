// CheckSeat.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

// SeatProps 타입 정의
type SeatProps = {
  status: string;
  className: string;
  onToggle: () => void;
  occupant?: string;
};

const CheckSeat: React.FC<SeatProps> = ({ status, className, onToggle, occupant }) => {
  const getColor = () => {
    switch (status) {
      case '1':
        return '#00b38360'; // 예정
      case '2':
        return '#00b383'; // 참석
      case '3':
        return '#FF6347'; // 불참
      default:
        return '#A9A9A970'; // 대기
    }
  };

  const getFontWeight = () => {
    return status === '1' ? 'bold' : 'normal';
  };

  return (
    <Box
      className={className}
      onClick={onToggle}
      sx={{
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      {occupant && (
        <Typography variant="body2" align="center" sx={{ color: getColor(), fontWeight: getFontWeight() }}>
          {occupant}
        </Typography>
      )}
    </Box>
  );
};

export default CheckSeat;
