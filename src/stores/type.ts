import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import dayjs, { Dayjs } from 'dayjs';

interface User {
  _id?: string;
  socialLogin: string;
  name: string;
  nickName: string;
  number: string;
  part: string;
  email: string;
  platform: string;
}

export interface Attendee  {
  name: string;      
  nickName: string;      
  part: string;      
  isAttending: number;
};

export interface Attendance  {
  scheduleNumber: string; // 스케줄 식별 번호
  attendees: Attendee[];  // 참석자 목록
};

export interface Schedule {
  color?: string;
  scheduleNumber: string;
  place: string;
  title: string;
  description: string;
  startDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  type: string;
  isAttending: number;
}

export interface ScheduleBoxProps {
  selectedEvents: Schedule[];
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setSelectedEvents: React.Dispatch<React.SetStateAction<Schedule[]>>;
  month: number;
  day: number;
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
  