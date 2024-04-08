import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/navBar.css";

import WhiteNav from "../images/nav/white-nav.svg";
import CenterButton from "../images/nav/centerButton.png";
// 기본 아이콘
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconCheck from "../images/nav/check.svg";
import IconAlarm from "../images/nav/alarm.svg";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// 활성화된 아이콘
import IconUserPer from "../images/nav/user_per.svg";
import IconCalPer from "../images/nav/calendar_per.svg";
import IconCheckPer from "../images/nav/check_per.svg";
import IconAlarmPer from "../images/nav/alarm_per.svg";

export const NavBar = (): JSX.Element | null => {
  
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅 추가

  const [activeIcon, setActiveIcon] = useState<string>("");

  const icons = [
    { name: "calendar", defaultIcon: IconCal, activeIcon: IconCalPer, path: "/home" },
    { name: "check", defaultIcon: IconCheck, activeIcon: IconCheckPer, path: "/check" },
    { name: "alarm", defaultIcon: IconAlarm, activeIcon: IconAlarmPer, path: "/notice" },
    { name: "user", defaultIcon: IconUser, activeIcon: IconUserPer, path: "/myinfo" },
  ];

  if (location.pathname === "/") {
    return null; // 인트로 페이지에서는 NavBar를 렌더링하지 않음
  }

  const handleIconClick = (iconName: string, path: string) => {
    setActiveIcon(iconName); // 현재 활성화된 아이콘 업데이트
    navigate(path); // 경로 이동
  };


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
              onClick={() => handleIconClick(icon.name, icon.path)} // 클릭 이벤트 핸들러 추가
            />
          ))}
        </div>
        <img className="navBarBackground" alt="White Navigation Bar" src={WhiteNav} />
    </div>
  );
};
