// kakaoLogin.tsx
import React from 'react';
import { Box } from '@mui/material';
import kakaoLoginImage from '../images/kakao_login.png';
import CONST from '../common/const';

const KakaoLoginButton: React.FC = () => { // 함수 컴포넌트에 대한 타입 정의
  const handleKakaoLogin = async () => {
    console.log("클릭됨 ");
    const Rest_api_key= CONST.KAKAO_REST_API_KEY; //REST API KEY
    const redirect_uri = CONST.KAKAO_REDIRECT_URL //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    
    window.location.href = kakaoURL

    // const code = new URL(window.location.href).searchParams.get("code");
  
    // console.log(code);
  };

  return (
    <Box pb={2}>
    <img  onClick={handleKakaoLogin} src={kakaoLoginImage} alt="description"/>
  </Box>
  );
};

export default KakaoLoginButton;
