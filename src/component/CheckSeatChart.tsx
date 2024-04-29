// SeatingChart.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckSeat from './CheckSeat';
import CheckSeatLegend from './CheckSeatLegend';
import '../css/checkSeatChart.css'; // CSS 파일 임포트
import PersonIcon from '@mui/icons-material/Person';
type SeatStatus = 'available' | 'occupied' | 'selected';

interface Seat {
  id: string;
  status: SeatStatus;
}

let rows = 4;
let seatsPerRow = 6;
// 가로 6줄, 세로 4줄의 좌석을 생성하는 함수
const createInitialSeats = (): Seat[][] => {
  let seats: Seat[][] = [];

  for (let row = 0; row < rows; row++) {
    let seatRow: Seat[] = [];
    for (let seat = 0; seat < seatsPerRow; seat++) {
      seatRow.push({
        id: `seat-${row}-${seat}`,
        status: 'available', // 초기 상태 설정
      });
    }
    seats.push(seatRow);
  }
  return seats;
};

const SeatingChart: React.FC = () => {
  const [seats, setSeats] = useState<Seat[][]>(createInitialSeats());

  const toggleSeatStatus = (seatId: string) => {
    setSeats(seats.map(row =>
      row.map(seat => 
        seat.id === seatId ?
          { ...seat, status: seat.status === 'available' ? 'selected' : 'available' } :
          seat
      )
    ));
  };

  return (
    <Box className="seating-chart-container">
      <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
        출석 현황
      </Typography>
      {seats.map((row, rowIndex) => {
        // 각 행의 반경을 조절합니다.
        const rowRadius = 120 + rowIndex * 20;
        return (
          <Box className="seat-row" style={{ bottom: `${rowRadius}px` }} key={rowIndex}>
            {row.map((seat, seatIndex) => {
              // 각 좌석의 회전 각도를 계산합니다.
              const seatAngle = (seatIndex - (seatsPerRow/ 2.5)) * 25;
              return (
                <CheckSeat
                  key={seat.id}
                  status={seat.status}
                  className={'seat'}
                  onToggle={() => toggleSeatStatus(seat.id)}
                  sx={{
                    transform: `rotate(${seatAngle}deg) translateY(-${rowRadius}px)`,
                  }}
                />
              );
            })}
          </Box>
        );
      })}
      <Box
      className="conductorIcon">
        <PersonIcon
        fontSize='inherit'/>
      </Box>
      <CheckSeatLegend />
    </Box>
  );
};

export default SeatingChart;