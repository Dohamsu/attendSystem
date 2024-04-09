import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 사용자 상태 타입 정의
interface User {
  name: string;
  email: string;
  platform: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean; // 로그인 상태를 나타내는 속성 추가
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false, // 초기 로그인 상태는 false로 설정
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true; // 사용자가 로그인했음을 나타냄
      console.log("로그인 성공");
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false; // 사용자가 로그아웃했음을 나타냄
    },
  },
});


export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
