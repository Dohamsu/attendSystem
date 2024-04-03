import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import OauthPage from './screen/OauthPage';
import SuccessPage from './screen/SuccessPage';
import FailurePage from './screen/FailurePage';
import IntroPage from './screen/IntroPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} /> 
      <Route path="/home" element={<MainScreen />} />
      <Route path="/auth" element={<OauthPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/failure" element={<FailurePage />} />
    </Routes>
  );
};

export default AppRoutes;
