import React, { useEffect, useMemo, useState } from "react";
import ScheduleBox from './ScheduleBox';
import { getCalendarEvents } from '../common/scheduleService';
import { Schedule, ScheduleBoxProps } from '../stores/type';
import PrevBtn from "../images/PrevBtn.png";
import NextBtn from "../images/NextBtn.svg";
import dayjs, { Dayjs } from 'dayjs';

import "../css/calendar.css";

type CalendarDayProps = {
  day: number;
  isToday?: boolean;
  isSelected?: boolean | null;
  events?: Schedule[];
  onClick: (day: number, events: Schedule[]) => void;
};

type EventsMap = {
  [key: number]: Schedule[];
};

const colorMapping: { [key: string]: string } = {
  "연습": "#00B383",
  "공지": "#735BF2",
  "행사": "#0095FF"
};

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isToday, isSelected, events, onClick }) => {
  let dayClassName = "calendar-day";
  if (isToday) dayClassName += " today";
  if (isSelected) dayClassName += " selected";
  if (day < 1) dayClassName += " disabled";

  const handleClick = () => {
    if (day > 0 && onClick) {
      onClick(day, events || []);
    }
  };

  return (
    <div className={dayClassName} onClick={handleClick}>
      <div className="day-number">{day}</div>
      <div className="events">
        {events?.map((event, index) => (
          <span key={index} className="event-dot" style={{ border: "2px solid" + event.color }}></span>
        ))}
      </div>
    </div>
  );
};

export const Calendar: React.FC<ScheduleBoxProps> = ({ schedules, selectedEvents, setSelectedEvents, month }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventsMap>({});

  const getDaysInMonth = (month: number, year: number) => {
    const numDays = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    const emptyStartDays = startDay === 0 ? [] : Array.from({ length: startDay }, () => null);
    return [...emptyStartDays, ...Array.from({ length: numDays }, (_, i) => i + 1)];
  };
  
  const days = useMemo(() => getDaysInMonth(currentMonth, currentYear), [currentMonth, currentYear]);

  const selectDay = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    const dayEvents = events[day];
    setSelectedEvents(dayEvents || []);
  };

  useEffect(() => {
    const eventsMap: EventsMap = {};
    schedules.forEach(schedule => {
      const scheduleDate = dayjs(schedule.startDate);  // startDate를 Dayjs 객체로 사용합니다.
      const day = scheduleDate.date();  // getDate() 대신 Dayjs의 date() 메서드를 사용합니다.
      const eventColor = colorMapping[schedule.type] || "#000000";

      const updatedSchedule = { ...schedule, color: eventColor };

      if (!eventsMap[day]) {
        eventsMap[day] = [];
      }
      eventsMap[day].push(updatedSchedule);
    });
    setEvents(eventsMap);
  }, [schedules]);


  const [timerSet, setTimerSet] = useState(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (!timerSet && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      timer = setTimeout(() => {
        selectDay(today.getDate());
        setTimerSet(true); // Ensure the logic runs only once
      }, 300);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [events]);

  useEffect(() => {
    filterEventsForMonth(currentMonth, currentYear);    
  }, [schedules]);

  const filterEventsForMonth = (month: number, year: number) => {
    const eventsMap: EventsMap = {};
    schedules.forEach(schedule => {
      const scheduleDate = dayjs(schedule.startDate);
      const scheduleMonth = scheduleDate.month(); // month()는 0부터 시작 (0=1월)
      const scheduleYear = scheduleDate.year();
      
    if (scheduleMonth === month && scheduleYear === year) {
      const day = scheduleDate.date(); // getDate() 대신 date() 사용
      const eventColor = colorMapping[schedule.type] || "#000000";
      const updatedSchedule = { ...schedule, color: eventColor };

      if (!eventsMap[day]) {
        eventsMap[day] = [];
      }
      eventsMap[day].push(updatedSchedule);
      }
    });
    setEvents(eventsMap);
  };

  const prevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    filterEventsForMonth(newMonth, newYear);
    setSelectedEvents([]);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    filterEventsForMonth(newMonth, newYear);
    setSelectedEvents([]);
    setSelectedDate(null);
  };

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <>
      <div className="calendar">
        <div className="calendar-header">
          <img onClick={prevMonth} src={PrevBtn} alt="Previous month" className="calendar-arrow" />
          <div className="calendar-title">
            <div className="calendar-month">{monthNames[currentMonth]}</div>
            <div className="calendar-year">{currentYear}</div>
          </div>
          <img onClick={nextMonth} src={NextBtn} alt="Next month" className="calendar-arrow" />
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
                events={events[day]}
                onClick={() => day > 0 && selectDay(day)}
              />
            ) : (
              <div key={index} className="calendar-day disabled"></div>
            )
          )}
        </div>
      </div>
      {selectedEvents.length > 0 && (
        <div className="schedule-boxes">
          <ScheduleBox month={2} day={2} schedules={selectedEvents} setSchedules={setSelectedEvents} selectedEvents={selectedEvents} setSelectedEvents={setSelectedEvents} />
        </div>
      )}
    </>
  );
};
