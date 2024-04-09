import React, { useEffect } from 'react';
import { signInWithGoogle } from './authService';
import googleLoginButton from '../images/google_login.png';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../stores/userSlice'; // setUser, clearUser 액션 임포트
import { Box } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// User 인터페이스는 userSlice에 정의된 UserState와 동일한 구조를 사용합니다.
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
          email: firebaseUser.email || '익명',
          number: '익명',
          part: '익명',
          platform: 'google',
          socialLogin: 'Google', // socialLogin 필드 추가
        };
        dispatch(setUser(user)); // setUser 액션으로 변경
        console.log('자동 로그인 성공:', user);
      } else {
        // 사용자가 로그아웃한 상태 혹은 로그인하지 않은 상태
        console.log('사용자가 로그인하지 않았습니다.');
        dispatch(clearUser()); // clearUser 액션을 사용하여 사용자 정보 초기화
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
