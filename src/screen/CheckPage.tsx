// CheckPage.tsx
import React, {useEffect, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import CheckSeatChart from "../component/CheckSeatChart";
import AttendanceList from "../component/AttendanceList";
import "../css/checkPage.css";
import {fetchSchedules, fetchAttendance, updateAttendance} from "../common/scheduleService";
import AttendanceScreen from "../component/AttendanceScreen";
import AttendanceResultScreen from "../component/AttendanceResultScreen";
import AttendHistory from "../component/AttendHistory";

import {Schedule, Attendance, Attendee} from "../stores/type";
import dayjs, {Dayjs} from "dayjs";
import {useSelector} from "react-redux";
const AttendStatusPage: React.FC = () => {
    const [attendanceList, setAttendanceList] = useState<Attendee[]>([]);
    const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);
    const [scheduleNumber, setScheduleNumber] = useState<string | null>("");
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [hasAttended, setHasAttended] = useState<boolean>(false);

    const currentUser = useSelector((state: any) => state.user.user);

    useEffect(() => {
        const initializeData = async () => {
            const schedules = await fetchSchedules();
            const now = dayjs();

            // 당일에 일치하거나 미래의 가장 가까운 날을 찾습니다.
            const sortedSchedules = schedules
                .filter(
                    (schedule) =>
                        dayjs(schedule.startDate).isSameOrAfter(now, "day") &&
                        schedule.type.includes("연습")
                )
                .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

            const todayOrNextSchedule =
                sortedSchedules.find((schedule) => dayjs(schedule.startDate).isSame(now, "day")) ||
                sortedSchedules[0];

            if (todayOrNextSchedule) {
                setScheduleNumber(todayOrNextSchedule.scheduleNumber);
                setTodaySchedule(todayOrNextSchedule);
                const fetchedAttendance = await fetchAttendance(todayOrNextSchedule.scheduleNumber);

                checkAttendanceStatus(fetchedAttendance, currentUser?.name);

                setAttendanceList(fetchedAttendance);
            } else {
                setScheduleNumber(null);
                setTodaySchedule(null);
            }
            setDataLoaded(true); // 데이터 로딩 완료
        };

        initializeData();
    }, []);

    const checkAttendanceStatus = (attendance: Attendee[], userName: string) => {
        const userAttendance = attendance.find((a) => a.name === userName);
        if (userAttendance && userAttendance.isAttending === 2) {
            setHasAttended(true);
        }
    };

    const handleAttend = async () => {
        if (currentUser && scheduleNumber) {
            await updateAttendance(scheduleNumber, currentUser.name, 2);
            const updatedList = attendanceList.map((attendee) =>
                attendee.name === currentUser.name ? {...attendee, isAttending: 2} : attendee
            );
            setAttendanceList(updatedList);
            setHasAttended(true);
        }
    };

    if (!dataLoaded) {
        // 데이터가 로드되기 전에는 로딩 인디케이터 또는 아무것도 렌더링하지 않음
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!dataLoaded) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        ); // 로딩 상태 표시
    }

    if (!todaySchedule) {
        return (
            <Box sx={{textAlign: "center", my: 4, mt: 45}}>
                <Typography variant="h4">예정된 일정이 없습니다.</Typography>
            </Box>
        );
    }

    return (
        <>
            <div className="calendar-container">
                <div className="calendar-item">
                    <Box sx={{pt: 1}}>
                        <Typography variant="h4" sx={{textAlign: "center", my: 4}}>
                            {`${dayjs(todaySchedule.startDate).format("MM월 DD일")}`}
                        </Typography>
                        <Typography variant="h4" sx={{textAlign: "center", my: 4}}>
                            {todaySchedule.title}
                        </Typography>
                        {hasAttended ? (
                            <AttendanceResultScreen />
                        ) : (
                            <AttendanceScreen
                                todaySchedule={todaySchedule}
                                onAttend={handleAttend}
                            />
                        )}
                        <hr></hr>
                        <AttendHistory />
                    </Box>
                </div>
                <div className="calendar-item">
                    <CheckSeatChart todaySchedule={todaySchedule} attendanceList={attendanceList} />
                </div>
            </div>
        </>
    );
};

export default AttendStatusPage;
