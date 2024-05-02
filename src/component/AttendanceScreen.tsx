import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import SmileIcon from '@mui/icons-material/SentimentSatisfiedAlt';

interface AttendanceScreenProps {
  onAttend: () => void; // 출석 버튼 클릭 이벤트 핸들러 타입
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onAttend }) => {
  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <SmileIcon sx={{ fontSize: 60, color: 'skyblue' }} />
      <Typography variant="h6" sx={{ my: 2 }}>스마트 출석</Typography>
      <Typography variant="body1">출석시간까지</Typography>
      <Typography variant="h4" sx={{ my: 2 }}>12:35</Typography>
      <Button variant="contained" color="primary" onClick={onAttend} sx={{ mt: 2 }}>
        출석하기!
      </Button>
    </Box>
  );
};

export default AttendanceScreen;
