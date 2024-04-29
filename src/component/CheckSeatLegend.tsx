// Legend.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const CheckSeatLegend: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px' }}>
      {/* 범례 항목을 배열로 만들어서 map을 사용하여 표시할 수 있습니다. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: '20px', height: '20px', backgroundColor: '#00b38360'}} />
        <Typography>출석 예정</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: '20px', height: '20px', backgroundColor: '#00b383' }} />
        <Typography>출석 완료</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: '20px', height: '20px', backgroundColor: '#FF6347' }} />
        <Typography>불참</Typography>
      </Box>
    
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: '20px', height: '20px', backgroundColor: '#FFA500' }} />
        <Typography>미정</Typography>
      </Box>
    </Box>
  );
};

export default CheckSeatLegend;
