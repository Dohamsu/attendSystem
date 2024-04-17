import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id?: string;
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
  loginChecked: boolean;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  loginChecked: false,
  status: 'idle',
  error: null,
};
const LOGIN_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/user`;

// 비동기 로그인 처리를 위한 Thunk
export const login = createAsyncThunk(
  'user/login',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_API_URL, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { id: string, data: User }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${LOGIN_API_URL}/${userData.id}`, userData.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      console.log("로그아웃 성공");
    },
    setLoginChecked: (state, action: PayloadAction<boolean>) => {
      state.loginChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loginChecked = true;
        state.status = 'idle';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to login';
        state.status = 'failed';
        state.isLoggedIn = false;
        state.loginChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'idle';
        console.log('사용자 정보 업데이트 성공');
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update user';
        state.status = 'failed';
      });
  },
});

export const { logoutUser, setLoginChecked } = userSlice.actions;

export default userSlice.reducer;
