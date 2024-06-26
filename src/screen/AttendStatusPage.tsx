// MyInfoPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckSeatChart from '../component/CheckSeatChart'
import AttendanceList from '../component/AttendanceList'
import "../css/checkPage.css"; 
import { fetchSchedules, fetchAttendance, updateAttendance } from '../common/scheduleService';
import { Schedule, Attendance, Attendee } from '../stores/type';  // 'Attendance' 타입도 필요하면 추가
import dayjs from 'dayjs';

const AttendStatusPage: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Attendee[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);  // 상태를 Schedule 또는 null로 관리
  const [scheduleNumber, setScheduleNumber] = useState<string | null>(null);  // 상태를 Schedule 또는 null로 관리
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const schedules = await fetchSchedules();
      const now = dayjs();

      // 당일에 일치하거나 미래의 가장 가까운 날을 찾습니다.
      const sortedSchedules = schedules
        .filter(schedule => dayjs(schedule.startDate).isSameOrAfter(now, 'day') && schedule.type === '연습')
        .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

      const todayOrNextSchedule = sortedSchedules.find(schedule => dayjs(schedule.startDate).isSame(now, 'day')) || sortedSchedules[0];
      setScheduleNumber(todayOrNextSchedule?.scheduleNumber || null);
      
      if (todayOrNextSchedule) {
        setTodaySchedule(todayOrNextSchedule);
        const fetchedAttendance = await fetchAttendance(todayOrNextSchedule.scheduleNumber);
        setAttendanceList(fetchedAttendance);
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const updateAttendance2 = async (attendeeIndex: number, status: number) => {
    const attendeeToUpdate = attendanceList[attendeeIndex];
    if (attendeeToUpdate && scheduleNumber) {
      await updateAttendance(scheduleNumber, attendeeToUpdate.name, status);
      const updatedList = attendanceList.map((attendee, idx) =>
        idx === attendeeIndex ? { ...attendee, isAttending: status } : attendee
      );
      setAttendanceList(updatedList);
    }
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {todaySchedule ? (
            <div className="calendar-container">
              <div className="calendar-item">
                <CheckSeatChart todaySchedule={todaySchedule} attendanceList={attendanceList} />
              </div>
              <div className="calendar-item">
                <AttendanceList attendanceList={attendanceList} updateAttendance={updateAttendance2} />
              </div>
            </div>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4, mt: 45 }}>
              <Typography variant="h4">예정된 일정이 없습니다.</Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default AttendStatusPage;
