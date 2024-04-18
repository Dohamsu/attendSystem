import React from "react";
import "../css/calendarPage.css";
import Calendar from '../component/Calendar'
import  ScheduleBox  from "../component/ScheduleBox";
import { Box } from "@mui/material";

const CalendarPage = () => {
  // 예시 데이터 - 실제 데이터는 상태 관리 또는 props로 전달받아야 합니다.
  const exampleEvents = [
    { time: "4월 2일 오후 3시", title: "정기연습 1회", description: "한성대학교 미래관 3층 305호", type: "main" },
    { time: "4월 2일 오후 5시", title: "중주 팀 편성", description: "한성대학교 대강당", type: "add" },
  ];

  return (
    <div className="calendar-container">
      {/* Each Calendar is now a scroll-snap item */}
      <div className="calendar-item">
        <Calendar />
      </div>
      <div className="calendar-item">
        <Box mt={3}>
          <ScheduleBox month={1} />
        </Box>
      </div>
    </div>
  );
};

export default CalendarPage;
