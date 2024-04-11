import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import LoginPage from './screen/LoginPage';
import CheckPage from './screen/CheckPage';
import MyInfoPage from './screen/MyInfoPage';
import NoticePage from './screen/NoticePage';
import CalendarPage from './screen/CalendarPage';
import IntroPage from './screen/IntroPage';


import { NavBar } from "./component/NavBar";


const AppRoutes = () => {
  return (
    <>
      <NavBar/>

      <Routes>
        <Route path="/" element={<IntroPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/myinfo" element={<MyInfoPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
