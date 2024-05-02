// kakaoLogin.tsx
import React, { useState, useEffect } from 'react';
import kakaoLoginImage from '../images/kakao_login.png';
import CONST from '../common/const';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { login, logoutUser, setLoginChecked } from '../stores/userSlice';
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import

const AutoKakaoLoginCheck: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // 여기에 AppDispatch 타입을 사용

  useEffect(() => {
    const accessToken = localStorage.getItem('kakao_token');
    if (accessToken) {
      verifyToken(accessToken);
    } else {
      dispatch(logoutUser());
      dispatch(setLoginChecked(true));
    }
  }, [dispatch]);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      if (response.status === 200) {
        const user = {
          name: response.data.properties.nickname,
          email: response.data.kakao_account.email,
          platform: 'kakao',
          nickName: response.data.properties.nickname,
          socialLogin: 'kakao',
          number: '미정',
          isAdmin: false,
          part: '미정',
        };
        dispatch(login(user));

        console.log(response);
        localStorage.setItem('kakao_res', response.data);
        localStorage.setItem('kakao_token', response.data.access_token);
        localStorage.setItem('last_login_platform', 'kakao');

        console.log('카카오 자동로그인 성공');
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('kakao_token');
      dispatch(logoutUser());
    }
    dispatch(setLoginChecked(true));
  };

  return null;
};

const KakaoLoginButton: React.FC = () => { // 함수 컴포넌트에 대한 타입 정의
  const handleKakaoLogin = async () => {
    console.log("클릭됨 ");
    const Rest_api_key= CONST.KAKAO_REST_API_KEY; //REST API KEY
    const redirect_uri = CONST.KAKAO_REDIRECT_URL //Redirect URI
    console.log(redirect_uri);
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

const KakaoLogoutButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('kakao_token'); // 저장된 토큰을 사용
    const LOGOUT_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/logout-kakao`;

    try {
      // 서버에 로그아웃 요청을 보냄
      const response = await axios.post(LOGOUT_API_URL, { access_token: accessToken });
      if (response.data.success) {
        console.log('서버 로그아웃 성공');
        localStorage.setItem('kakao_token', ''); // 토큰 초기화
        localStorage.setItem('last_login_platform', '');

        dispatch(logoutUser());        
        handleClose();
        alert('정상적으로 로그아웃 되었습니다.');
      } else {
        console.error('로그아웃 실패:', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError 타입인 경우
        if (error.response && error.response.data && error.response.data.reason && error.response.data.reason.code === -401) {
          // 에러 코드가 "-401"일 때 로그아웃 처리
          console.log('토큰 만료로 인한 로그아웃 처리');
          dispatch(logoutUser());
        } else {
          // 다른 에러 메시지를 콘솔에 출력
          console.error('서버 에러:', error.response ? error.response.data : 'No response data');
        }
      } else {
        // Axios 에러가 아닌 다른 종류의 에러 처리
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        로그아웃
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"로그아웃 하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            로그아웃을 진행하시면 현재 세션에서 로그아웃됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">아니오</Button>
          <Button onClick={handleLogout} color="primary" autoFocus>예</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export {KakaoLoginButton, KakaoLogoutButton, AutoKakaoLoginCheck};
