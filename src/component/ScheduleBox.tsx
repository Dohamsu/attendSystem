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
import { Box } from '@mui/material';

const ScheduleBox: React.FC<ScheduleBoxProps & { showPastEvents: boolean }> = ({ schedules, setSchedules, selectedEvents, setSelectedEvents, oneDayList, showPastEvents }) => {
  const userInfo = useSelector((state: RootState) => state.user.user);
  const [editScheduleData, setEditScheduleData] = useState<Schedule | null>(null);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

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
    let newFilteredSchedules = schedules;

    if (selectedEvents.length > 0) {
      newFilteredSchedules = selectedEvents;
    } else if (!showPastEvents) {
      newFilteredSchedules = schedules.filter(schedule => dayjs(schedule.startDate).isSameOrAfter(dayjs(), 'day'));
    }

    setFilteredSchedules(newFilteredSchedules);

    if (selectedEvents.length > 0 || showPastEvents) {
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
  }, [selectedEvents, showPastEvents, schedules, setSchedules]);

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
      scheduleNumber: schedule?.scheduleNumber,
      // 추가적으로 필요한 필드들을 매핑하거나 초기화
    };
  }

  // 일정 수정 버튼 이벤트 핸들러
  const handleEditSchedule = useCallback((schedule: Schedule) => {
    setEditScheduleData(schedule); // 수정할 일정 데이터 설정
    setShowPopup(true); // 팝업 열기
  }, []);

  return (
    <Box
      className="schedule-container"
      height='70%'
      overflow='scroll'
      sx={{
        overflowX: 'hidden',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: '5px',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}
    >
      {showPopup && userInfo?.isAdmin && (
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
      {filteredSchedules.map((schedule, index) => (
        <article key={index} className="task-card">
          <img src={
            schedule.type === "재학생 연습" ? IconClockPerMain :
              schedule.type === "전체 연습" ? IconClockPerSub : IconClockPerAdd
          } alt="" className="scheduleBoxCircle" />
          <div className="time-container">
            <time className="time">{dayjs(schedule.startDate).format('YYYY-MM-DD') + " / " + dayjs(schedule.startTime).format('HH:mm') + ' ~ '
              + dayjs(schedule.endTime).format('HH:mm')}</time>
          </div>
          <img src={moreIconUrl} alt="more options" className="more-icon"
            onClick={() => handleMoreIconClick(schedule.scheduleNumber)} />
          {openOption === schedule.scheduleNumber && (
            <div className="options-popup" ref={popupRef}>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 0)} className="option-button">미정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 1)} className="option-button">출석예정</button>
              <button onClick={() => toggleAttendance(schedule.scheduleNumber, 3)} className="option-button">불참</button>
            </div>
          )}
          <h3 className="title" onClick={() => handleEditSchedule(schedule)}>{schedule.title}</h3>
          <p className="description">{schedule.place}</p>
          <div className={`attendance-status ${
            schedule.isAttending === 0 ? 'pending' :
              schedule.isAttending === 1 ? 'attending' :
                schedule.isAttending === 2 ? 'attended' :
                  schedule.isAttending === 3 ? 'not-attending' :
                    'pending'}`}>

            {schedule.isAttending === 0 ? '미정' :
              schedule.isAttending === 1 ? '출석 예정' :
                schedule.isAttending === 2 ? '출석 완료' :
                  schedule.isAttending === 3 ? '불참' :
                    '미정'}
          </div>
        </article>
      ))}
    </Box>
  );
};

export default ScheduleBox;
