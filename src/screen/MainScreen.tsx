import React from "react";
import "../css/mainScreen.css";
// SVG 파일들
import Path4 from "../images/path-4.svg";
import Path6 from "../images/path-6.svg";
import OvalCopy2 from "../images/oval-copy-2.svg";
// PNG 파일
import Slider from "../images/slider.png";
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../component/KakaoLogin'
import GoogleLoginButton from '../component/GoogleLogin'
import { Box } from "@mui/material";
import { NavBar } from "../component/NavBar";

const MainScreen = () => {

  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <div className="div">
        <div className="overlap">
          <img className="path" alt="Path" src={Path4} />
          <div className="slide">
            <div className="overlap-group">             
            </div>
          </div>
        </div>
        <img className="slider" alt="Slider" src={Slider} />
        <div className="sub-clipping-group">
          <div className="sub">제 30회 정기 연주회</div>
        </div>
        <div className="tittle-clipping">
          <p className="tittle">
            <span className="text-wrapper">본 서비스는 로그인 후 <br />
            이용 가능합니다
            </span>
          </p>
        </div>
        <div className="overlap-2">
          <p className="logo">
            <span onClick={()=> navigate('/')} 
            className="span">한음</span>
          </p>
          <img className="path-2" alt="Path" src={Path6}/>
          <img className="oval-copy" alt="Oval copy" src={OvalCopy2} />
        
        </div>
        <Box 
          sx={{
            position: 'relative',
            top: '510px',
            textAlign: 'center',
          }}>
            <KakaoLoginButton></KakaoLoginButton>
            <GoogleLoginButton></GoogleLoginButton>
        </Box>
        <Box>
          <NavBar/>
        </Box>
      </div>
    </div>
  );
};

export default MainScreen;
