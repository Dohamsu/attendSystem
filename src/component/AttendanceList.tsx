// components/AttendanceList.tsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadButton from './DownloadButton';

type Attendee = {
  name?: string;
  nickName?: string;
  part?: string;
  isAttending?: number;
  originalIndex: number; // 원본 배열에서의 인덱스를 저장
};


type AttendanceListProps = {
  attendanceList: Attendee[];
  updateAttendance: (index: number, status: number) => void; // 출석 상태를 업데이트하는 함수
};

type SortConfig = {
  field: keyof Attendee; // 'nickName', 'part', 'isAttending' 중 하나
  direction: 'asc' | 'desc';
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
  const [sortedAttendanceList, setSortedAttendanceList] = useState<Attendee[]>([]);
  const partOptions = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12", "Bass", "Conductor", "Etc"];
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (field: keyof Attendee) => {
    const isAsc = sortConfig?.field === field && sortConfig?.direction === 'asc';
    setSortConfig({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  useEffect(() => {
    let sorted = [...attendanceList].map((attendee, index) => ({
      ...attendee,
      originalIndex: index // 원본 배열의 인덱스 저장
    }));
  
    if (sortConfig) {
      // 사용자 지정 정렬 로직
      sorted.sort((a, b) => {
        let valA = String(a[sortConfig.field]);
        let valB = String(b[sortConfig.field]);
  
        const extractNumber = (text: string) => {
          const numericPart = text.match(/\d+/);
          return numericPart ? parseInt(numericPart[0], 10) : 0;
        };
  
        const numA = extractNumber(valA);
        const numB = extractNumber(valB);
        const textA = valA.replace(/\d+/, '');
        const textB = valB.replace(/\d+/, '');
  
        return textA === textB ?
          (numA < numB ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1) :
          (textA < textB ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1);
      });
    } else {
      // 기본 정렬 로직 (`partOptions` 기준)
      sorted.sort((a, b) => {
        const indexA = partOptions.indexOf(a.part || "Etc");
        const indexB = partOptions.indexOf(b.part || "Etc");
        return indexA - indexB;
      });
    }
    setSortedAttendanceList(sorted);
  }, [attendanceList, sortConfig]); // attendanceList 또는 sortConfig 변경 시 정렬 수행
  
  // sortConfig 초기화 (옵션에 따라)
  useEffect(() => {
    setSortConfig(null); // 초기에 partOptions 기준으로 정렬하도록 설정
  }, []);
  
  const handleClickOpen = (index: number, status: number) => {
    const originalIndex = sortedAttendanceList[index].originalIndex;
    
    setCurrentIndex(originalIndex); // 원본 배열의 인덱스 사용
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
        <Box
      sx={{
        height: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2
      }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight:'bold' }}>
        전체 명단
      </Typography>
     <DownloadButton/>
    </Box>
    <TableContainer component={Paper} 
      sx={{ 
      maxHeight: 580,
      mt: 0,
      margin:'auto',
      padding:1,
      width:'95%',
      overflow: 'auto',
      textAlign:'center',
    }}
      >
      <Table stickyHeader aria-label="simple table">
      <TableHead>
        <TableRow>
        <StyledTableCell onClick={() => handleSort('nickName')}>
          번호 
        </StyledTableCell>
        <StyledTableCell onClick={() => handleSort('nickName')}>
          닉네임 {sortConfig?.field === 'nickName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </StyledTableCell>
          <StyledTableCell onClick={() => handleSort('part')}>
            파트 {sortConfig?.field === 'part' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </StyledTableCell>
          <StyledTableCell onClick={() => handleSort('isAttending')}>
            상태 {sortConfig?.field === 'isAttending' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </StyledTableCell>
          <StyledTableCell>
            수정
          </StyledTableCell>
        </TableRow>
      </TableHead>

        <TableBody>
          {sortedAttendanceList.map((attendee, index) => (
            <TableRow key={index}>
              <StyledTableCell2>{index+1}</StyledTableCell2>
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
                       status === '2' ? '출' :
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
