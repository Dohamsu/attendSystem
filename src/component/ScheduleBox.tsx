import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/scheduleBox.css";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 상태 관리 경로 확인 필요

import IconClockPerMain from "../images/scheduleBoxCircle1.svg";
import IconClockPerSub from "../images/scheduleBoxCircle2.svg";
import IconClockPerAdd from "../images/scheduleBoxCircle3.svg";
import moreIconUrl from "../images/scheduleMoreUrl.svg";

interface Schedule {
  scheduleNumber: string;
  time: string;
  title: string;
  description: string;
  type: string;
  isAttending: boolean;
}

const ScheduleBox: React.FC<{ month: number }> = ({ month }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;
  const ATTEND_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/attend`;

  useEffect(() => {
    if (userInfo?.name) {
      axios.get<Schedule[]>(`${GET_SCHEDULE_API_URL}?userName=${userInfo.name}`)
        .then(response => {
          setSchedules(response.data.map(schedule => ({
            ...schedule,
            time: new Date(schedule.time).toLocaleString('ko-KR')
          })));
        })
        .catch(error => console.error('일정 불러오기 실패:', error));
    }
  }, [userInfo?.name]);

  // 출석 체크 기능
  const toggleAttendance = async (scheduleNumber: string) => {
    const scheduleToUpdate = schedules.find(schedule => schedule.scheduleNumber === scheduleNumber);
    if (!scheduleToUpdate || !userInfo?.name) return;

    const updatedIsAttending = !scheduleToUpdate.isAttending;

    axios.post(`${ATTEND_SCHEDULE_API_URL}`, {
      scheduleNumber,
      name: userInfo.name,
      isAttending: updatedIsAttending
    })
    .then(response => {
      if (response.data.success) {
        setSchedules(prevSchedules => prevSchedules.map(schedule => 
          schedule.scheduleNumber === scheduleNumber ? { ...schedule, isAttending: updatedIsAttending } : schedule
        ));
      } else {
        console.error('출석 마크 실패:', response.data.message);
      }
    })
    .catch(error => console.error('출석 마크 중 오류 발생:', error));
  };

  const handleMoreIconClick = (scheduleNumber: string) => {
    setOpenOption(prev => prev === scheduleNumber ? null : scheduleNumber);
  };

  return (
    <div className="schedule-container">
      {schedules.map((schedule, index) => (
        <article key={index} className="task-card">
          <img src={
            schedule.type === "main" ? IconClockPerMain :
            schedule.type === "sub" ? IconClockPerSub : IconClockPerAdd
          } alt="" className="scheduleBoxCircle" />
          <div className="time-container">
            <img src="clock-icon-url" alt="" className="clock-icon" />
            <time className="time">{schedule.time}</time>
          </div>
        <img src={moreIconUrl} alt="more options" className="more-icon"
            onClick={() => handleMoreIconClick(schedule.scheduleNumber)} />
          {openOption === schedule.scheduleNumber && (
            <div className="options-popup">
              <button onClick={() => toggleAttendance(schedule.scheduleNumber)} className="option-button">출석예정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber)} className="option-button">불참예정</button>
            </div>
          )}
          <h3 className="title">{schedule.title}</h3>
          <p className="description">{schedule.description}</p>
          <div className={`attendance-status ${schedule.isAttending ? 'attending' : 'pending'}`}>
            {schedule.isAttending ? '출석예정' : '미정'}
          </div>
        </article>
      ))}
    </div>
  );
};

export default ScheduleBox;
