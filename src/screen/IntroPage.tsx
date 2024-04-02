import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/IntroPage.css'; // 인트로 페이지 CSS 스타일
import introImg from '../images/logo.png'; // 인트로 페이지 CSS 스타일

const IntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // 2초 후 메인 페이지로 이동
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
