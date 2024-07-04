import React, { useState, useEffect } from 'react';
import kakaoLoginImage from '../images/kakao_login.png';
import CONST from '../common/const';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { login, logoutUser, setLoginChecked } from '../stores/userSlice';
import { AppDispatch } from '../stores/store';

const AutoKakaoLoginCheck: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const accessToken = localStorage.getItem('kakao_token');
    const refreshToken = localStorage.getItem('kakao_refresh_token');
    if (accessToken) {
      verifyToken(accessToken, refreshToken);
    } else {
      dispatch(logoutUser());
      dispatch(setLoginChecked(true));
    }
  }, [dispatch]);

  const verifyToken = async (token: string, refreshToken: string | null) => {
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

        localStorage.setItem('kakao_res', JSON.stringify(response.data));
        localStorage.setItem('kakao_token', token);
        localStorage.setItem('last_login_platform', 'kakao');
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      if (refreshToken) {
        await refreshAccessToken(refreshToken);
      } else {
        localStorage.removeItem('kakao_token');
        dispatch(logoutUser());
        dispatch(setLoginChecked(true));
      }
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'refresh_token',
          client_id: CONST.KAKAO_REST_API_KEY,
          refresh_token: refreshToken,
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      if (response.status === 200) {
        const newAccessToken = response.data.access_token;
        localStorage.setItem('kakao_token', newAccessToken);
        verifyToken(newAccessToken, refreshToken);
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      localStorage.removeItem('kakao_token');
      localStorage.removeItem('kakao_refresh_token');
      dispatch(logoutUser());
      dispatch(setLoginChecked(true));
    }
  };

  return null;
};

const KakaoLoginButton: React.FC = () => {
  const handleKakaoLogin = async () => {
    const Rest_api_key = CONST.KAKAO_REST_API_KEY;
    const redirect_uri = CONST.KAKAO_REDIRECT_URL;

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    window.location.href = kakaoURL;
  };

  const getAccessToken = async (code: string) => {
    try {
      const response = await axios.post(
        `https://kauth.kakao.com/oauth/token`,
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: CONST.KAKAO_REST_API_KEY,
            redirect_uri: CONST.KAKAO_REDIRECT_URL,
            code: code,
          },
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('kakao_token', access_token);
        localStorage.setItem('kakao_refresh_token', refresh_token);
        localStorage.setItem('last_login_platform', 'kakao');
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
      getAccessToken(code);
    }
  }, []);

  return (
    <Box pb={2}>
      <img onClick={handleKakaoLogin} src={kakaoLoginImage} alt="Kakao Login" />
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
    const accessToken = localStorage.getItem('kakao_token');
    const LOGOUT_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/auth/logout-kakao`;

    try {
      const response = await axios.post(LOGOUT_API_URL, { access_token: accessToken });
      if (response.data.success) {
        console.log('서버 로그아웃 성공');
        localStorage.removeItem('kakao_token');
        localStorage.removeItem('kakao_refresh_token');
        localStorage.removeItem('last_login_platform');

        dispatch(logoutUser());
        handleClose();
        alert('정상적으로 로그아웃 되었습니다.');
      } else {
        console.error('로그아웃 실패:', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.reason && error.response.data.reason.code === -401) {
          console.log('토큰 만료로 인한 로그아웃 처리');
          dispatch(logoutUser());
        } else {
          console.error('서버 에러:', error.response ? error.response.data : 'No response data');
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        sx={{
          mt: '30px',
          color: '#666666',
          textDecoration: 'underline',
          fontSize: 'small',
        }}
      >
        로그아웃
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"로그아웃 하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>로그아웃을 진행하시면 현재 세션에서 로그아웃됩니다.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">아니오</Button>
          <Button onClick={handleLogout} color="primary" autoFocus>예</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { KakaoLoginButton, KakaoLogoutButton, AutoKakaoLoginCheck };
