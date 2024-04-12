// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 통합된 상태 타입 정의
interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loginChecked: boolean; //로그인 처리 중 상태
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  loginChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 로그인 액션: 사용자 정보를 상태에 설정하고, 로그인 상태를 true로 변경
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true; 
      console.log("로그인 성공");
    },
    // 로그아웃 액션: 사용자 정보를 초기화하고, 로그인 상태를 false로 변경
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false; 
      console.log("로그아웃 성공");
    },
    // 사용자 정보 업데이트 액션: 사용자 정보를 업데이트
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = { ...state.user, ...action.payload };
    },
    setLoginChecked(state, action: PayloadAction<boolean>) {
      state.loginChecked = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateUser, setLoginChecked } = userSlice.actions;

export default userSlice.reducer;
