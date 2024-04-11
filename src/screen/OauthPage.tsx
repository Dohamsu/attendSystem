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

const OAuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKakaoAuth = async () => {
      // URL에서 인증 코드 추출
      const code = new URLSearchParams(window.location.search).get('code');
      
      if (code) {
        try {
          // 백엔드로 인증 코드 전송 및 결과 받기
          const response = await axios.post('http://localhost:4000/verify-kakao-token', { code });

          if (response.data.success) {
            // 인증 성공 시, 백엔드 응답으로부터 사용자 정보 추출
            const user: User = {
              name: response.data.data.properties.nickname || '익명',
              email: response.data.data.kakao_account.email || '',
              number: '익명',
              part: '익명',
              platform: 'kakao',
              socialLogin: ''
            };

            console.log('로그인 성공:', user);
            dispatch(loginUser(user)); // Redux 스토어에 사용자 정보 저장

            navigate('/myinfo'); // 성공 페이지로 리다이렉션
          } else {
            // 인증 실패 또는 기타 조건 시
            navigate('/failure'); // 실패 페이지로 리다이렉션
          }
        } catch (error) {
          console.error('인증 과정 중 에러 발생:', error);
          navigate('/failure'); // 에러 발생 시 실패 페이지로 리다이렉션
        }
      }
    };

    handleKakaoAuth();
  }, [navigate, dispatch]); // useEffect 의존성 배열에 navigate와 dispatch 추가
  
  return (
    <div>카카오 로그인 처리 중...</div>
  );
};

export default OAuthPage;
