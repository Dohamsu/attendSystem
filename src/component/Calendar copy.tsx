// Calendar.tsx
import React from "react";
import "../css/calendar.css";

type CalendarDayProps = {
  day: number;
  isToday?: boolean;
  isDisabled?: boolean;
};

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isToday, isDisabled }) => {
  const dayClassName = `calendar-day ${isToday ? "today" : ""} ${
    isDisabled ? "disabled" : ""
  }`;

  return <div className={dayClassName}>{day}</div>;
};

type CalendarProps = {
  month: string;
  year: number;
  days: number[];
};

const Calendar: React.FC<CalendarProps> = ({ month, year, days }) => {
  return (
    <div className="calendar">
      <div className="calendar-header">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b027eb95-8e37-4dc1-836f-ed5cd1447385?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Previous month" className="calendar-arrow" />
        <div className="calendar-title">
          <div className="calendar-month">{month}</div>
          <div className="calendar-year">{year}</div>
        </div>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/132c8239-7a17-4bd5-a8b4-950b7e44b589?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Next month" className="calendar-arrow" />
      </div>
      <div className="calendar-weekdays">
        <div className="calendar-weekday">Mon</div>
        <div className="calendar-weekday">Tue</div>
        <div className="calendar-weekday">Wed</div>
        <div className="calendar-weekday">Thu</div>
        <div className="calendar-weekday">Fri</div>
        <div className="calendar-weekday">Sat</div>
        <div className="calendar-weekday">Sun</div>
      </div>
      <div className="calendar-days">
        {days.map((day, index) => (
          <CalendarDay key={index} day={day} isToday={day === 2} isDisabled={day < 1} />
        ))}
      </div>
      <div className="calendar-footer">
        <div className="calendar-next-month">
          <div className="calendar-next-days">
            <CalendarDay day={30} isDisabled />
            <CalendarDay day={31} isDisabled />
            <CalendarDay day={1} isDisabled />
            <CalendarDay day={2} isDisabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CalendarPage() {
  const currentMonth = "September";
  const currentYear = 2021;
  const daysInMonth = [
    31, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29,
  ];

  return <Calendar month={currentMonth} year={currentYear} days={daysInMonth} />;
}
