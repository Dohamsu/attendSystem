// components/AttendanceList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, makeStyles, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type Attendee = {
  name?: string;
  nickName?: string;
  part?: string;
  isAttending?: number;
};

type AttendanceListProps = {
  attendanceList: Attendee[];
};


const StyledTableCell = styled(TableCell)({
  width: '20%',
  padding: '10px',
  fontSize: '1rem',
  textAlign: 'center',
});

const StyledTableCell2 = styled(TableCell)({
  width: '17%',
  padding: '5px',
  fontSize: '0.8rem',
  textAlign: 'center',
  maxWidth: '90px', // 셀의 최대 너비를 설정합니다.
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});


const AttendanceList: React.FC<AttendanceListProps> = ({ attendanceList }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>이름</StyledTableCell>
            <StyledTableCell>닉네임</StyledTableCell>
            <StyledTableCell>파트</StyledTableCell>
            <StyledTableCell>상태</StyledTableCell>
            <StyledTableCell>수정</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceList.map((attendee, index) => (
            <TableRow key={index}>
              <StyledTableCell2>{attendee.name}</StyledTableCell2>
              <StyledTableCell2>{attendee.nickName}</StyledTableCell2>
              <StyledTableCell2>{attendee.part}</StyledTableCell2>
              <StyledTableCell2
              sx={{
                textAlign:'center'
              }}>
                    <Box
                    sx={{
                      backgroundColor: attendee.isAttending === 0 ? '#FFA500' : 
                                      attendee.isAttending === 1 ? '#00b38360' :
                                      attendee.isAttending === 2 ? '#00b383' : '#FF6347',
                      borderRadius: '100%',
                      margin:'10px',
                      height:'20px',
                      color:'white',
                      width:'20px',
                      marginLeft:'30%',
                    }}
                    >
                        {/* {attendee.isAttending === 0 ? '미정' :
                        attendee.isAttending === 1 ? '출석 예정' :
                        attendee.isAttending === 2 ? '출석' :
                        '불참'} */}

                    </Box>
              </StyledTableCell2>
              <StyledTableCell2>
                <Button variant="contained" color="primary">수정</Button>
              </StyledTableCell2>
            </TableRow>
          ))}          
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceList;
