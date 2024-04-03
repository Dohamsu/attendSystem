// authService.ts
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';
import  app  from '../firebase/firebaseConfig'; // Firebase 앱 초기화 모듈

// Firebase Auth 인스턴스를 가져옵니다.
const auth = getAuth(app);

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

export { signInWithCustomToken, signInWithGoogle };