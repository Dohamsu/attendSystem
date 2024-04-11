import React, { useEffect } from 'react';
import { signInWithGoogle } from './authService';
import googleLoginButton from '../images/google_login.png';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../stores/userSlice'; // 수정: loginUser, logoutUser 액션 임포트
import { Box } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string;
  platform: string;
}

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // 사용자가 로그인한 상태
        const user: User = {
          name: firebaseUser.displayName || '익명',
          email: firebaseUser.email || '',
          number: '익명', // 이 필드는 실제 어플리케이션에 맞게 조정 필요
          part: '익명', // 이 필드는 실제 어플리케이션에 맞게 조정 필요
          platform: 'Google', // 'google' 대신 'Google'로 변경될 수 있음
          socialLogin: 'Google', // socialLogin 필드 추가
        };
        dispatch(loginUser(user)); // loginUser 액션으로 변경
        console.log('자동 로그인 성공:', user);
      } else {
        // 사용자가 로그아웃한 상태 혹은 로그인하지 않은 상태
        console.log('사용자가 로그인하지 않았습니다.');
        dispatch(logoutUser()); // logoutUser 액션을 사용하여 사용자 정보 초기화
      }
    });
  }, [dispatch]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle(); // signInWithGoogle 함수는 로그인 처리만 담당
      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Box>
      <img width={200} src={googleLoginButton} onClick={handleSignIn} alt='구글로그인 버튼'></img>
    </Box>
  );
};

export default GoogleLoginButton;
