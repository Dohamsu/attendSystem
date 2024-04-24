import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconClock from "../images/nav/clock.svg";
import "../css/scheduleRegiPopup.css";

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
    icon: IconUser,
    label: "행사",
    color: "blue",
  },
  {
    icon: IconUser,
    label: "공지",
    color: "green",
  },
];

const ScheduleRegiPopup: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [{ y }, api] = useSpring(() => ({ y: 800 }));
  const style = useSpring({
    transform: y.to(y => `translateY(${y}px)`),
    config: {
      duration: 100, // 애니메이션 지속 시간
      tension: 500, // 스프링 텐션, 더 높은 값은 더 빠른 "강성"
      friction: 5 // 마찰, 더 높은 값은 더 천천히 멈춤
    }
  });

  const bind = useDrag(({ down, movement: [, my], cancel }) => {
    console.log(my);
    if (my > 19 && !down) {
      cancel && cancel();
      api.start({ y: 800, onRest: onClose }); // 드래그로 팝업을 닫을 때
    } else {
      // api.start({ y: down ? my : 0 }); // 드래그 중이거나 원래 위치로 복귀
    }
  });

  // 팝업 표시 여부에 따라 애니메이션 실행
  React.useEffect(() => {
    if (isVisible) {
      api.start({ y: 10 });
    }
  }, [isVisible, api]);

  return (
    <animated.div className="event-form-container" style={{ display: isVisible ? 'flex' : 'none' }}>
      <animated.div className="event-form" style={style} {...bind()}>
        <h2 className="form-title">일정 등록하기</h2>
        <div className="form-fields">
          <input className="event-name" placeholder='일정 제목' />
          <input className="event-title" placeholder='장소' />
          <input className="event-note" placeholder='내용' />
          <div className="event-date">
            <input className="date-label" placeholder='2024-01-01' />
            <img src={IconCal} alt="Calendar icon" className="date-icon" />
          </div>
          <div className="event-time">
            <div className="start-time">
              <input className="time-label" placeholder='Start Time' />
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>
            <div className="end-time">
              <input className="time-label" placeholder='End Time' />
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>        
          </div>        
          <div className="category-select">일정 종류 선택</div>         
          <div className="category-list">
            {categories.map(category => <Category key={category.label} {...category} />)}
          </div>
          <div className="add-category">+ Add new</div>
          <button className="create-event">등록하기</button>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default ScheduleRegiPopup;
