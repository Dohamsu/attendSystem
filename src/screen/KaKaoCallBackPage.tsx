import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../stores/userSlice'; // AsyncThunk import
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import

const KakaoCallBackpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // 여기에 AppDispatch 타입을 사용

  useEffect(() => {
    const handleKakaoAuth = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const KAKAO_LOGIN_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/verify-kakao-token`;

      if (code) {
        try {
          const response = await axios.post(KAKAO_LOGIN_API_URL, { code });
          if (response.data.success) {
            const user = {
              name: response.data.data.properties.nickname || '익명',
              email: response.data.data.kakao_account.email || '',
              number: '미정',
              nickName: '닉네임',
              part: '미정',
              platform: 'kakao',
              socialLogin: 'kakao'
            };

            dispatch(login(user)); // login()을 호출하여 그 결과를 dispatch
            localStorage.setItem('kakao_token', response.data.data.access_token);
            localStorage.setItem('last_login_platform', 'kakao');
    

          } else {
            alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        } catch (error) {
          console.error('인증 과정 중 에러 발생:', error);
          alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    };

    handleKakaoAuth();
  }, [navigate, dispatch]); // useEffect 의존성 배열에 navigate와 dispatch 추가

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallBackpage;
