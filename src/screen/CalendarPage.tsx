import React, { useState, useEffect } from "react";
import "../css/calendarPage.css";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import {Calendar} from '../component/Calendar'
import  ScheduleBox  from "../component/ScheduleBox";
import { Schedule } from '../stores/type';
import {fetchSchedules} from '../common/scheduleService';
import NoticePopup from "../component/NoticePopup";

const CalendarPage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Schedule[]>([]);  //당일 일정이 담긴 목록

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
        <NoticePopup apiEndpoint={GET_SCHEDULE_API_URL} title={''}/>

      <div className="calendar-item">
        <Calendar month={0}day={0} schedules={schedules} selectedEvents={selectedEvents}  setSelectedEvents={setSelectedEvents} setSchedules={setSchedules}  />
      </div>
      <div className="calendar-item">
          <h2>전체 일정</h2>
          <ScheduleBox month={0}  day={0} schedules={schedules} setSchedules={setSchedules}  selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents}/>
      </div>
    </div>
  );
};

export default CalendarPage;
