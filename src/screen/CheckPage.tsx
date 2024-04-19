// MyInfoPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store'; // 적절한 RootState 경로를 사용해주세요.
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconClock from "../images/nav/clock.svg";

import "../css/checkPage.css"; // Make sure to create a corresponding CSS file

interface CategoryProps {
  icon: string;
  label: string;
  color: string;
}

const Category: React.FC<CategoryProps> = ({ icon, label, color }) => (
  <div className={`category ${color}`}>
    <img src={icon} alt={label} className="category-icon" />
    <div className="category-label">{label}</div>
  </div>
);

const categories: CategoryProps[] = [
  {
    icon: IconUser,
    label: "연습",
    color: "purple",
  },
  {
    icon:IconUser,
    label: "행사",
    color: "blue",
  },
  {
    icon:IconUser,
    label: "공지",
    color: "green",
  },
];

const CheckPage: React.FC = () => {
  return (
    <>
      <div className="event-form">
        <h2 className="form-title">일정 등록하기</h2>
        <div className="form-fields">
          <input className="event-name" placeholder='일정 제목 '/>
          <input className="event-title" placeholder='장소 '/>
          <input className="event-note" placeholder='내용' />
          <div className="event-date">
            <input className="date-label"  placeholder='2024-01 -01'/>
            <img src={IconCal} alt="Calendar icon" className="date-icon" />
          </div>
          <div className="event-time">
            <div className="start-time">
              <input className="time-label" placeholder='Start Time '/>
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>
            <div className="end-time">
            <input className="time-label"  placeholder='End Time '/>
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>        
          </div>        
          <div className="category-select">일정 종류 선택</div>         
          <div className="category-list">
            {categories.map((category) => (
              <Category key={category.label} {...category} />
            ))}
          </div>
          <div className="add-category">+ Add new</div>
          <button className="create-event">등록하기</button>
        </div>
      </div>

  
    </>
  );
};

export default CheckPage;