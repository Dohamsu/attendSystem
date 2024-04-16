// NoticePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import "../css/noticePage.css"; // 기존 CSS 파일 사용

// 공지사항 데이터 타입 정의
interface Notice {
  date: string;
  title: string;
  description: string;
  scheduleNumber: string;
}

const NoticePage: React.FC = () => {
  // Notice 배열로 상태를 관리
  const [notices, setNotices] = useState<Notice[]>([]);
  const GET_NOTICE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/notice`;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get<Notice[]>(GET_NOTICE_API_URL);
        const formattedNotices = response.data.map(notice => ({
          ...notice,
          date: new Date(notice.date).toLocaleDateString() // 날짜 포맷을 'yyyy-MM-dd' 형식으로 변경
        }));
        setNotices(formattedNotices);
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
              <Typography className="notice-date">{notice.date}</Typography>
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