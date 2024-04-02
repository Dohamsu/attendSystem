// authService.ts
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';
import { getKakaoAccessToken, verifyKakaoToken } from '../firebase/kakaoAuth'; // 카카오 인증 관련 함수
import  app  from '../firebase/firebaseConfig'; // Firebase 앱 초기화 모듈

// Firebase Auth 인스턴스를 가져옵니다.
const auth = getAuth(app);

const loginWithKakao = async () => {
  try {
    // 카카오 액세스 토큰을 가져옵니다.
    const kakaoAccessToken = await getKakaoAccessToken();
    // 카카오 토큰을 검증하고 Firebase 커스텀 토큰을 가져옵니다.
    const firebaseCustomToken = await verifyKakaoToken(kakaoAccessToken);
    // Firebase 커스텀 토큰으로 로그인합니다.
    const userCredential = await signInWithCustomToken(auth, firebaseCustomToken);
    console.log('카카오 로그인 성공:', userCredential.user);
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
  }
};

// Google 로그인 함수
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // 로그인 성공: 사용자 정보 처리
    console.log(result.user);
    return result.user;
  } catch (error) {
    // 로그인 오류 처리
    console.error(error);
    throw error;
  }
};

export { loginWithKakao, signInWithCustomToken, signInWithGoogle };