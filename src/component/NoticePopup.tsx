import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import { Schedule } from "../stores/type";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
interface PopupDialogProps {
  apiEndpoint: string;
  title: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  ".MuiTypography-root": {
    fontSize: "0.825rem",
  },
  marginRight: "auto",
  marginLeft: "10px",
}));

const PopupDialog: React.FC<PopupDialogProps> = ({ apiEndpoint, title }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<Schedule[]>([]);
  const [dontShowToday, setDontShowToday] = useState(false);

    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);

  useEffect(() => {
    const fetchData = async () => {
      const today = dayjs().startOf('day');
      const dontShow = localStorage.getItem("dontShowPopup") === today.format("YYYY-MM-DD");
  
      if (dontShow) {
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get<Schedule[]>(apiEndpoint);
        const filteredSchedules = response.data.filter((schedule) => {
          const scheduleStartDate = dayjs(schedule.startTime).startOf('day');
          const scheduleEndDate = dayjs(schedule.endTime).endOf('day');
          return schedule.type === "공지" && today.isSameOrAfter(scheduleStartDate) && today.isSameOrBefore(scheduleEndDate);
        });
        setApiResponse(filteredSchedules);
        if (filteredSchedules.length > 0) {
          setOpen(true);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [apiEndpoint]);
  

  const handleClose = () => {
    if (dontShowToday) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("dontShowPopup", today);
    }
    setOpen(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowToday(event.target.checked);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', backgroundColor: '#f0f0f0' }}>
        <StyledFormControlLabel
          control={<Checkbox checked={dontShowToday} onChange={handleCheckboxChange} />}
          label="오늘 하루 보지 않기"
        />
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle sx={{ textAlign: 'center', marginTop:'15px',fontSize: "1rem", fontWeight: "bold" }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#735bf220', padding: '8px 16px', borderRadius: '4px' }}>
          공지사항
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : apiResponse.length > 0 ? (
          apiResponse.map((notice, index) => (
            <div key={index} style={{ textAlign: 'center', marginBottom: '90px', marginTop:'10px' }}>
              <Typography variant="h5" sx={{marginBottom:'40px'}}>{notice.title}</Typography>
              <Typography variant="body2">
                {notice.description}
              </Typography>
            </div>
          ))
        ) : (
          <DialogContentText>공지사항이 없습니다.</DialogContentText>
        )}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default PopupDialog;
