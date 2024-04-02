import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OAuthPage = () => {
  const navigate = useNavigate();

  console.log("오스 페이지 호출 ");
  useEffect(() => {
    const handleKakaoAuth = async () => {
      // URL에서 인증 코드 추출
      const code = new URLSearchParams(window.location.search).get('code');
      
      console.log("request 두번이냐?");
      if (code) {
        try {
          // 백엔드로 인증 코드 전송 및 결과 받기
          const response = await axios.post('http://localhost:4000/verify-kakao-token', { code });

          // 백엔드 응답에 따라 다른 페이지로 리다이렉션
          if (response.data.success) {
            // 인증 성공 시
            localStorage.setItem('name', response.data.user_name); // 일단 이름만 저장했다.
            console.log(response.data.data.properties); // 일단 이름만 저장했다.

            navigate('/'); // 성공 페이지로 리다이렉션
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
