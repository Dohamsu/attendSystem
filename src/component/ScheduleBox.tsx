import React, { useState, useRef, useEffect, MouseEvent, useCallback } from 'react';
import "../css/scheduleBox.css";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 상태 관리 경로 확인 필요
import dayjs, { Dayjs } from 'dayjs';

import IconClockPerMain from "../images/scheduleBoxCircle1.svg";
import IconClockPerSub from "../images/scheduleBoxCircle2.svg";
import IconClockPerAdd from "../images/scheduleBoxCircle3.svg";
import moreIconUrl from "../images/scheduleMoreUrl.svg";
import { Schedule, ScheduleBoxProps } from '../stores/type';
import { fetchSchedules, updateAttendance } from '../common/scheduleService';

const ScheduleBox: React.FC<ScheduleBoxProps> = ({ schedules, setSchedules, selectedEvents, setSelectedEvents, month, day }) => {
  const userInfo = useSelector((state: RootState) => state.user.user);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const checkOutsideClick = (event: MouseEvent) => {
      if (openOption && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpenOption(null);
      }
    };

    document.addEventListener('mousedown', checkOutsideClick as any);
    return () => {
      document.removeEventListener('mousedown', checkOutsideClick as any);
    };
  }, [openOption]);

  useEffect(() => {
    if (selectedEvents.length > 0) {
      let hasChanges = false;
      const newSchedules = schedules.map(schedule => {
        const foundEvent = selectedEvents.find(event => event.scheduleNumber === schedule.scheduleNumber);
        if (foundEvent && JSON.stringify(schedule) !== JSON.stringify(foundEvent)) {
          hasChanges = true;
          return { ...schedule, ...foundEvent };
        }
        return schedule;
      });

      if (hasChanges || newSchedules.length !== schedules.length) {
        setSchedules(newSchedules);
      }
    }
  }, [selectedEvents]);

  // 출석 체크 기능 간소화 및 서비스 로직 활용
  // const toggleAttendance = async (scheduleNumber: string, status: number) => {
  //   if (!userInfo?.name) return;
  //   setOpenOption(null);

  //    try {
  //     await updateAttendance(scheduleNumber, userInfo.name, status);
  //     const updatedSchedules = schedules.map(schedule => 
  //       schedule.scheduleNumber === scheduleNumber ? { ...schedule, isAttending: status } : schedule
  //     );
  //     setSchedules(updatedSchedules);

  //     const updatedSelectedEvents = selectedEvents.map(event => 
  //       event.scheduleNumber === scheduleNumber ? { ...event, isAttending: status } : event
  //     );
  //     setSelectedEvents(updatedSelectedEvents);

  //   } catch (error) {
  //     console.error('Error updating attendance:', error);
  //   }
  // };

  // const handleMoreIconClick = (scheduleNumber: string) => {
  //   setOpenOption(prev => prev === scheduleNumber ? null : scheduleNumber);
  // };
  const handleMoreIconClick = useCallback((scheduleNumber: string) => {
    setOpenOption(prev => prev === scheduleNumber ? null : scheduleNumber);
  }, []);
  
  const toggleAttendance = useCallback(async (scheduleNumber: string, status: number) => {
    if (!userInfo?.name) return;
    setOpenOption(null);
  
    try {
      await updateAttendance(scheduleNumber, userInfo.name, status);
      const updatedSchedules = schedules.map(schedule => 
        schedule.scheduleNumber === scheduleNumber ? { ...schedule, isAttending: status } : schedule
      );
      setSchedules(updatedSchedules);
  
      const updatedSelectedEvents = selectedEvents.map(event => 
        event.scheduleNumber === scheduleNumber ? { ...event, isAttending: status } : event
      );
      setSelectedEvents(updatedSelectedEvents);
  
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  }, [userInfo, schedules, setSchedules, selectedEvents, setSelectedEvents]);
  

  return (
    <div className="schedule-container">
      {schedules.map((schedule, index) => (
        <article key={index} className="task-card">
          <img src={
            schedule.type === "연습" ? IconClockPerMain :
            schedule.type === "일정" ? IconClockPerSub : IconClockPerAdd
          } alt="" className="scheduleBoxCircle" />
         <div className="time-container">
            <time className="time">{dayjs(schedule.startDate).format('YYYY-MM-DD') + " / "+ dayjs(schedule.startTime).format('HH:mm') }</time>
          </div>
          <img src={moreIconUrl} alt="more options" className="more-icon"
            onClick={() => handleMoreIconClick(schedule.scheduleNumber)} />
          {openOption === schedule.scheduleNumber && (
            <div className="options-popup" ref={popupRef}>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 1)} className="option-button">미정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 2)} className="option-button">출석</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 3)} className="option-button">불참</button>
            </div>
          )}
          <h3 className="title">{schedule.title}</h3>
          <p className="description">{schedule.description}</p>
          <div className={`attendance-status ${schedule.isAttending === 2 ? 'attending' : schedule.isAttending === 3 ? 'not-attending' : 'pending'}`}>
            {schedule.isAttending === 2 ? '출석예정' : schedule.isAttending === 3 ? '불참예정' : '미정'}
          </div>
        </article>
      ))}
    </div>
  );
};

export default ScheduleBox;
