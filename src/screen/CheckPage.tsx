// MyInfoPage.tsx
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CheckSeatChart from '../component/CheckSeatChart'
import AttendanceList from '../component/AttendanceList'
import "../css/checkPage.css"; 
import { fetchSchedules, fetchAttendance } from '../common/scheduleService';
import { Schedule, Attendance, Attendee } from '../stores/type';  // 'Attendance' 타입도 필요하면 추가
import dayjs, { Dayjs } from 'dayjs';
const CheckPage: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Attendee[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);  // 상태를 Schedule 또는 null로 관리

  useEffect(() => {
    const initializeData = async () => {
      const schedules = await fetchSchedules();
      const now = dayjs();

      // 당일에 일치하거나 미래의 가장 가까운 날을 찾습니다.
      const sortedSchedules = schedules
        .filter(schedule => dayjs(schedule.startDate).isSameOrAfter(now, 'day') && schedule.type === '연습')
        .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

      const todayOrNextSchedule = sortedSchedules.find(schedule => dayjs(schedule.startDate).isSame(now, 'day')) || sortedSchedules[0];

      console.log(todayOrNextSchedule);
      if (todayOrNextSchedule) {
        setTodaySchedule(todayOrNextSchedule);
        const fetchedAttendance = await fetchAttendance(todayOrNextSchedule.scheduleNumber);
        // console.log(fetchedAttendance);
        setAttendanceList(fetchedAttendance);
      }
    };

    initializeData();
  }, []);

  return (
    <>
      <CheckSeatChart todaySchedule={todaySchedule} attendanceList={attendanceList} />
      <AttendanceList attendanceList={attendanceList}/>

    </>
  );
};

export default CheckPage;