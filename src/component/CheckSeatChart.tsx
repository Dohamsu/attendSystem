// CheckSeatChart.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, styled, Typography } from '@mui/material';
import CheckSeat from './CheckSeat';
import { fetchSchedules, fetchAttendance } from '../common/scheduleService';
import { Schedule, Attendance , Attendee} from '../stores/type';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // 미래 날짜 비교를 위해 필요한 플러그인
import '../css/checkSeatChart.css';
import PersonIcon from '@mui/icons-material/Person';

// Props 타입 정의
type CheckSeatChartProps = {
  todaySchedule: Schedule | null;
  attendanceList: Attendee[];
};

type SeatStatus = '0' |'1' | '2' | '3';

interface Seat {
  id: string;
  status: SeatStatus;
  occupant?: string;
}

const Circle = styled(Box)(({ theme }) => ({
  borderRadius: '100%',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom:'10px',
  color: 'white',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  boxShadow: ' 2px 2px 10px 0px rgba(0, 0, 0, 0.3)'
}));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 'auto',
  alignSelf: 'stretch',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

dayjs.extend(isSameOrAfter); // 플러그인 확장

let rows = 4;
let seatsPerRow = 6;
// 가로 6줄, 세로 4줄의 좌석을 생성하는 함수
const CheckSeatChart: React.FC<CheckSeatChartProps> = ({ todaySchedule, attendanceList }) => {
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, planned: 0, attended: 0, absent: 0 });


  useEffect(() => {
    initializeSeats();
    const counts = { pending: 0, planned: 0, attended: 0, absent: 0 };
  
    attendanceList.forEach(attendee => {
      switch (attendee.isAttending) {
        case 0:
          counts.pending += 1;
          break;
        case 1:
          counts.planned += 1;
          break;
        case 2:
          counts.attended += 1;
          break;
        case 3:
          counts.absent += 1;
          break;
        default:         
          break;
      }
    });
  
    setStatusCounts(counts);
  }, [attendanceList]);

const initializeSeats = () => {
  // 모든 좌석을 기본 상태로 초기화
  let newSeats: Seat[][] = Array.from({ length: rows }, () =>
    Array.from({ length: seatsPerRow }, (_, col) => ({
      id: `seat-${rows}-${col}`, 
      status: '0', 
      occupant: undefined
    }))
  );

  // attendanceList를 기반으로 좌석 할당
  attendanceList.forEach(attendee => {
    let rawPartIndex: number;

      if (attendee.part === 'Bass') {
          rawPartIndex = 12; // 'bass'일 경우 임시로 12번 부여
      } else {
          rawPartIndex = parseInt(attendee.part.replace(/\D/g, '')); // 파트 번호 추출
      }
    let partIndex = (rawPartIndex - 1) % 6; // 6열로 나누어서 열 위치 계산
    let startRow = rawPartIndex <= 6 ? 0 : 2; // 파트가 7 이상이면 3행(인덱스 2)부터 시작

      for (let row = startRow; row < rows; row++) {
        if (newSeats[row][partIndex] && !newSeats[row][partIndex].occupant) {
          newSeats[row][partIndex] = {
            ...newSeats[row][partIndex],
            occupant: attendee.nickName,
            status: attendee.isAttending== undefined ?  "0" : attendee.isAttending.toString() as SeatStatus
          };
          break;
        }
      }
    });
    setSeats(newSeats);
  };
  const colors = {
    pending: '#A9A9A970',   
    planned: '#00b38360', // 예정: 연두
    attended: '#00b383',  // 출석: 녹색
    absent: '#FF6347'     // 불참: 빨강
  };

  return (
    <>
    <Box className="seating-chart-container">
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
       {`${dayjs(todaySchedule?.startDate).format('MM월 DD일')} ${todaySchedule?.title}`}
      </Typography>
      <Typography variant="h6" sx={{ my: 2, mb:2 , textAlign: 'center' }}>
        출석 현황
      </Typography>
      <Box
      className='seatContainer'>
        {seats.map((row, rowIndex) => {
          // 각 행의 반경을 조절합니다.
          const rowRadius = 20 + rowIndex * (rowIndex >= 2 ? 25 : 20);
          return (
            <Box className="seat-row" style={{ bottom: `${rowRadius}px` }} key={rowIndex}>
              {row.map((seat, seatIndex) => {
                // 각 좌석의 회전 각도를 계산합니다.
                const seatAngle = (seatIndex - (seatsPerRow/ 2.4)) * 30;
                return (
                  <CheckSeat
                  key={seat.id}
                  status={seat.status}
                  className={'seat'}
                  onToggle={() => alert('클릭')}
                  occupant={seat.occupant}
                  sx={{
                    transform: `rotate(${seatAngle}deg) translateY(-${rowRadius}px)`,
                  }}
                />
                );
              })}
            </Box>
          );
        })}

      </Box>      
      <Box
      className="conductorIcon">
        <PersonIcon
        fontSize='inherit'/>
      </Box>
    </Box>
      <Box sx={{ pt: 7, pb: 4, textAlign: 'center', backgroundColor: '#fff' }}>
        <Box 
          className='legendBox'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>       
          <Box sx={{ textAlign: 'center' }}>
            <Circle sx={{ backgroundColor: colors.attended }}>{statusCounts.attended}</Circle>
            <Typography variant="caption">참석</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Circle sx={{ backgroundColor: colors.absent }}>{statusCounts.absent}</Circle>
            <Typography variant="caption">불참</Typography>
          </Box>       
        </Box>
      </Box>
    </>
  );
};

export default CheckSeatChart;