import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { fetchSchedules } from '../common/scheduleService';
import { Schedule, RootState } from '../stores/type';
import dayjs, { Dayjs } from 'dayjs';

const AttendHistory: React.FC = () => {
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const userInfo = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const loadData = async () => {
      try {
        const schedules = await fetchSchedules(userInfo?.name); // API 호출은 사용자 이름을 기반으로 하고 있습니다.
        setAllSchedules(schedules);
        setDataLoaded(true);
        console.log(schedules);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        setDataLoaded(true);
      }
    };

    if (userInfo?.name) {
      loadData();
    }
  }, [userInfo?.name]);

  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h5" mb={2}>
        출석 이력
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {dataLoaded ? allSchedules.map(schedule => (
          <Box key={schedule.scheduleNumber} sx={{ m: 1 }}>
        {schedule.isAttending === 1 ? (
            <EventAvailableIcon color="success" sx={{ fontSize: 40 }} />  // 초록색으로 표시
            ) : schedule.isAttending === 3 ? (
            <EventAvailableIcon color="error" sx={{ fontSize: 40 }} />     // 빨간색으로 표시
            ) : schedule.isAttending === 2 ? (
            <EventIcon color="disabled" sx={{ fontSize: 40 }} />           // 회색으로 표시
            ) : (
            <EventIcon sx={{ fontSize: 40 }} />                            // 기본 회색 (출석하지 않음)
            )}
            <Typography variant="caption" sx={{ display: 'block' }}>
              {dayjs(schedule.startDate).format('MM/DD')}
            </Typography>
          </Box>
        )) : <Typography>Loading...</Typography>}
      </Box>
    </Box>
  );
};

export default AttendHistory;
