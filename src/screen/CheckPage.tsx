// MyInfoPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 적절한 RootState 경로를 사용해주세요.

// import "../css/checkPage.css"; // Make sure to create a corresponding CSS file

// 공지사항 데이터 타입 정의
interface Schedule {
  time: string;
  scheduleNumber: string;
  isAttending: boolean;
  title: string;
  description: string;
  type: string;
}

const CheckPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;
  const ATTEND_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/attend`;

  const userInfo = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get<Schedule[]>(`${GET_SCHEDULE_API_URL}?userName=${userInfo?.name}`);
        const formattedSchedules = response.data.map(schedule => ({
          ...schedule,
          time: new Date(schedule.time).toLocaleDateString()
        }));
        setSchedules(formattedSchedules);
         console.log(formattedSchedules);
      } catch (error) {
        console.error('출석 일정 불러오기 실패:', error);
      }
    };

    if (userInfo?.name) {
      fetchSchedules();
    }
  }, [userInfo?.name]);

  const handleAttendanceClick = useCallback(async (scheduleNumber: string) => {
    if (!userInfo?.name) {
      console.error('사용자 정보가 충분하지 않습니다.');
      return;
    }

     // 해당 스케줄의 출석 상태를 찾아서 토글
    const scheduleToUpdate = schedules.find(schedule => schedule.scheduleNumber === scheduleNumber);
    if (!scheduleToUpdate) return;

    const updatedIsAttending = !scheduleToUpdate.isAttending; // 출석 상태 토글

    const requestBody = {
      scheduleNumber,
      name: userInfo.name,
      isAttending: updatedIsAttending // 토글된 출석 상태를 서버에 보낼 요청 본문에 포함
    };

    try {
      const response = await axios.post(ATTEND_SCHEDULE_API_URL, requestBody);
      if (response.data.success) {
        alert(updatedIsAttending ? "출석 확정 처리되었습니다." : "출석 예정으로 변경되었습니다.");
        // 출석 상태 업데이트
        const updatedSchedules = schedules.map(schedule => {
          if (schedule.scheduleNumber === scheduleNumber) {
            return { ...schedule, isAttending: updatedIsAttending }; // 출석 확정으로 상태 변경
          }
          return schedule;
        });
        setSchedules(updatedSchedules);
      } else {
        console.error('출석 마크 실패:', response.data.message);
      }
    } catch (error) {
      console.error('출석 마크 중 오류 발생:', error);
    }
  }, [userInfo?.name, schedules]);

 // 참석 상태에 따른 클래스 이름을 반환하는 함수
  const getAttendanceClass = (status: boolean) => {
    switch(status) {
      case true: return 'attending';
      case false: return 'pending';
      // case '불참': return 'not-attending';
      default: return '';
    }
  };

  return (
    <div className="scroll-page">
    <div className="my-info-page">
      <header className="my-info-header">
        <h1 className="user-name">연습 일정</h1>
      </header>
      <main className="schedules-list">
        {schedules.map((schedule, index) => (
          <div className="schedule" key={index} data-schedule-number={schedule.scheduleNumber}>
            <h2 className="schedule-title">{schedule.title}</h2>
            <span className="schedule-time">{schedule.time}</span>
            <p className="schedule-description">{schedule.description}</p>
            <div className={`attendance-status ${getAttendanceClass(schedule.isAttending)}`}>
              {schedule.isAttending === true ? '출석예정' : '미정'}
            </div>
            <button
              className="attendance-button"
              onClick={() => handleAttendanceClick(schedule.scheduleNumber)}
            >
              {schedule.isAttending === true ? '출석 확정' : '출석예정'}
            </button>
          </div>
        ))}
      </main>
      
      <div className="floating-action-button">
        <button>+</button>
      </div>
    </div>
    {/* 페이지 내용 */}
  </div>
  );
};

export default CheckPage;
