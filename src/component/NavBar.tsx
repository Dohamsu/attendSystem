import React, { useState } from "react";
import "../css/navBar.css";
import WhiteNav from "../images/nav/white-nav.svg";
import CenterButton from "../images/nav/centerButton.png";
// 기본 아이콘
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconClock from "../images/nav/clock.svg";
import IconAlarm from "../images/nav/alarm.svg";
// 활성화된 아이콘
import IconUserPer from "../images/nav/user_per.svg";
import IconCalPer from "../images/nav/calendar_per.svg";
import IconClockPer from "../images/nav/clock_per.svg";
import IconAlarmPer from "../images/nav/alarm_per.svg";

export const NavBar = (): JSX.Element => {
  const [activeIcon, setActiveIcon] = useState<string>("");

  const icons = [
    { name: "user", defaultIcon: IconUser, activeIcon: IconUserPer },
    { name: "calendar", defaultIcon: IconCal, activeIcon: IconCalPer },
    { name: "clock", defaultIcon: IconClock, activeIcon: IconClockPer },
    { name: "alarm", defaultIcon: IconAlarm, activeIcon: IconAlarmPer },
  ];

  return (
    <div className="NavBar">
        <div className="centerButton">
            <div className="centerButtonShadow"> </div>
            <img width={100} alt="Center Button" src={CenterButton} />
        </div>
        <div className="iconBox">
          {icons.map((icon) => (
            <img
              key={icon.name}
              alt={`${icon.name} icon`}
              src={activeIcon === icon.name ? icon.activeIcon : icon.defaultIcon}
              onClick={() => setActiveIcon(icon.name)}
            />
          ))}
        </div>
        <img className="navBarBackground" alt="White Navigation Bar" src={WhiteNav} />
    </div>
  );
};
