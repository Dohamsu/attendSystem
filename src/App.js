import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import theme from './css/theme';
import store from './stores/store';
import ErrorBoundary from './component/ErrorBoundary';

import AppRoutes from './AppRouter';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <AppRoutes/>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
