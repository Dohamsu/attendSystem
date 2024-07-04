import React, {useEffect, useState} from "react";
import {Box, Button, Typography, CircularProgress} from "@mui/material";
import SmileIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SplashImg from "../images/splash.png";
import dayjs from "dayjs";
import {Schedule} from "../stores/type"; // 'Attendance' 타입도 필요하면 추가

interface AttendanceScreenProps {
    onAttend: () => void;
    todaySchedule: Schedule | null; // todaySchedule를 prop으로 받습니다.
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({onAttend, todaySchedule}) => {
    const [timeLeft, setTimeLeft] = useState<string | null>(null); // 초기값을 null로 설정
    const [timePassed, setTimePassed] = useState<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

    useEffect(() => {
        const updateTimeLeft = () => {
            const now = dayjs();
            const startTime = dayjs(todaySchedule?.startTime);
            const endTime = dayjs(todaySchedule?.endTime);
            const secondsLeft = startTime.diff(now, "second");

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
                setButtonActive(secondsLeft <= 3600); // 1시간 이내일 경우 버튼 활성화
            } else {
                // 출석 시간이 지난 경우
                const secondsPassed = Math.abs(secondsLeft);
                // 시간이 지난 후 1시간 이내인 경우
                if (secondsPassed <= 3600) {
                    const minutes = Math.floor(secondsPassed / 60);
                    const seconds = secondsPassed % 60;
                    setTimeLeft(` ${minutes}분 ${seconds}초 지각`);
                    setButtonActive(true); // 1시간 이내일 경우 버튼 활성화
                } else {
                    setTimeLeft("출석 시간이 지났습니다.");
                    setButtonActive(false);
                }
                setTimePassed(true);
            }
            setLoading(false); // 데이터 업데이트 후 로딩 상태를 false로 설정
        };

        const timer = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [todaySchedule]);

    return (
        <Box sx={{textAlign: "center", padding: 0, minHeight: 250}}>
            {loading ? (
                <>
                    <Box sx={{width:'100%', pt:'20%'}}>
                        <CircularProgress />
                    </Box>
                </>
            ) : (
                timeLeft !== null && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onAttend}
                            disabled={!buttonActive}
                            sx={{mt: 0, mb: 3, height: 100, width: 100, fontSize: 30}}
                        >
                            출석
                        </Button>
                        {!timePassed && <Typography variant="body1">출석시간까지</Typography>}
                        <Typography variant="h4" sx={{my: 2}}>
                            {timeLeft}
                        </Typography>
                    </>
                )
            )}
        </Box>
    );
};

export default AttendanceScreen;
