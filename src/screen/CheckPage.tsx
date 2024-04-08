// MyInfoPage.tsx
import React, { useCallback } from 'react';
import "../css/checkPage.css"; // Make sure to create a corresponding CSS file

const CheckPage: React.FC = () => {
  // This data would likely come from props or a state in a real app
  const tasks = [
    {
      time: "5월 1일 /  10:00-13:00",
      title: "파트 배정 및 오리엔테이션",
      description: "한성대학교 대강당",
      type: "main"
    },
    {
      time: "5월 11일 /  10:00-13:00",
      title: "정기 연습 1회차",
      description: "한성대학교 미래관 3층 301",
      type: "main"
    },
    {
      time: "5월 18일 /  10:00-13:00",
      title: "정기 연습 2회차",
      description: "한성대학교 공학관 지하1층 101",
      type: "main"
    },
    {
      time: "5월 25일 /  10:00-13:00",
      title: "정기 연습 3회차",
      description: "한성대학교 공학관 지하1층 101",
      type: "main"
    },
    {
      time: "5월 18일 /  10:00-13:00",
      title: "정기 연습 2회차",
      description: "한성대학교 공학관 지하1층 101",
      type: "main"
    },
    // More tasks can be added here...
  ];

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
        {tasks.map((task, index) => (
          <div className="task" key={index}>
            <h2 className="task-title">{task.title}</h2>
            <span className="task-time">{task.time}</span>
            <p className="task-description">{task.description}</p>
            <button
              className="attendance-button"
              onClick={() => handleAttendanceClick(task.title)}
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
