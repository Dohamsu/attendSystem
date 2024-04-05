import * as React from "react";
import "../css/scheduleBox.css"; // CSS 파일 임포트
import IconClockPerMain from "../images/scheduleBoxCircle1.svg";
import IconClockPerSub from "../images/scheduleBoxCircle2.svg";
import IconClockPerAdd from "../images/scheduleBoxCircle3.svg";
import moreIconUrl from "../images/scheduleMoreUrl.svg";


interface ScheduleBoxProps {
  time: string;
  title: string;
  description: string;
  type: "main" | "sub" | "add";
}

export const ScheduleBox: React.FC<ScheduleBoxProps> = ({ time, title, description, type  }) => {
  let backgroundImageUrl;
  switch (type) {
    case "main":
      backgroundImageUrl = IconClockPerMain;
      break;
    case "sub":
      backgroundImageUrl = IconClockPerSub;
      break;
    case "add":
      backgroundImageUrl = IconClockPerAdd;
      break;
    default:
      backgroundImageUrl = IconClockPerMain; // 기본값 설정
  }

  return (
    <article className="task-card">
      <img src={backgroundImageUrl} alt="" className="scheduleBoxCircle" />
      <div className="time-container">
        <img src="clock-icon-url" alt="" className="clock-icon" />
        <time className="time">{time}</time>
      </div>
      <img src={moreIconUrl} alt="more options" className="more-icon" />
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
    </article>
  );
};