import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from '../stores/store';
import "../css/navBar.css";

import WhiteNav from "../images/nav/white-nav.svg";
import CenterButton from "../images/nav/centerButton.png";
import ScheduleRegiPopup from './ScheduleRegiPopup';

import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconCheck from "../images/nav/check.svg";
import IconChat from "../images/nav/chat.svg";
import IconAlarm from "../images/nav/alarm.svg";
import IconUserPer from "../images/nav/user_per.svg";
import IconCalPer from "../images/nav/calendar_per.svg";
import IconCheckPer from "../images/nav/check_per.svg";
import IconChatPer from "../images/nav/chat_per.svg";
import IconAlarmPer from "../images/nav/alarm_per.svg";

export const NavBar = (): JSX.Element | null => {

  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);

  const [activeIcon, setActiveIcon] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [showNavBar, setShowNavBar] = useState<boolean>(true); // NavBar visibility 상태 추가

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const icons = [
    { name: "calendar", defaultIcon: IconCal, activeIcon: IconCalPer, path: "/calendar" },
    { name: "check", defaultIcon: IconCheck, activeIcon: IconCheckPer, path: isAdmin ? "/attend" : "/check" },
    { name: "alarm", defaultIcon: IconChat, activeIcon: IconChatPer, path: "/notice" },
    { name: "user", defaultIcon: IconUser, activeIcon: IconUserPer, path: "/myinfo" },
  ];

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        setShowNavBar(false);
      }
    };

    const handleFocusOut = () => setShowNavBar(true);

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    const currentIcon = icons.find(icon => icon.path === location.pathname)?.name;
    if (currentIcon) {
      setActiveIcon(currentIcon);
    }
  }, [location.pathname]);

  if (location.pathname === "/" || location.pathname === "/login" || !showNavBar) {
    return null; // 인트로 페이지 또는 텍스트 입력에 focus된 경우 NavBar를 렌더링하지 않음
  }

  const handleIconClick = (iconName: string, path: string) => {
    setActiveIcon(iconName);
    navigate(path);
  };

  return (
    <>
      <div className="NavBar">
        {isAdmin &&
          <div className="centerButton" onClick={togglePopup}>
            <div className="centerButtonShadow"></div>
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
