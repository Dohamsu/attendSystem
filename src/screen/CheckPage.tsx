// MyInfoPage.tsx
import React, {  } from 'react';
import { Box } from '@mui/material';
import CheckSeatChart from '../component/CheckSeatChart'


import "../css/checkPage.css"; 

const CheckPage: React.FC = () => {
  return (
    <>
       <CheckSeatChart></CheckSeatChart>  
    </>
  );
};

export default CheckPage;