import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// src/store/types.ts
interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}



export const store = configureStore({
  reducer: {
    user: userReducer
  },
});

export type AppDispatch = typeof store.dispatch;


export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loginChecked: boolean;
}
  export interface RootState {
    user: UserState;
  }
  