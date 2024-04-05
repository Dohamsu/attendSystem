import React, { useMemo, useState } from "react";
import { ScheduleBox } from './ScheduleBox';

import "../css/calendar.css";

type CalendarDayProps = {
  day: number;
  isToday?: boolean;
  isSelected?: boolean | null; 
  events?: EventDetail[];
  onClick: (events: EventDetail[]) => void; // onClick 핸들러에 이벤트 정보 전달
};

interface EventDetail {
    color: string;
    title: string;
    time: string;
    description: string;
    type: "main" | "sub" | "add";
  }
  
  type EventsMap = {
    [key: number]: EventDetail[];
  };
  
  const events: EventsMap = {
    2: [
      { color: "#00B383",  time:"4월 2일 오후 3시" , type:"main", title: "정기연습 1회", description: "한성대학교 미래관 3층 305호"},
      {  color: "#0095FF",  time:"4월 2일 오후 5시" , type:"add", title: "중주 팀 편성", description: "한성대학교 대강당" }
    ],
    9: [
      { color: "#735BF2",  time:"3월 25일 오후 3시" , type:"sub", title: "Client Presentation", description: "Present project update to client" }
    ],
  };
const CalendarDay: React.FC<CalendarDayProps> = ({ day, isToday, isSelected, events, onClick }) => {
  let dayClassName = "calendar-day";
  if (isToday) dayClassName += " today";
  if (isSelected) dayClassName += " selected";
  if (day < 1) dayClassName += " disabled"; // 이전 달과 다음 달의 날짜는 비활성화

   // 날짜 클릭 핸들러 수정
   const handleClick = () => {
    if (day > 0 && onClick) {
      onClick(events || []);
    }
  };
  
  return (
    <div className={dayClassName} onClick={handleClick}>
      <div className="day-number">{day}</div>
      <div className="events">
        {events?.map((event, index) => (
          <span key={index} className="event-dot" style={{ border: "2px solid"+ event.color }}></span>
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<EventDetail[]>([]);

    // 달력 날짜 배열을 반환하는 함수
    const getDaysInMonth = (month: number, year: number) => {
        const numDays = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay(); // 이번 달의 첫째 날이 무슨 요일인지

        // 첫째 날이 일요일이 아닌 경우, 그 앞을 빈 칸으로 채움
        const emptyStartDays = startDay === 0 ? [] : Array.from({ length: startDay }, () => null); // 빈칸을 null로 표시

        return [...emptyStartDays, ...Array.from({ length: numDays }, (_, i) => i + 1)];
    };

    const days = useMemo(() => getDaysInMonth(currentMonth, currentYear), [currentMonth, currentYear]);

    const prevMonth = () => {
        // 달력을 이전 달로 업데이트
        setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
        if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    };

    const nextMonth = () => {
    // 달력을 다음 달로 업데이트
    setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
    if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    };

    const selectDay = (day: number) => {
        // 선택된 날짜로 상태 업데이트
        setSelectedDate(new Date(currentYear, currentMonth, day));
        // 해당 날짜의 이벤트 정보를 상태로 저장
        const dayEvents = events[day];
        if (dayEvents) {
          setSelectedEvents(dayEvents);
        } else {
          // 이벤트가 없는 경우 빈 배열로 설정
          setSelectedEvents([]);
        }
      };

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <>
            <div className="calendar">
                <div className="calendar-header">
                        <img  onClick={prevMonth} src="https://cdn.builder.io/api/v1/image/assets/TEMP/b027eb95-8e37-4dc1-836f-ed5cd1447385?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Next month" className="calendar-arrow" />
                    <div className="calendar-title">
                    <div className="calendar-month">{monthNames[currentMonth]}</div>
                    <div className="calendar-year">{currentYear}</div>
                    </div>
                    <img  onClick={nextMonth} src="https://cdn.builder.io/api/v1/image/assets/TEMP/132c8239-7a17-4bd5-a8b4-950b7e44b589?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Next month" className="calendar-arrow" />
                </div>
                <div className="calendar-weekdays">
                    {weekdays.map((weekday, index) => (
                    <div key={index} className="calendar-weekday">{weekday}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {days.map((day, index) => 
                        day !== null ? (
                        <CalendarDay
                            key={index}
                            day={day}
                            isToday={day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()}
                            isSelected={selectedDate && day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()}
                            events={events[day]} // 해당 날짜의 이벤트 색상 배열을 전달
                            onClick={() => day > 0 && selectDay(day)}
                        />
                        ) : (
                        <div key={index} className="calendar-day disabled"></div> // 빈 칸을 다른 요소로 렌더링
                        )
                    )}
                </div>
            </div>
            {selectedEvents.length > 0 && (
                <div className="schedule-boxes">
                {selectedEvents.map((event, index) => (
                    <ScheduleBox key={index} type={event.type} time={event.time} title={event.title} description={event.description} />
                ))}
                </div>
            )}
        </>
    );
};

export default function CalendarPage() {
  return <Calendar />;
}
