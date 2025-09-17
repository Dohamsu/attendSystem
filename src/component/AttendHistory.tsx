import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { fetchSchedules } from "../common/scheduleService";
import { Schedule, RootState } from "../stores/type";
import dayjs from "dayjs";

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
            } catch (error) {
                console.error("Failed to fetch schedules:", error);
                setDataLoaded(true);
            }
        };

        if (userInfo?.name) {
            loadData();
        }
    }, [userInfo?.name]);

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h6" ml={3} mb={2}>
                출석 이력
            </Typography>
            <Box sx={{ width:'85%', display: "flex", overflowX: "scroll", ml: 3, whiteSpace: "nowrap" }}>
                {dataLoaded ? (
                    allSchedules.map((schedule) => (
                        <Box key={schedule.scheduleNumber} sx={{ m: 1, display: "inline-block" }}>
                            {schedule.isAttending === 2 ? (
                                <EventAvailableIcon sx={{ fontSize: 30, color: "#00B383" }} /> // 출석 완료 - 진한 초록색
                            ) : schedule.isAttending === 3 ? (
                                <EventAvailableIcon sx={{ fontSize: 30, color: "#FF6347" }} /> // 불참 - 빨간색
                            ) : schedule.isAttending === 1 ? (
                                <EventIcon sx={{ fontSize: 30, color: "#00B38380" }} /> // 출석 예정 - 연한 초록색 (반투명)
                            ) : (
                                <EventIcon sx={{ fontSize: 30, color: "#FFA500" }} /> // 미정 - 주황색
                            )}
                            <Typography variant="caption" sx={{ display: "block" }}>
                                {dayjs(schedule.startDate).format("MM/DD")}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Box>
    );
};

export default AttendHistory;
