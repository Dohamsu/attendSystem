import React, { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import IconUser from "../images/nav/user.svg";
import IconCal from "../images/nav/calendar.svg";
import IconClock from "../images/nav/clock.svg";
import { registerEvent } from '../services/EventRegistrationService';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import "../css/scheduleRegiPopup.css";
import ReactDOM from 'react-dom';

const ScheduleRegiPopup: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [{ y }, api] = useSpring(() => ({ y: 800 }));
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('연습');
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
  const [pickerOpen, setPickerOpen] = useState(false);  // 날짜 및 시간 선택기의 열림 상태를 추적

  const handleSelectCategory = (label: string) => {
    setType(label);
  };

  interface CategoryProps {
    icon: string;
    label: string;
    color: string;
    selected: boolean;  // Include 'selected' property in the interface
    onSelect: (label: string) => void;
  }
  
  const Category: React.FC<CategoryProps> = ({ icon, label, color, selected, onSelect }) => (
    <div className={`category ${color} ${selected ? 'selected' : ''}`} onClick={() => onSelect(label)}>
      <img src={icon} alt={label} className="category-icon" />
      <div className="category-label">{label}</div>
    </div>
  );
  
  const categories: CategoryProps[] = [
    {
      icon: IconUser,
      label: "연습",
      color: "purple",
      selected: type === "연습",
      onSelect: handleSelectCategory
    },
    {
      icon: IconUser,
      label: "행사",
      color: "blue",
      selected: type === "행사",
      onSelect: handleSelectCategory
    },
    {
      icon: IconUser,
      label: "공지",
      color: "green",
      selected: type === "공지",
      onSelect: handleSelectCategory
    },
  ];
  
  const style = useSpring({
    transform: y.to(y => `translateY(${y}px)`),
    config: {
      duration: 100, // 애니메이션 지속 시간
      tension: 500, // 스프링 텐션, 더 높은 값은 더 빠른 "강성"
      friction: 5 // 마찰, 더 높은 값은 더 천천히 멈춤
    }
  });

  const bind = useDrag(({ down, movement: [, my], cancel }) => {
    // console.log(my);
    if (pickerOpen) return;

    if (my > 19 && !down) {
      cancel && cancel();
      api.start({ y: 800, onRest: onClose }); // 드래그로 팝업을 닫을 때
    } else {
      // api.start({ y: down ? my : 0 }); // 드래그 중이거나 원래 위치로 복귀
    }
  });

  // 팝업 표시 여부에 따라 애니메이션 실행
  useEffect(() => {
    if (isVisible) {
      api.start({ y: 10 });
        // 팝업이 보일 때 body의 스크롤을 비활성화
        document.body.style.overflow = 'hidden';
    }else {
      // 팝업이 숨겨질 때 body의 스크롤을 다시 활성화
      document.body.style.overflow = 'auto';
    }
  }, [isVisible, api]);

  const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<Dayjs>>) => (newTime: Dayjs | null) => {
    if (newTime) {
      setter(newTime);
    }
    // 필요한 경우 null인 경우의 처리 로직 추가
  };

  const handleEndTimeChange = (newTime: Dayjs | null) => {
    if (newTime) {
      if (newTime.isBefore(startTime)) {
        alert('시간 설정이 잘못되었습니다. 다시 확인해주세요.');
        setEndTime(startTime);
      } else {
        setEndTime(newTime);
      }
    }
  };
  
  const submitForm = async () => {
    // 입력 필드의 값이 비어 있는지 확인
    if (!title.trim() || !place.trim() || !description.trim()) {
        alert('제목과 장소는 필수 입력입니다.');
        return;
    }
    // 날짜와 시간이 유효한지 검사
    if (startDate.isAfter(dayjs()) || startTime.isAfter(endTime)) {
        alert('날짜 또는 시간이 유효하지 않습니다. 다시 확인해주세요.');
        return;
    }


    const eventData = { title, place, description, startDate, type, startTime, endTime };
    console.log(eventData);

    try {
        await registerEvent(eventData);
        onClose(); // 등록 성공 후 팝업 닫기
    } catch (error) {
        alert('이벤트 등록 중 오류가 발생했습니다.');
    }
};



  return ReactDOM.createPortal(
    (
    <animated.div className="event-form-container" style={{ display: isVisible ? 'flex' : 'none' }}>
      <animated.div className="event-form" style={style} {...bind()}>
        <h2 className="form-title">일정 등록하기</h2>
        <div className="form-fields">
        <input value={title} onChange={e => setTitle(e.target.value)} className="event-name" placeholder='일정 제목*' />
          <input value={place} onChange={e => setPlace(e.target.value)} className="event-title" placeholder='장소*' />
          <input value={description} onChange={e => setDescription(e.target.value)} className="event-note" placeholder='내용' />
          <div className="event-date">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <div>
                <MobileDatePicker  
                  className="mui_datePicker"  
                  format="YYYY-MM-DD"  
                  onOpen={() => setPickerOpen(true)}
                  onClose={() => setPickerOpen(false)}
                  onChange={handleTimeChange(setStartDate)}
                  defaultValue={dayjs()} 
                  slotProps={{
                    toolbar: {  hidden:true },
                  }}
                  sx={{border:0}}
                  />
                </div>
              </LocalizationProvider>
            <img src={IconCal} alt="Calendar icon" className="date-icon" />
          </div>
          <div className="event-time">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <div>
              <TimePicker
                value={startTime}
                label="시작 시간"
                onOpen={() => setPickerOpen(true)}
                onClose={() => setPickerOpen(false)}
                onChange={handleTimeChange(setStartTime)}
                slotProps={{
                  toolbar: { hidden:false },
                }}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                />
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>
            <div>
              <MobileTimePicker
                value={endTime}
                label="종료 시간"
                onOpen={() => setPickerOpen(true)}
                onClose={() => setPickerOpen(false)}
                onChange={handleEndTimeChange}
                />
              <img src={IconClock} alt="Clock icon" className="time-icon" />
            </div>
            </LocalizationProvider>
          </div>
          <div className="category-select">일정 종류 선택</div>         
          <div className="category-list">
            {categories.map(category => <Category key={category.label} {...category} />)}
          </div>
          {/* <div className="add-category">+ Add new</div> */}
          <button className="create-event"  onClick={submitForm}>등록하기</button>
        </div>
      </animated.div>
    </animated.div>
  ),
  document.body // 포털의 목표 요소

  )
};

export default ScheduleRegiPopup;
