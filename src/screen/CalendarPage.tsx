import React, { useState, useEffect } from "react";
import "../css/calendarPage.css";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { Calendar } from '../component/Calendar';
import ScheduleBox from "../component/ScheduleBox";
import { Schedule } from '../stores/type';
import { fetchSchedules } from '../common/scheduleService';
import NoticePopup from "../component/NoticePopup";
import { Box, Button } from '@mui/material';

const CalendarPage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Schedule[]>([]);  //당일 일정이 담긴 목록
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false); // 이전 일정 표시 여부

  const userInfo = useSelector((state: RootState) => state.user.user);
  const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;

  useEffect(() => {
    if (userInfo?.name) {
      fetchSchedules(userInfo.name)
        .then(setSchedules)
        .catch((error: any) => console.error('Failed to fetch schedules:', error));
    }
  }, [userInfo?.name]);

  return (
    <div className="calendar-container">
      <NoticePopup apiEndpoint={GET_SCHEDULE_API_URL} title={''} />
      <div className="calendar-item">
        <Calendar month={0} day={0} schedules={schedules} selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} setSchedules={setSchedules} oneDayList={true} />
      </div>
      <div className="calendar-item">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
          <h2>일정</h2>
          <Button
            onClick={() => setShowPastEvents((prev) => !prev)}
            sx={{marginRight:'10px'}}
          >
            {showPastEvents ? "미래 일정만 보기" : "전체 일정 보기"}
          </Button>
        </Box>
        <ScheduleBox
          month={0}
          day={0}
          oneDayList={false}
          schedules={schedules}
          setSchedules={setSchedules}
          selectedEvents={[]}
          setSelectedEvents={setSelectedEvents}
          showPastEvents={showPastEvents} // showPastEvents 상태 전달
        />
      </div>
    </div>
  );
};

export default CalendarPage;
