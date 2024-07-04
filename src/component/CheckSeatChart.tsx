// CheckSeatChart.tsx
import React, { useEffect, useState } from 'react';
import { Box, styled, Typography } from '@mui/material';
import CheckSeat from './CheckSeat';
import ArrowNavigation from './ArrowNavigation';  // ArrowNavigation 컴포넌트 임포트
import { Schedule, Attendee } from '../stores/type';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // 미래 날짜 비교를 위해 필요한 플러그인
import '../css/checkSeatChart.css';
import PersonIcon from '@mui/icons-material/Person';

dayjs.extend(isSameOrAfter); // 플러그인 확장

type CheckSeatChartProps = {
  todaySchedule: Schedule | null;
  attendanceList: Attendee[];
  onPreviousSchedule: () => void;
  onNextSchedule: () => void;
  disablePrevious: boolean;
  disableNext: boolean;
};

type SeatStatus = '0' | '1' | '2' | '3';

interface Seat {
  id: string;
  status: SeatStatus;
  occupant?: string;
  part?: string;
}

const PartBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  mt: 2,
  p: 2,
  border: '1.5px solid #ccc',
  margin: 0,
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '0 10px',
    zIndex: 1,
  },
  '&::after': {
    content: 'attr(data-part)',
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '0 10px',
    zIndex: 2,
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#999999',
  }
}));

const SmallPartBox = styled(PartBox)(({ theme }) => ({
  gridColumn: 'span 6',
  flexDirection: 'row',
  justifyContent: 'center',
  height: 'auto'
}));

const Circle = styled(Box)(({ theme }) => ({
  borderRadius: '100%',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
  color: 'white',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  boxShadow: '2px 2px 10px 0px rgba(0, 0, 0, 0.3)'
}));

const partsTop = ['G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
const partsBottom = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
const parts = ['Bass', ...partsTop, ...partsBottom, 'ConcertMaster'];
const maxSeatsPerPart = 5;

const CheckSeatChart: React.FC<CheckSeatChartProps> = ({ todaySchedule, attendanceList, onPreviousSchedule, onNextSchedule, disablePrevious, disableNext }) => {
  const [seats, setSeats] = useState<Record<string, Seat[]>>(initializeSeats());
  const [statusCounts, setStatusCounts] = useState({ pending: 0, planned: 0, attended: 0, absent: 0 });
  const [conductorStatus, setConductorStatus] = useState<SeatStatus>('0');

  useEffect(() => {
    updateAttendance();
  }, [attendanceList]);

  function initializeSeats() {
    const seats: Record<string, Seat[]> = {};

    parts.forEach(part => {
      seats[part] = Array.from({ length: maxSeatsPerPart }, (_, index) => ({
        id: `${part}-${index}`,
        status: '0',
        occupant: undefined,
        part: part,
      }));
    });

    return seats;
  }

  function updateAttendance() {
    const counts = { pending: 0, planned: 0, attended: 0, absent: 0 };
    const newSeats = initializeSeats();
    let conductorStatus: SeatStatus = '0';

    attendanceList.forEach(attendee => {
      const part = attendee.part;
      if (part === 'Conductor') {
        conductorStatus = attendee.isAttending?.toString() as SeatStatus;
      } else if (newSeats[part]) {
        const seatIndex = newSeats[part].findIndex(seat => !seat.occupant);
        if (seatIndex !== -1) {
          newSeats[part][seatIndex] = {
            ...newSeats[part][seatIndex],
            occupant: attendee.nickName,
            status: attendee.isAttending == undefined ? '0' : attendee.isAttending.toString() as SeatStatus,
          };
        }
      }

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

    setSeats(newSeats);
    setStatusCounts(counts);
    setConductorStatus(conductorStatus);
  }

  const colors = {
    pending: '#A9A9A970',
    planned: '#00b38360', // 예정: 연두
    attended: '#00b383',  // 출석: 녹색
    absent: '#FF6347'     // 불참: 빨강
  };

  return (
    <Box className="seating-chart-container" sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', p: 4 }}>
        <ArrowNavigation
          onPrevious={onPreviousSchedule}
          onNext={onNextSchedule}
          disablePrevious={disablePrevious}
          disableNext={disableNext}
          title={`${todaySchedule?.title}`} 
          date={`${dayjs(todaySchedule?.startDate).format('M월 D일')}`}        
        />
      </Box>
      <Box sx={{ pt: 1, px: 2, height: 'auto', minHeight: '350px', overflow: 'scroll', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
        <SmallPartBox key="Bass" data-part="Bass">
          {seats["Bass"].map((seat, index) => (
            <Box key={seat.id} alignItems="center" sx={{ border: 0, pt: 0,height: '20px !important' }}>
              <CheckSeat
                status={seat.status}
                className={'seat'}
                onToggle={() => (alert('클릭'))}
                occupant={seat.occupant}
                sx={{ 
                  ...(seat.occupant && index > 0 && { ml: '10px' })
                }}
              />
            </Box>
          ))}
        </SmallPartBox>
        {partsTop.map((part) => (
          <PartBox key={part} data-part={part}>
            {seats[part].map(seat => (
              <Box key={seat.id} alignItems="center" sx={{ border: 0, pt: 1 }}>
                <CheckSeat
                  status={seat.status}
                  className={'seat'}
                  onToggle={() => alert('클릭')}
                  occupant={seat.occupant}
                />
              </Box>
            ))}
          </PartBox>
        ))}
        {partsBottom.map((part) => (
          <PartBox key={part} data-part={part}>
            {seats[part].map(seat => (
              <Box key={seat.id} alignItems="center" sx={{ border: 0, pt: 1 }}>
                <CheckSeat
                  status={seat.status}
                  className={'seat'}
                  onToggle={() => alert('클릭')}
                  occupant={seat.occupant}
                />
              </Box>
            ))}
          </PartBox>
        ))}
        <SmallPartBox key="ConcertMaster" data-part="ConcertMaster">
          {seats["ConcertMaster"].map(seat => (
            <Box key={seat.id} alignItems="center" sx={{ border: 0, pt: 0, height: '20px !important' }}>
              <CheckSeat
                status={seat.status}
                className={'seat'}
                onToggle={() => alert('클릭')}
                occupant={seat.occupant}
              />
            </Box>
          ))}
        </SmallPartBox>
      </Box>
      <Box className={`conductorIcon conductor-status-${conductorStatus}`} 
      sx={{textAlign:'center',width:'100%', pt:3}}>
        <PersonIcon fontSize='inherit' />
      </Box>
      <Box sx={{ pt: 2, pb: 4, textAlign: 'center', backgroundColor: '#fff' }}>
        <Box
          className='legendBox'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Circle sx={{ backgroundColor: colors.planned }}>{statusCounts.planned}</Circle>
            <Typography variant="caption">예정</Typography>
          </Box>
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
    </Box>
  );
};

export default CheckSeatChart;
