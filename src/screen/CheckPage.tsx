// MyInfoPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 적절한 RootState 경로를 사용해주세요.
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconClock from "../images/nav/clock.svg";

// import "../css/checkPage.css"; // Make sure to create a corresponding CSS file

const CheckPage: React.FC = () => {
  return (
    <>
      <div className="event-form">
        <h2 className="form-title">출석 현황</h2>
       
      </div>

  
    </>
  );
};

export default CheckPage;