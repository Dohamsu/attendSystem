import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './component/RequireAuth'; // RequireAuth 컴포넌트 경로
import { NavBar } from './component/NavBar';
import IntroPage from './screen/IntroPage';
import LoginPage from './screen/LoginPage';
import CalendarPage from './screen/CalendarPage';
import CheckPage from './screen/CheckPage';
import AttendPage from './screen/AttendStatusPage';
import MyInfoPage from './screen/MyInfoPage';
import NoticePage from './screen/NoticePage';
import KakaoCallback from './screen/KaKaoCallBackPage';

const AppRoutes = () => {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/attend" element={<AttendPage />} />
          <Route path="/myinfo" element={<MyInfoPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/kakaoCallback" element={<KakaoCallback />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
