import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// 스토어의 상태 타입 정의
export type RootState = ReturnType<typeof store.getState>;

// 스토어의 디스패치 타입 정의
export type AppDispatch = typeof store.dispatch;

export default store;
