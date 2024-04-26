// src/services/scheduleService.ts
import axios from 'axios';
import { Schedule } from '../stores/type';
import dayjs, { Dayjs } from 'dayjs';

interface EventDetail {
  color: string;
  time: string;
  title: string;
  description: string;
  type: string;
}

interface EventsMap {
  [key: number]: EventDetail[];
}

// 색상 매핑 (타입에 따른 색상)
const colorMapping: { [key: string]: string } = {
  "practice": "#00B383",
  "notice": "#735BF2",
  "etc": "#0095FF"
};

// 스케줄 배열을 받아서 EventsMap 형식으로 변환하는 함수
export const getCalendarEvents = (schedules: Schedule[]): EventsMap => {
  const transformedData = schedules.reduce((acc: EventsMap, item: Schedule) => {
    const eventDate = dayjs(item.startDate);  // Dayjs 객체로 startDate를 처리
    const eventDay = eventDate.date();  // 해당 날짜의 일(day) 부분을 추출

    const eventDetail: EventDetail = {
      color: colorMapping[item.type] || "#000",  // 타입에 따른 색상 할당
      time: eventDate.format('YYYY-MM-DD HH:mm'),  // Dayjs 포맷을 사용하여 문자열로 변환
      title: item.title,
      description: item.description,
      type: item.type
    };

    if (!acc[eventDay]) {
      acc[eventDay] = [];
    }
    acc[eventDay].push(eventDetail);
    return acc;
  }, {});

  return transformedData;
};

// 예시로 API 통신하는 기능도 유지하면서 스케줄 업데이트와 출석 업데이트 함수도 유지
const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;
const ATTEND_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/attend`;

export const fetchSchedules = async (name: string, month?: number, year?: number): Promise<Schedule[]> => {
  const response = await axios.get<Schedule[]>(`${GET_SCHEDULE_API_URL}?name=${name}&month=${month}&year=${year}`);
  console.log(response.data);
  const filteredSchedules = response.data.filter(schedule => schedule.type !== '공지');
  return filteredSchedules;
};


export const updateAttendance = async (scheduleNumber: string, name: string, isAttending: number): Promise<void> => {
  await axios.post(`${ATTEND_SCHEDULE_API_URL}`, {
    scheduleNumber,
    name,
    isAttending
  });
};
