// components/AttendanceList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

type Attendee = {
  name?: string;
  nickName?: string;
  part?: string;
  isAttending?: number;
};

type AttendanceListProps = {
  attendanceList: Attendee[];
};

const AttendanceList: React.FC<AttendanceListProps> = ({ attendanceList }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>닉네임</TableCell>
            <TableCell>파트</TableCell>
            <TableCell>출석 여부</TableCell>
            <TableCell>수정</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceList.map((attendee, index) => (
            <TableRow key={index}>
              <TableCell>{attendee.name}</TableCell>
              <TableCell>{attendee.nickName}</TableCell>
              <TableCell>{attendee.part}</TableCell>
              <TableCell>{attendee.isAttending === 1 ? '출석' : attendee.isAttending === 2 ? '미정' : '불참'}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">수정</Button>
              </TableCell>
            </TableRow>
          ))}
           {attendanceList.map((attendee, index) => (
            <TableRow key={index}>
              <TableCell>{attendee.name}</TableCell>
              <TableCell>{attendee.nickName}</TableCell>
              <TableCell>{attendee.part}</TableCell>
              <TableCell>{attendee.isAttending === 1 ? '출석' : attendee.isAttending === 2 ? '미정' : '불참'}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">수정</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceList;
