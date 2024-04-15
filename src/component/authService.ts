// authService.ts
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithCustomToken } from 'firebase/auth';
import  app  from '../firebase/firebaseConfig'; // Firebase 앱 초기화 모듈
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser, setLoginChecked } from '../stores/userSlice';

const auth = getAuth(app);

const signInWithGoogle = async (dispatch: any) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
    dispatch(loginUser({
      name: result.user.displayName || '익명',
      email: result.user.email || '',
      number: '익명', // 실제 어플리케이션에 맞게 조정 필요
      part: '익명', // 실제 어플리케이션에 맞게 조정 필요
      platform: 'google',
      socialLogin: 'google',
    }));
    console.log('로그인 성공:', result.user.displayName);

    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logoutGoogle = async () => {
  await signOut(auth);
};

export { signInWithGoogle, logoutGoogle };
