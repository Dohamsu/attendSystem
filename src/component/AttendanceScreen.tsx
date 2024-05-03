import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SmileIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import dayjs from 'dayjs';
import { Schedule, Attendance, Attendee } from '../stores/type';  // 'Attendance' 타입도 필요하면 추가

interface AttendanceScreenProps {
  onAttend: () => void;
  todaySchedule: Schedule | null; // todaySchedule를 prop으로 받습니다.
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onAttend, todaySchedule }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null); // 초기값을 null로 설정
  const [timePassed, setTimePassed] = useState<boolean>(false);
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = dayjs();
      const startTime = dayjs(todaySchedule?.startTime);
      const secondsLeft = startTime.diff(now, 'second');
  
      if (secondsLeft > 0) {
        // 하루를 초과하는 경우
        if (secondsLeft > 86400) {
          const days = Math.floor(secondsLeft / 86400);
          const remainder = secondsLeft % 86400;
          const hours = Math.floor(remainder / 3600);
          const minutes = Math.floor((remainder % 3600) / 60);
          setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`);
        } 
        // 1시간에서 하루 사이인 경우
        else if (secondsLeft > 3600) {
          const hours = Math.floor(secondsLeft / 3600);
          const minutes = Math.floor((secondsLeft % 3600) / 60);
          setTimeLeft(`${hours}시간 ${minutes}분`);
        }
        // 1시간 이내인 경우
        else {
          const minutes = Math.floor(secondsLeft / 60);
          const seconds = secondsLeft % 60;
          setTimeLeft(`${minutes}분 ${seconds}초`);
        }
        setButtonActive(secondsLeft <= 3600);  // 1시간 이내일 경우 버튼 활성화
      } else {
        setTimeLeft('출석 시간이 지났습니다.');
        setButtonActive(false);
      }
    };

    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [todaySchedule]);

  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <SmileIcon sx={{ fontSize: 60, color: 'skyblue' }} />
      <Typography variant="h6" sx={{ my: 2 }}>스마트 출석</Typography>
      {timeLeft !== null && (
        <>
          {!timePassed && (
            <Typography variant="body1">출석시간까지</Typography>
          )}
          <Typography variant="h4" sx={{ my: 2 }}>{timeLeft}</Typography>
          <Button variant="contained" color="primary" onClick={onAttend} disabled={!buttonActive} sx={{ mt: 2 }}>
            출석하기!
          </Button>
        </>
      )}
    </Box>
  );
};

export default AttendanceScreen;
