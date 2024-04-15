import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../stores/userSlice'; // 변경된 경로와 액션 이름

interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}

const KakaoCallBackpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKakaoAuth = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      
      if (code) {
        try {
          const response = await axios.post('http://localhost:4000/verify-kakao-token', { code });
          if (response.data.success) {
            const {  data } = response.data;
            console.log( response.data);
    
            localStorage.setItem('kakao_token', data.access_token); // 액세스 토큰을 로컬 스토리지에 저장
    
            const user = {
              name: data.properties.nickname || '익명',
              email: data.kakao_account.email || '',
              number: '익명',
              part: '익명',
              platform: 'kakao',
              socialLogin: 'kakao'
            };
    
            console.log('카카오 로그인 성공:', user);
            localStorage.setItem('last_login_platform', 'kakao');

            dispatch(loginUser(user));
          } else {
            alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        } catch (error) {
          console.error('인증 과정 중 에러 발생:', error);
          alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    };
    

    handleKakaoAuth();
  }, [navigate, dispatch]); // useEffect 의존성 배열에 navigate와 dispatch 추가
  
  return (
    <div>카카오 로그인 처리 중...</div>
  );
};

export default KakaoCallBackpage;
