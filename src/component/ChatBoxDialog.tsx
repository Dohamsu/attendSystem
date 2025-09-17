import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ChatBoxDialogProps {
  open: boolean;
  handleClose: () => void;
  clearMessages: () => void;
}

const ChatBoxDialog: React.FC<ChatBoxDialogProps> = ({ open, handleClose, clearMessages }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>대화 내용 삭제</DialogTitle>
    <DialogContent>
      <DialogContentText>
        대화 내용을 삭제하시겠습니까?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        취소
      </Button>
      <Button onClick={clearMessages} color="primary" autoFocus>
        삭제
      </Button>
    </DialogActions>
  </Dialog>
);

export default ChatBoxDialog;
