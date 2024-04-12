// NoticePage.tsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import "../css/noticePage.css"; // 기존 CSS 파일 사용

const NoticePage: React.FC = () => {
  const notices = [
    {
      date: "2024-04-08", // 일자 정보를 추가
      title: "파트 배정 및 오리엔테이션",
      description: "해당 일자에 파트 배정과 오리엔테이션이 있을 예정입니다. \n 자꾸 연습 안해오면 맴매 ",
    },
    {
      date: "2024-04-06", // 일자 정보를 추가
      title: "공지사항 필독",
      description: "안녕하세요 여러분 추카추카 야호야호 \n 무야호 \n 기타 연습해   ",
    },
    
    // 추가 공지사항...
  ];

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
              <Typography  variant="body1" color="" className="notice-heading">{notice.title}</Typography>
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
