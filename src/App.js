import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux'; // Redux Provider 임포트
import theme from './css/theme'; // 테마 파일 임포트
import store from './stores/store'; // Redux 스토어 임포트

import AppRoutes from './AppRouter';
function App() {
  return (
    <Provider store={store}> {/* Redux 스토어 제공 */}
      <ThemeProvider theme={theme}>
        <Router>
          <AppRoutes/>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
