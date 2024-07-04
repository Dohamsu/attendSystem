// ArrowNavigation.tsx
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

interface ArrowNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious: boolean;
  disableNext: boolean;
  title: React.ReactNode; // title을 tsx 컴포넌트로 받음
  date: string; // 날짜를 별도로 받음
}

const ArrowNavigation: React.FC<ArrowNavigationProps> = ({ onPrevious, onNext, disablePrevious, disableNext, title, date }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <IconButton onClick={onPrevious} disabled={disablePrevious}>
        <ArrowBackIosNew />
      </IconButton>
      <Box sx={{ mx: 2, textAlign: 'center' }}>
        <Typography variant="h5">{date}</Typography>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <IconButton onClick={onNext} disabled={disableNext}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default ArrowNavigation;
