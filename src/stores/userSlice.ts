// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string;
  platform: string;
}

const initialState: UserState = {
  socialLogin: '',
  name: '',
  number: '',
  part: '',
  email: '', 
  platform: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.socialLogin = action.payload.socialLogin;
      state.name = action.payload.name;
      state.number = action.payload.number;
      state.part = action.payload.part;
      state.email = action.payload.email;
      state.platform = action.payload.platform;
    },
    clearUser: (state) => {
      state.socialLogin = '';
      state.name = '';
      state.number = '';
      state.part = '';
      state.email = '';
      state.platform = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
