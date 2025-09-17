// NoticePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Schedule } from '../stores/type';
import dayjs, { Dayjs } from 'dayjs';

import "../css/noticePage.css"; // 기존 CSS 파일 사용

const NoticePage: React.FC = () => {
  // Notice 배열로 상태를 관리
  const [notices, setNotices] = useState<Schedule[]>([]);
  const GET_NOTICE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/notice`;

    // 예시로 API 통신하는 기능도 유지하면서 스케줄 업데이트와 출석 업데이트 함수도 유지
    const GET_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule`;

  


  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get<Schedule[]>(`${GET_SCHEDULE_API_URL}?name=${''}`);
        const filteredSchedules = response.data.filter(schedule => schedule.type == '공지');
        setNotices(filteredSchedules);
      } catch (error) {
        console.error('공지사항 불러오기 실패:', error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="notice-page">
      <header className="notice-header">
        <h1 className="notice-title">공지사항</h1>
      </header>
      
      <main className="notice-list">
        {notices.map((notice, index) => (
          <Accordion key={index} className="notice-card">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`notice-content-${index}`}
              id={`notice-header-${index}`}
            >
              <Typography variant="body1" className="notice-heading">{notice.title}</Typography>
              <Typography className="notice-date">{dayjs(notice.startDate).format('YYYY-MM-DD')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="notice-description">
                {notice.description}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </main>
    </div>
  );
};

export default NoticePage;