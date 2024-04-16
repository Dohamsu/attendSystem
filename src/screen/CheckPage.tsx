// MyInfoPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import "../css/checkPage.css"; // Make sure to create a corresponding CSS file

// 공지사항 데이터 타입 정의
interface Schedule {
  time: string;
  title: string;
  description: string;
  type: string;
}

const CheckPage: React.FC = () => {

  const [schedules, setSchedules] = useState<Schedule[]>([ ]);
  const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;

  useEffect(() => {
    const fetchschedules = async () => {
      try {
        const response = await axios.get<Schedule[]>(GET_SCHEDULE_API_URL);
        const formattedschedules = response.data.map(schedule => ({
          ...schedule,
          time: new Date(schedule.time).toLocaleDateString() // 날짜 포맷을 'yyyy-MM-dd' 형식으로 변경
        }));
        setSchedules(formattedschedules);
      } catch (error) {
        console.error('출석 일정  불러오기 실패:', error);
      }
    };

    fetchschedules();
  }, []);

    // '출석예정' 버튼 클릭 핸들러
    const handleAttendanceClick = useCallback((title: string) => {
      // 여기서 출석 예정 처리를 구현합니다.
      console.log(`${title} 출석 예정!`);
      // 예: 서버로 출석 예정 상태 업데이트 API 호출
    }, []);
  

  return (
    <div className="my-info-page">
      <header className="my-info-header">
          <h1 className="user-name">연습 일정</h1>
      </header>
      <main className="tasks-list">
        {schedules.map((schedule, index) => (
          <div className="task" key={index}>
            <h2 className="task-title">{schedule.title}</h2>
            <span className="task-time">{schedule.time}</span>
            <p className="task-description">{schedule.description}</p>
            <button
              className="attendance-button"
              onClick={() => handleAttendanceClick(schedule.title)}
            >
              출석예정
            </button>
          </div>
        ))}
      </main>
      
      <div className="floating-action-button">
        {/* Floating action button */}
        <button>+</button>
      </div>
    </div>
  );
};

export default CheckPage;
