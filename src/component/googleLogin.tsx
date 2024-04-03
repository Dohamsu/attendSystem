// GoogleSignInButton.tsx
import React from 'react';
import { signInWithGoogle } from './authService'; // 로그인 함수 임포트
import googleLoginButton from '../images/google_login.png'
import { Box } from '@mui/material';
const GoogleLoginButton: React.FC = () => {
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      // 로그인 후 처리, 예: 사용자 정보를 상태로 관리하거나 화면 전환
      console.log('로그인 성공:', user);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Box>
      <img width={200} src={googleLoginButton} onClick={handleSignIn} alt='구글로그인 버튼 '></img>
    </Box>
  );
};

export default GoogleLoginButton;
