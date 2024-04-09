import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import "../css/loginPage.css";
import Path4 from "../images/path-4.svg";
import Path6 from "../images/path-6.svg";
import OvalCopy2 from "../images/oval-copy-2.svg";
import Slider from "../images/slider.png";
import KakaoLoginButton from '../component/KakaoLogin'
import GoogleLoginButton from '../component/GoogleLogin'
import { Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { RootState } from '../stores/type'; // 상태 타입 임포트

const LoginPage = () => {

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    // 사용자가 로그인한 상태라면 홈 페이지로 리다이렉트
    if (isLoggedIn) {
      navigate('/check'); 
    }
  }, [isLoggedIn, navigate]);

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
    </div>
  )
};

export default LoginPage;
