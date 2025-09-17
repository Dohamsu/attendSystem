import React from 'react';
import "../css/editUserInfoDialog.css"; 

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../stores/userSlice';
import { RootState } from '../stores/store';
import {GoogleLogoutButton } from '../component/GoogleLogin';
import {KakaoLogoutButton } from '../component/KakaoLogin';
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import

interface User {
  _id?: string;
  socialLogin: string;
  name: string;
  nickName: string;
  number: string;
  part: string;
  email: string;
  platform: string;
}

interface EditUserInfoDialogProps {
  open: boolean;
  userInfo: User;
  onClose: () => void;
}

const EditUserInfoDialog: React.FC<EditUserInfoDialogProps> = ({ open, userInfo, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [number, setNumber] = React.useState(userInfo?.number || '');
    const [nickName, setNickName] = React.useState(userInfo?.nickName || '');
    const [part, setPart] = React.useState(userInfo?.part || '');
    const partOptions = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12", "Bass",  "ConcertMaster", "Conductor", "Etc"];

    const handleSave = () => {
      if (userInfo && userInfo._id) {
        const updatedUserInfo = {
          ...userInfo,
          number: number,
          nickName: nickName,
          part: part
        };

        dispatch(updateUser({ id: userInfo._id, data: updatedUserInfo }));
        alert("사용자 정보 변경이 완료되었습니다.");
      }
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} className="taskCard">
        <DialogTitle className="dialogTitle">내정보 수정</DialogTitle>
        <DialogContent className="dialogContent">
          <TextField
            autoFocus
            margin="dense"
            label="기수"
            type="text"
            fullWidth
            variant="outlined"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="textField"
          />
          <TextField
            autoFocus
            margin="dense"
            label="닉네임"
            type="text"
            fullWidth
            variant="outlined"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="textField"
          />
          <TextField
            select
            label="파트"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            margin="dense"
            fullWidth
            variant="outlined"
            className="textField"
          >
            {partOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions className="dialogActions">
          <Button onClick={onClose} className="button">취소</Button>
          <Button onClick={handleSave} color="primary" className="button">확인</Button>
        </DialogActions>
      </Dialog>
    );
};

export default EditUserInfoDialog;