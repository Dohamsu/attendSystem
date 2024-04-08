import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import CheckPage from './screen/CheckPage';
import MyInfoPage from './screen/MyInfoPage';
import NoticePage from './screen/NoticePage';
import IntroPage from './screen/IntroPage';


import { NavBar } from "./component/NavBar";


const AppRoutes = () => {
  return (
    <>
      <NavBar/>

      <Routes>
        <Route path="/" element={<IntroPage />} /> 
        <Route path="/home" element={<MainScreen />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/myinfo" element={<MyInfoPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
