import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux'; // Redux Provider 임포트
import theme from './css/theme'; // 테마 파일 임포트
import store from './stores/store'; // Redux 스토어 임포트

import AppRoutes from './AppRouter';
// function App() {
//   return (
//     <Provider store={store}> {/* Redux 스토어 제공 */}
//       <ThemeProvider theme={theme}>
//         <Router>
//           <AppRoutes/>
//         </Router>
//       </ThemeProvider>
//     </Provider>
//   );
// }

const App: React.FC = () => {
  useEffect(() => {
      const handleTouchStart = (event: TouchEvent) => {
          // 터치 시작 지점의 X 좌표를 저장
          const startX = event.touches[0].pageX;

          const handleTouchMove = (event: TouchEvent) => {
              // 터치 이동 시 X 좌표 계산
              const moveX = event.touches[0].pageX;
              // 이동 거리가 일정 값 이상이면 스크롤이라고 간주하여 기본 동작을 막음
              if (Math.abs(moveX - startX) > 10) {
                  event.preventDefault();
              }
          };

          document.addEventListener('touchmove', handleTouchMove, { passive: false });

          const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
          };

          document.addEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchstart', handleTouchStart);

      return () => {
          document.removeEventListener('touchstart', handleTouchStart);
      };
  }, []);

  return (
      <div className="App">
          <Provider store={store}> {/* Redux 스토어 제공 */}
            <ThemeProvider theme={theme}>
              <Router>
                <AppRoutes/>
              </Router>
            </ThemeProvider>
          </Provider>
      </div>
  );
};

export default App;