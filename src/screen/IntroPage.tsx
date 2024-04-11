import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/IntroPage.css'; // 인트로 페이지 CSS 스타일
import introImg from '../images/logo.png'; // 인트로 페이지 CSS 스타일
import { RootState } from '../stores/type';

const IntroPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigate('/calendar');
      }else{
        navigate('/login'); 
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-container">
      {/* 인트로 페이지 콘텐츠 */}
      <img className="img" width={350} alt="Vector" src={introImg} />
    </div>
  );
};

export default IntroPage;
