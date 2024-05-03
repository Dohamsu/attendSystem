// AuthComponents.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logoutUser, setLoginChecked } from '../stores/userSlice';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, logoutGoogle } from './authService';
import googleLoginButton from '../images/google_login.png';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import

// AutoLoginCheck 컴포넌트
const AutoLoginCheck: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // 여기에 AppDispatch 타입을 사용

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(login({
          name: firebaseUser.displayName || '익명',
          email: firebaseUser.email || '',
          number: '미정',
          nickName: '닉네임',
          part: '미정',
          platform: 'google',
          socialLogin: 'google',
          isAdmin: false
        }));
        console.log('자동 로그인 성공:', firebaseUser.displayName);
        localStorage.setItem('last_login_platform', 'google');
      } else {
        dispatch(logoutUser());
        console.log('사용자가 로그인하지 않았습니다.');
      }
      dispatch(setLoginChecked(true));

    });
  }, [dispatch]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

// GoogleLoginButton 컴포넌트
const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle(dispatch);
      localStorage.setItem('last_login_platform', 'google');
      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Box>
      <img width={200} src={googleLoginButton} onClick={handleSignIn} alt='구글로그인 버튼' style={{ cursor: 'pointer' }} />
    </Box>
  );
};

const GoogleLogoutButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); // 여기에 AppDispatch 타입을 사용

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle(dispatch);
      dispatch(logoutUser());
      console.log('로그아웃 성공');
      handleClose(); // 로그아웃 성공 후 대화 상자 닫기
    } catch (error) {
      console.error('로그아웃 실패:', error);
      handleClose(); // 에러 발생 시 대화 상자 닫기
    }
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        sx={{
          mt: '30px', // margin-top: 30px
          color: '#666666',
          textDecoration: 'underline',
          fontSize: 'small'
        }}
      >
        로그아웃
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"로그아웃 하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            로그아웃을 진행하시면 현재 세션에서 로그아웃됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            아니오
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


export { AutoLoginCheck, GoogleLoginButton, GoogleLogoutButton};
