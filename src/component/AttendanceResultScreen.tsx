import React from 'react';
import { Box, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AttendanceResultScreen: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <EventAvailableIcon sx={{ fontSize: 60,  color: '#00B383'  }} />
      <Typography variant="h6">출석 완료!</Typography>
    </Box>
  );
};

export default AttendanceResultScreen;
