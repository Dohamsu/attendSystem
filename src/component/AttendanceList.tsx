// components/AttendanceList.tsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, makeStyles, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';

type Attendee = {
  name?: string;
  nickName?: string;
  part?: string;
  isAttending?: number;
};

type AttendanceListProps = {
  attendanceList: Attendee[];
  updateAttendance: (index: number, status: number) => void; // 출석 상태를 업데이트하는 함수
};


const StyledTableCell = styled(TableCell)({
  width: '20%',
  padding: '5px',
  fontSize: '0.7rem',
  textAlign: 'center',
});

const StyledTableCell2 = styled(TableCell)({
  width: '15%',
  padding: '5px',
  fontSize: '0.8rem',
  textAlign: 'center',
  maxWidth: '60px', // 셀의 최대 너비를 설정합니다.
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});




const AttendanceList: React.FC<AttendanceListProps> = ({ attendanceList, updateAttendance }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);

  const handleClickOpen = (index: number, status: number) => {
    setCurrentIndex(index);
    setCurrentStatus(status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (currentIndex !== null && currentStatus !== null) {
      updateAttendance(currentIndex, currentStatus);
    }
    handleClose();
  };


  return (
    <>
    <TableContainer component={Paper} sx={{ maxHeight: 280, overflow: 'auto' }}>
      <Table stickyHeader aria-label="simple table">
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

              <StyledTableCell2>
                <Box
                    sx={{
                      display: 'inline-block', // 같은 줄에 표시
                      backgroundColor: attendee.isAttending === 0 ? '#FFA500' :
                                      attendee.isAttending === 1 ? '#00b38360' :
                                      attendee.isAttending === 2 ? '#00b383' : '#FF6347',
                      borderRadius: '50%',
                      height: '20px',
                      width: '20px',
                      verticalAlign: 'middle', // 수직 중앙 정렬
                    }}
                  />
              </StyledTableCell2>
              <StyledTableCell2 sx={{ textAlign: 'center', maxWidth:'100px !important', marginRight:'5px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                  {['0', '1', '2', '3'].map(status => (
                    <Box
                      key={status}
                      sx={{
                        width: 20,
                        height: 20,
                        color:'white',
                        backgroundColor: status === '0' ? '#FFA500' :
                                        status === '1' ? '#00b38360' :
                                        status === '2' ? '#00b383' :
                                        '#FF6347',
                        opacity: attendee.isAttending?.toString() === status ? 1 : 0.1,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleClickOpen(index, parseInt(status))}
                    >
                        {status === '0' ? '미' :
                       status === '1' ? '예' :
                       status === '2' ? '참' :
                       '불'}
                    </Box>                    
                  ))}
                </Box>
              </StyledTableCell2>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"출석 상태를 변경하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            단원의 출석 상태가 변경됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            아니오
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttendanceList;
