import React from 'react';
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
  const [part, setPart] = React.useState(userInfo?.part || '');
  const partOptions = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12", "Bass"];

  const handleSave = () => {
    if (userInfo && userInfo._id) {
      const updatedUserInfo = {
        ...userInfo,
        number: number,
        part: part
      };

      dispatch(updateUser({ id: userInfo._id, data: updatedUserInfo }));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>내정보 수정</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="기수"
          type="text"
          fullWidth
          variant="outlined"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      <TextField
          select
          label="파트"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          margin="dense"
          fullWidth
          variant="outlined"
        >
          {partOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} color="primary">확인</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserInfoDialog;
