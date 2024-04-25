// src/services/EventRegistrationService.ts
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

interface EventData {
  title: string;
  place: string;
  description: string;
  type: string;
  startDate: Dayjs;  // Dayjs 객체
  startTime: Dayjs;  // Dayjs 객체
  endTime: Dayjs;    // Dayjs 객체
}

export const registerEvent = async (eventData: EventData): Promise<void> => {
  const { title, place, description, type, startDate, startTime, endTime } = eventData;

  // Dayjs 객체를 ISO 문자열로 변환
  const formattedEventData = {
    title,
    place,
    description,
    type,
    startDate: startDate.toISOString(),  // ISO 문자열로 변환
    startTime: startTime.toISOString(),  // ISO 문자열로 변환
    endTime: endTime.toISOString(),      // ISO 문자열로 변환
  };

  const POST_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;


  try {
    const response = await axios.post(POST_SCHEDULE_API_URL, formattedEventData);
    console.log('Event registered successfully:', response.data);
  } catch (error) {
    console.error('Failed to register event:', error);
    throw error; // Optionally re-throw to handle it differently in the UI
  }
};
