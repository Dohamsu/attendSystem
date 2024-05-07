import React, { useState, useRef, useEffect, MouseEvent, useCallback } from 'react';
import "../css/scheduleBox.css";
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 상태 관리 경로 확인 필요
import dayjs, { Dayjs } from 'dayjs';
import ScheduleRegiPopup from './ScheduleRegiPopup';

import IconClockPerMain from "../images/scheduleBoxCircle1.svg";
import IconClockPerSub from "../images/scheduleBoxCircle2.svg";
import IconClockPerAdd from "../images/scheduleBoxCircle3.svg";
import moreIconUrl from "../images/scheduleMoreUrl.svg";
import { Schedule, ScheduleBoxProps } from '../stores/type';
import { fetchSchedules, updateAttendance } from '../common/scheduleService';

const ScheduleBox: React.FC<ScheduleBoxProps> = ({ schedules, setSchedules, selectedEvents, setSelectedEvents, month, day }) => {
  const userInfo = useSelector((state: RootState) => state.user.user);
  const [editScheduleData, setEditScheduleData] = useState<Schedule | null>(null);

  const [openOption, setOpenOption] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  interface EventData {
    title?: string;
    place?: string;
    description?: string;
    type?: string;
    startDate?: Dayjs;
    startTime?: Dayjs;
    endTime?: Dayjs;
    scheduleNumber?: string;
  }

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
  
// 타입 변환 함수 예시
function convertScheduleToEventData(schedule: Schedule | null): EventData {
  return {
    title: schedule?.title,
    place: schedule?.place,
    description: schedule?.description,
    type: schedule?.type,
    startDate: schedule?.startDate, // Dayjs 객체를 예상하는 필드
    startTime: schedule?.startTime,
    endTime: schedule?.endTime,
    // 추가적으로 필요한 필드들을 매핑하거나 초기화
  };
}

  // 일정 수정 버튼 이벤트 핸들러
  const handleEditSchedule = useCallback((schedule: Schedule) => {
    // 여기에 ScheduleRegiPopup을 열기 위한 로직을 추가하세요
    // 예: openScheduleEditPopup(schedule);
    setEditScheduleData(schedule); // 수정할 일정 데이터 설정
    setShowPopup(true); // 팝업 열기

    console.log('Editing schedule:', schedule);
  }, []);

  return (
    <div className="schedule-container">
       {showPopup && (
        <ScheduleRegiPopup
          isUpdate={true}
          isVisible={showPopup}
          eventData={convertScheduleToEventData(editScheduleData)}  // 변환 함수를 사용하여 Schedule을 EventData로 변환
          onClose={() => {
            setShowPopup(false);
            setEditScheduleData(null); // 팝업 닫을 때 수정 데이터 초기화
          }}
        />
      )}
      {schedules.map((schedule, index) => (
        <article key={index} className="task-card">
          <img src={
            schedule.type === "연습" ? IconClockPerMain :
            schedule.type === "일정" ? IconClockPerSub : IconClockPerAdd
          } alt="" className="scheduleBoxCircle" />
         <div className="time-container">
            <time className="time">{dayjs(schedule.startDate).format('YYYY-MM-DD') + " / "+ dayjs(schedule.startTime).format('HH:mm') + ' ~ ' 
            +dayjs(schedule.endTime).format('HH:mm') }</time>
          </div>
          <img src={moreIconUrl} alt="more options" className="more-icon"
            onClick={() => handleMoreIconClick(schedule.scheduleNumber)} />
          {openOption === schedule.scheduleNumber && (
            <div className="options-popup" ref={popupRef}>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 0)} className="option-button">미정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 1)} className="option-button">출석예정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 3)} className="option-button">불참</button>
              {/* {userInfo?.isAdmin && (
                <button onClick={() => handleEditSchedule(schedule)} className="option-button">일정수정</button>
              )} */}
            </div>
          )}
          <h3 className="title" onClick={() => handleEditSchedule(schedule)}>{schedule.title}</h3>
          <p className="description">{schedule.place}</p>
          <div className={`attendance-status ${
            schedule.isAttending === 1 ? 'attending' :
            schedule.isAttending === 2 ? 'attended' :
            schedule.isAttending === 3 ? 'not-attending' :
            'pending'}`}>

            {schedule.isAttending === 1 ? '출석 예정' :
            schedule.isAttending === 2 ? '출석 완료' :
            schedule.isAttending === 3 ? '불참' :
            '미정'}
          </div>

        </article>
      ))}
    </div>
  );
};

export default ScheduleBox;
