import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';  // useSelector 훅 추가
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from '../stores/store';
import "../css/navBar.css";

import WhiteNav from "../images/nav/white-nav.svg";
import CenterButton from "../images/nav/centerButton.png";
import ScheduleRegiPopup from './ScheduleRegiPopup';

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
  const navigate = useNavigate();
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);

  const [activeIcon, setActiveIcon] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    console.log('버튼 클릭');
    setShowPopup(!showPopup);
  };

  const icons = [
    { name: "calendar", defaultIcon: IconCal, activeIcon: IconCalPer, path: "/calendar" },
    { name: "check", defaultIcon: IconCheck, activeIcon: IconCheckPer, path: isAdmin ? "/attend" : "/check" },
    { name: "alarm", defaultIcon: IconAlarm, activeIcon: IconAlarmPer, path: "/notice" },
    { name: "user", defaultIcon: IconUser, activeIcon: IconUserPer, path: "/myinfo" },
  ];

  useEffect(() => {
    // 현재 경로(location.pathname)에 해당하는 아이콘을 활성화합니다.
    const currentIcon = icons.find(icon => icon.path === location.pathname)?.name;
    if (currentIcon) {
      setActiveIcon(currentIcon);
    }
  }, [location.pathname]); // location.pathname이 변경될 때마다 이 로직을 실행합니다.

  if (location.pathname === "/" || location.pathname === "/login" ) {
    return null; // 인트로 페이지에서는 NavBar를 렌더링하지 않음
  }

  const handleIconClick = (iconName: string, path: string) => {
    setActiveIcon(iconName); // 현재 활성화된 아이콘 업데이트
    navigate(path); // 경로 이동
  };

  return (
    <>
      <div className="NavBar">
        {isAdmin&&
          <div className="centerButton"  onClick={togglePopup}>
                <div className="centerButtonShadow"> </div>
                <img width={100} alt="Center Button" src={CenterButton} />
          </div>
        }
        <div className="iconBox">
          {icons.map((icon) => (
            <img
              key={icon.name}
              alt={`${icon.name} icon`}
              src={activeIcon === icon.name ? icon.activeIcon : icon.defaultIcon}
              onClick={() => handleIconClick(icon.name, icon.path)}
            />
          ))}
        </div>
          <img className="navBarBackground" alt="White Navigation Bar" src={WhiteNav} />
      </div>
      {showPopup && <ScheduleRegiPopup isUpdate={false} isVisible={showPopup} onClose={() => setShowPopup(false)} />}
    </>
  );
};