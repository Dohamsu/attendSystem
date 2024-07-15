// DownloadButton.tsx
import React, { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 임포트
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as XLSX from 'xlsx';


interface SampleData {
    [key: string]: any; // Fetch된 데이터의 구조에 맞게 타입을 수정하세요
  }
  
  const fetchSampleData = async (startDate: string, endDate: string): Promise<SampleData> => {
    const DOWNLOAD_SCHEDULE_API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/schedule/recordDownload`;
  
    const response = await fetch(`${DOWNLOAD_SCHEDULE_API_URL}?startDate=${startDate}&endDate=${endDate}`); // 여기에 실제 URL을 넣으세요
    const data = await response.json();
    return data;
  };
  
  const transformDataForExcel = (data: SampleData) => {
    const result: any[] = [];
    const dates = new Set<string>();
  
    // Collect all unique dates
    Object.values(data).forEach((entry: any) => {
      Object.keys(entry).forEach(date => {
        if (date !== 'part') {
          dates.add(date);
        }
      });
    });
  
    // Sort dates in ascending order
    const sortedDates = Array.from(dates).sort();
  
    // Create header
    const header = ['Name', 'Part', ...sortedDates];
    result.push(header);
  
    // Create rows
    Object.entries(data).forEach(([name, records]: [string, any]) => {
      const row = [name, records.part];
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
        XLSX.writeFile(workbook,`'출석_${startStr}~${endStr}.xlsx`);
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
