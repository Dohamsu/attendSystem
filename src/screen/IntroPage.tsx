import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../css/IntroPage.css';
import introImg from '../images/logo.png';
import { RootState } from '../stores/type';
import { AutoLoginCheck } from '../component/GoogleLogin'; // AutoLoginCheck 컴포넌트 임포트

const IntroPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('타이머 돌았음 ');
      // isLoggedIn 상태에 따라 적절한 페이지로 리다이렉션
      if (isLoggedIn) {
        navigate('/calendar');
      } else {
        navigate('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]); // 의존성 배열에 isLoggedIn 추가

  return (
    <>
      <AutoLoginCheck /> {/* 자동 로그인 확인 */}
      <div className="intro-container">
        <img className="img" width={350} alt="Vector" src={introImg} />
      </div>
    </>
  );
};

export default IntroPage;
