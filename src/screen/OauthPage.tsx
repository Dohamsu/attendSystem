import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { loginUser } from '../stores/authSlice';

interface User {
  name: string;
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

          // 백엔드 응답에 따라 다른 페이지로 리다이렉션
          if (response.data.success) {
            // 인증 성공 시

            console.log(response.data.data);
            localStorage.setItem('name', response.data.data.properties.nickname); // 일단 이름만 저장했다.
            console.log(response.data.data.properties); // 일단 이름만 저장했다.

            const user: User = {
              name: response.data.data.properties.name || '익명', // displayName이 없는 경우 '익명'으로 처리
              email: response.data.data.properties.email || '', // email이 없는 경우 빈 문자열로 처리
              platform: 'kakao', // email이 없는 경우 빈 문자열로 처리
            };
      
            console.log('로그인 성공:', user);
            dispatch(loginUser(user));

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
  }, []);
  
  return (
    <div>카카오 로그인 처리 중...</div>
  );
};

export default OAuthPage;
