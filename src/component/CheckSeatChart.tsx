// SeatingChart.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckSeat from './CheckSeat';
import CheckSeatLegend from './CheckSeatLegend';
import { fetchSchedules, fetchAttendance } from '../common/scheduleService';
import { Schedule, Attendance , Attendee} from '../stores/type';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // 미래 날짜 비교를 위해 필요한 플러그인
import '../css/checkSeatChart.css'; // CSS 파일 임포트
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

dayjs.extend(isSameOrAfter); // 플러그인 확장

let rows = 4;
let seatsPerRow = 6;
// 가로 6줄, 세로 4줄의 좌석을 생성하는 함수
const CheckSeatChart: React.FC<CheckSeatChartProps> = ({ todaySchedule, attendanceList }) => {
  const [seats, setSeats] = useState<Seat[][]>([]);

  useEffect(() => {
    initializeSeats();
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
      let partIndex = parseInt(attendee.part.replace('th', '')) - 1;
      // console.log();
      for (let row = 0; row < rows; row++) {
        if (newSeats[row][partIndex] && !newSeats[row][partIndex].occupant) {
          newSeats[row][partIndex] = {
            ...newSeats[row][partIndex],
            occupant: attendee.nickName,
            status: attendee.isAttending.toString() as SeatStatus
          };
          break;
        }
      }
    });
    setSeats(newSeats);
  };



  return (
    <Box className="seating-chart-container">
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
       {`${dayjs(todaySchedule?.startDate).format('MM월 DD일')} ${todaySchedule?.title}`}
      </Typography>
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
        출석 현황
      </Typography>
      <Box
      className='seatContainer'>
        {seats.map((row, rowIndex) => {
          // 각 행의 반경을 조절합니다.
          const rowRadius = 20 + rowIndex * 20;
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
      <CheckSeatLegend />
    </Box>
  );
};

export default CheckSeatChart;