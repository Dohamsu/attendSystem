import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import app from '../firebase/firebaseConfig'; // Firebase 앱 초기화 모듈
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import
import { login, logoutUser } from '../stores/userSlice';

const auth = getAuth(app);

// signInWithGoogle 함수의 타입에 AppDispatch를 명시
const signInWithGoogle = async (dispatch: AppDispatch) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // 로그인 성공: 사용자 정보를 사용해 login 액션 디스패치
    if (result.user) {
      const user = {
        name: result.user.displayName || '익명',
        nickName: result.user.displayName || '닉네임',
        email: result.user.email || '',
        number: '미정',
        part: '미정',
        platform: 'google',
        isAdmin: false,
        socialLogin: 'google',
      };

      dispatch(login(user)); // login 액션에 user 데이터 전달
      console.log('로그인 성공:', result.user.displayName);
    }

    return result.user;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

const logoutGoogle = async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logoutUser()); // 로그아웃 액션 디스패치
    console.log('로그아웃 성공');
    alert('정상적으로 로그아웃 되었습니다.');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

export { signInWithGoogle, logoutGoogle };
