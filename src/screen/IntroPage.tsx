import React, { useState, useEffect } from 'react';
import loadingImg1 from '../images/guitar1.png'; // 첫 번째 로딩 이미지 경로
import loadingImg2 from '../images/guitar2.png'; // 두 번째 로딩 이미지 경로
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/IntroPage.css';
import introImg from '../images/logo.png';
import { RootState } from '../stores/type';
import { AutoLoginCheck } from '../component/GoogleLogin'; // AutoLoginCheck 컴포넌트 임포트
import { AutoKakaoLoginCheck } from '../component/KakaoLogin'; // AutoLoginCheck 컴포넌트 임포트
import { useDispatch } from 'react-redux';
import { logoutUser, setLoginChecked } from '../stores/userSlice';

const LoadingAnimation: React.FC = () => {
  const [currentImg, setCurrentImg] = useState(loadingImg1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImg((currentImg: any) => (currentImg === loadingImg1 ? loadingImg2 : loadingImg1));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <img src={currentImg} alt="Loading..." style={{ width: 100, height: 100 }} />;
};

const AutoLoginNull: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoginChecked(true));
  }, []);
  return null;
};


const IntroPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const loginChecked = useSelector((state: RootState) => state.user.loginChecked);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로딩 상태를 2초 후에 종료
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // 로그인 상태 체크 및 페이지 이동을 3초 후에 수행
    const loginCheckTimer = setTimeout(() => {
      if (loginChecked) {
        if (isLoggedIn) {
          navigate('/calendar');
        } else {
          navigate('/login');
        }
      }
    }, 4000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(loginCheckTimer);
    };
  }, [loginChecked, isLoggedIn, navigate]);

  const renderAutoLoginCheck = () => {
    const lastPlatform = localStorage.getItem('last_login_platform');
    switch (lastPlatform) {
      case 'google':
        return <AutoLoginCheck />;
      case 'kakao':
        return <AutoKakaoLoginCheck />;
      default:       
        return <AutoLoginNull />;
    }
  };

  return (
    <>
      {renderAutoLoginCheck()}
      {!isLoading && (
        <div className="loading-container">
          <LoadingAnimation />
        </div>
      )}
      <div className={`intro-container`}>
        <img className="img" width={350} alt="Vector" src={introImg} />
      </div>
    </>
  );
};

export default IntroPage;