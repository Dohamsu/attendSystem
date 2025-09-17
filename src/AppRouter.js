import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './component/RequireAuth';
import { NavBar } from './component/NavBar';
import { CircularProgress, Box } from '@mui/material';

// 코드 스플리팅으로 성능 최적화
const IntroPage = React.lazy(() => import('./screen/IntroPage'));
const LoginPage = React.lazy(() => import('./screen/LoginPage'));
const CalendarPage = React.lazy(() => import('./screen/CalendarPage'));
const CheckPage = React.lazy(() => import('./screen/CheckPage'));
const AttendPage = React.lazy(() => import('./screen/AttendStatusPage'));
const MyInfoPage = React.lazy(() => import('./screen/MyInfoPage'));
const NoticePage = React.lazy(() => import('./screen/NoticePage'));
const ChatPage = React.lazy(() => import('./screen/ChatPage'));
const KakaoCallback = React.lazy(() => import('./screen/KaKaoCallBackPage'));

// 로딩 컴포넌트
const LoadingSpinner: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
    <CircularProgress />
  </Box>
);

const AppRoutes: React.FC = () => {
  return (
    <>
      <NavBar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/check" element={<CheckPage />} />
            <Route path="/attend" element={<AttendPage />} />
            <Route path="/myinfo" element={<MyInfoPage />} />
            <Route path="/notice" element={<ChatPage />} />
            <Route path="/kakaoCallback" element={<KakaoCallback />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
