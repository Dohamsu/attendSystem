import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import "../css/loginPage.css";
import Path4 from "../images/path-4.svg";
import Path6 from "../images/path-6.svg";
import OvalCopy2 from "../images/oval-copy-2.svg";
import Slider from "../images/slider.png";
import Calendar from '../component/Calendar'
import GoogleLoginButton from '../component/GoogleLogin'
import { Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../stores/type'; // 상태 타입 임포트

const CalendarPage = () => {

  return (
    <div>
        <Calendar></Calendar>
    </div>
  )
};

export default CalendarPage;
