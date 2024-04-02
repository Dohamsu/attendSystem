// GoogleSignInButton.tsx
import React from 'react';
import { signInWithGoogle } from './authService'; // 로그인 함수 임포트

const GoogleSignInButton: React.FC = () => {
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
    <button onClick={handleSignIn}>구글 로그인</button>
  );
};

export default GoogleSignInButton;
