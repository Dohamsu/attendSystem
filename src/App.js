import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './css/theme'; // 테마 파일 임포트
import AppRoutes from './AppRouter';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes/>
      </Router>
    </ThemeProvider>
  );
}

export default App;
