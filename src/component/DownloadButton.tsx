import React, { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 임포트
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as XLSX from 'xlsx';

interface SampleData {
  [key: string]: any;
}

const fetchSampleData = async (startDate: string, endDate: string): Promise<SampleData> => {
  const DOWNLOAD_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule/recordDownload`;

  const response = await fetch(`${DOWNLOAD_SCHEDULE_API_URL}?startDate=${startDate}&endDate=${endDate}`);
  const data = await response.json();
  return data;
};

const transformDataForExcel = (data: SampleData) => {
  const result: any[] = [];
  const dates = new Set<string>();

  // 모든 날짜를 수집
  Object.values(data).forEach((entry: any) => {
    Object.keys(entry).forEach(date => {
      if (date !== 'part' && date !== 'participant' && date !== 'participantAll') {
        dates.add(date);
      }
    });
  });

  // 날짜를 오름차순으로 정렬
  const sortedDates = Array.from(dates).sort();

  // 헤더 생성
  const header = ['NickName', 'Part', '재학생 연습', '전체 연습', ...sortedDates]; // 'Name'을 'NickName'으로 수정
  result.push(header);

  // 행 생성
  Object.entries(data).forEach(([name, records]: [string, any]) => {
    const row = [
      records.nickName,           // nickName 사용
      records.part, 
      records.participant,        // '재학생 연습' 열에 해당
      records.participantAll      // '전체 연습' 열에 해당
    ];
    sortedDates.forEach(date => {
      row.push(records[date] !== undefined ? records[date] : 'X');
    });
    result.push(row);
  });

  return result;
};

const DownloadButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = async () => {
    if (startDate && endDate) {
      const startStr = startDate.format('YYYY-MM-DD');
      const endStr = endDate.format('YYYY-MM-DD');
      const data = await fetchSampleData(startStr, endStr);
      const transformedData = transformDataForExcel(data);
      const worksheet = XLSX.utils.aoa_to_sheet(transformedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "출석이력");
      XLSX.writeFile(workbook, `출석_${startStr}~${endStr}.xlsx`);
      handleClose();
    }
  };

  return (
    <>
      <Button onClick={handleClickOpen}>
        다운로드
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>날짜 범위 선택</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="시작 날짜"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="종료 날짜"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleDownload} disabled={!startDate || !endDate}>다운로드</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadButton;
