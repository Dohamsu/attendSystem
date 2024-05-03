// MyInfoPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CheckSeatChart from '../component/CheckSeatChart'
import AttendanceList from '../component/AttendanceList'
// import "../css/attendStatusPage.css"; 
import { fetchSchedules, fetchAttendance, updateAttendance } from '../common/scheduleService';
import AttendanceScreen from '../component/AttendanceScreen';
import AttendanceResultScreen from '../component/AttendanceResultScreen';
import AttendHistory from '../component/AttendHistory';

import { Schedule, Attendance, Attendee } from '../stores/type';  // 'Attendance' 타입도 필요하면 추가
import dayjs, { Dayjs } from 'dayjs';
import { useSelector } from 'react-redux';
const AttendStatusPage: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Attendee[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);  // 상태를 Schedule 또는 null로 관리
  const [scheduleNumber, setScheduleNumber] = useState<string | null>('');  // 상태를 Schedule 또는 null로 관리
  const [dataLoaded, setDataLoaded] = useState<boolean>(false); // 데이터 로딩 완료 상태

  const currentUser = useSelector((state: any) => state.user.user); // state 구조에 따라 수정 필요

  useEffect(() => {
    const initializeData = async () => {
      const schedules = await fetchSchedules();
      const now = dayjs();

      // 당일에 일치하거나 미래의 가장 가까운 날을 찾습니다.
      const sortedSchedules = schedules
        .filter(schedule => dayjs(schedule.startDate).isSameOrAfter(now, 'day') && schedule.type === '연습')
        .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

      const todayOrNextSchedule = sortedSchedules.find(schedule => dayjs(schedule.startDate).isSame(now, 'day')) || sortedSchedules[0];
      setScheduleNumber(todayOrNextSchedule.scheduleNumber);
      console.log(todayOrNextSchedule);
      if (todayOrNextSchedule) {
        setTodaySchedule(todayOrNextSchedule);
        const fetchedAttendance = await fetchAttendance(todayOrNextSchedule.scheduleNumber);

        checkAttendanceStatus(fetchedAttendance, currentUser?.name);

        setAttendanceList(fetchedAttendance);
        setDataLoaded(true); // 데이터 로딩 완료
      }

    };

    initializeData();
  }, []);


  const checkAttendanceStatus = (attendance: Attendee[], userName: string) => {
    const userAttendance = attendance.find(a => a.name === userName);
    if (userAttendance && userAttendance.isAttending === 2) {
      setHasAttended(true);
    }
  };

  const [hasAttended, setHasAttended] = useState<boolean>(false); // 출석 상태 관리

  const handleAttend = async () => {
    if (currentUser && scheduleNumber) {
      await updateAttendance(scheduleNumber, currentUser.name, 2);
      const updatedList = attendanceList.map(attendee =>
        attendee.name === currentUser.name ? { ...attendee, isAttending: 2 } : attendee
      );
      setAttendanceList(updatedList);
      setHasAttended(true);
    }
  };

  if (!dataLoaded) { // 데이터가 로드되기 전에는 로딩 인디케이터 또는 아무것도 렌더링하지 않음
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box>
      <Typography variant="h4" sx={{ textAlign: 'center', my: 4 }}>
       {`${dayjs(todaySchedule?.startDate).format('MM월 DD일')}`}
      </Typography>
      <Typography variant="h4" sx={{ textAlign: 'center', my: 4 }}>
       {`${todaySchedule?.title}`}
      </Typography>
      {hasAttended ? (
        <AttendanceResultScreen />
      ) : (
        <AttendanceScreen todaySchedule= {todaySchedule} onAttend={handleAttend} />
      )}
      <hr></hr>
      <AttendHistory/>
    </Box>

    </>
  );
};

export default AttendStatusPage;