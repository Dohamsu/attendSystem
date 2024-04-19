// src/services/scheduleService.ts
import axios from 'axios';
import { Schedule } from '../stores/type';

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
    const eventDay = new Date(item.time).getDate();
    const eventColor = colorMapping[item.type] || "#000"; // 기본 색상은 검정

    const eventDetail: EventDetail = {
      color: eventColor,
      time: item.time,
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

export const fetchSchedules = async (userName: string): Promise<Schedule[]> => {
  const response = await axios.get<Schedule[]>(`${GET_SCHEDULE_API_URL}?userName=${userName}`);
  return response.data;
};

export const updateAttendance = async (scheduleNumber: string, userName: string, isAttending: number): Promise<void> => {
  await axios.post(`${ATTEND_SCHEDULE_API_URL}`, {
    scheduleNumber,
    userName,
    isAttending
  });
};
