import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import OauthPage from './screen/OauthPage';
import MyInfoPage from './screen/MyInfoPage';
import FailurePage from './screen/FailurePage';
import IntroPage from './screen/IntroPage';


import { NavBar } from "./component/NavBar";


const AppRoutes = () => {
  return (
    <>
      <NavBar/>

      <Routes>
        <Route path="/" element={<IntroPage />} /> 
        <Route path="/home" element={<MainScreen />} />
        <Route path="/auth" element={<OauthPage />} />
        <Route path="/myinfo" element={<MyInfoPage />} />
        <Route path="/failure" element={<FailurePage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
