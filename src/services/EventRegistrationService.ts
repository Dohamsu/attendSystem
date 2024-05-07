// src/services/EventRegistrationService.ts
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

interface EventData {
  title: string;
  place: string;
  description: string;
  type: string;
  startDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  scheduleNumber?: string;  // 'id' 대신 'scheduleNumber' 속성을 사용합니다.
}

export const registerEvent = async (eventData: EventData): Promise<void> => {
  const { title, place, description, type, startDate, startTime, endTime } = eventData;
  const formattedEventData = {
    title,
    place,
    description,
    type,
    startDate: startDate.toISOString(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  const POST_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;

  try {
    const response = await axios.post(POST_SCHEDULE_API_URL, formattedEventData);
    // console.log('Event registered successfully:', response.data);
    alert('일정이 정상적으로 등록되었습니다.');
  } catch (error) {
    console.error('Failed to register event:', error);
    alert('일정 등록에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    throw error;
  }
};

export const updateEvent = async (eventData: EventData): Promise<void> => {
  const { scheduleNumber, title, place, description, type, startDate, startTime, endTime } = eventData;
  if (!scheduleNumber) throw new Error('Schedule number is required for updating an event.');

  const formattedEventData = {
    title,
    place,
    description,
    type,
    startDate: startDate.toISOString(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  const PUT_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule/${scheduleNumber}`;

  try {
    const response = await axios.put(PUT_SCHEDULE_API_URL, formattedEventData);
    console.log('Event updated successfully:', response.data);
    alert('일정이 정상적으로 수정되었습니다.');
  } catch (error) {
    console.error('Failed to update event:', error);
    alert('일정 수정에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    throw error;
  }
};
