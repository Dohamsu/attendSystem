// AttendStatusPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CheckSeatChart from "../component/CheckSeatChart";
import AttendanceList from "../component/AttendanceList";
import "../css/checkPage.css";
import { fetchSchedules, fetchAttendance, updateAttendance } from "../common/scheduleService";
import { Schedule, Attendee } from "../stores/type";
import dayjs from "dayjs";

const AttendStatusPage: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Attendee[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const fetchedSchedules = await fetchSchedules();
      const now = dayjs();

      // 당일에 일치하거나 미래의 가장 가까운 날을 찾습니다.
      const sortedSchedules = fetchedSchedules
        .filter(schedule => dayjs(schedule.startDate).isSameOrAfter(now, 'day') && schedule.type.includes('연습'))
        .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

      setSchedules(sortedSchedules);

      let todayOrNextIndex = sortedSchedules.findIndex(schedule => dayjs(schedule.startDate).isSame(now, 'day'));
      if (todayOrNextIndex === -1) {
        todayOrNextIndex = 0;
      }     
      setCurrentScheduleIndex(todayOrNextIndex);
      if (sortedSchedules[todayOrNextIndex]) {
        const fetchedAttendance = await fetchAttendance(sortedSchedules[todayOrNextIndex].scheduleNumber);
        setAttendanceList(fetchedAttendance);
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchCurrentAttendance = async () => {
      if (schedules[currentScheduleIndex]) {
        setLoading(true);
        const fetchedAttendance = await fetchAttendance(schedules[currentScheduleIndex].scheduleNumber);
        setAttendanceList(fetchedAttendance);
        setLoading(false);
      }
    };

    fetchCurrentAttendance();
  }, [currentScheduleIndex, schedules]);

  const updateAttendance2 = async (attendeeIndex: number, status: number) => {
    const attendeeToUpdate = attendanceList[attendeeIndex];
    if (attendeeToUpdate && schedules[currentScheduleIndex]?.scheduleNumber) {
      await updateAttendance(schedules[currentScheduleIndex].scheduleNumber, attendeeToUpdate.name, status);
      const updatedList = attendanceList.map((attendee, idx) =>
        idx === attendeeIndex ? { ...attendee, isAttending: status } : attendee
      );
      setAttendanceList(updatedList);
    }
  };

  const handlePreviousSchedule = () => {
    if (currentScheduleIndex > 0) {
      setCurrentScheduleIndex(currentScheduleIndex - 1);
    }
  };

  const handleNextSchedule = () => {
    if (currentScheduleIndex < schedules.length - 1) {
      setCurrentScheduleIndex(currentScheduleIndex + 1);
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
          {schedules.length > 0 && schedules[currentScheduleIndex] ? (
            <>
              <div className="calendar-container" ref={containerRef}>
                <div className="calendar-item">
                  <CheckSeatChart 
                    todaySchedule={schedules[currentScheduleIndex]} 
                    attendanceList={attendanceList} 
                    onPreviousSchedule={handlePreviousSchedule}
                    onNextSchedule={handleNextSchedule}
                    disablePrevious={currentScheduleIndex <= 0}
                    disableNext={currentScheduleIndex >= schedules.length - 1}
                  />
                </div>
                <div className="calendar-item">
                  <AttendanceList attendanceList={attendanceList} updateAttendance={updateAttendance2} />
                </div>
              </div>
            </>
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
