import React, { useState, useEffect } from 'react';
import loadingImg1 from '../images/guitar1.png'; // 첫 번째 로딩 이미지 경로
import loadingImg2 from '../images/guitar2.png'; // 두 번째 로딩 이미지 경로
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/IntroPage.css';
import introImg from '../images/logo.png';
import { RootState } from '../stores/type';
import { AutoLoginCheck } from '../component/GoogleLogin'; // AutoLoginCheck 컴포넌트 임포트


const LoadingAnimation: React.FC = () => {
  const [currentImg, setCurrentImg] = useState(loadingImg1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImg((currentImg: any) => (currentImg === loadingImg1 ? loadingImg2 : loadingImg1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <img src={currentImg} alt="Loading..." style={{ width: 100, height: 100 }} />;
};


const IntroPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const loginChecked = useSelector((state: RootState) => state.user.loginChecked);
  const [isLoading, setIsLoading] = useState(false);

  const timer = setTimeout(() => {
    setIsLoading(true);
  }, 2000);

  useEffect(() => {
    // 3초 후 로그인 상태 확인
    const delayTimer = setTimeout(() => {
      console.log('3초 후 실행됨');
      if (loginChecked) {
        if (isLoggedIn) {
          navigate('/calendar');
        } else {
          navigate('/login');
        }
      }
    }, 3000);

    return () => clearTimeout(delayTimer);
  }, [loginChecked, isLoggedIn, navigate]);

  return (
    <>
      <AutoLoginCheck /> {/* 자동 로그인 확인 */}
      {isLoading && (
        <div className="loading-container">
          <LoadingAnimation></LoadingAnimation>
        </div>
      )}
      <div className={`intro-container ${isLoading ? 'hide' : ''}`}>
        <img className="img" width={350} alt="Vector" src={introImg} />
      </div>
    </>
  );
};

export default IntroPage;
