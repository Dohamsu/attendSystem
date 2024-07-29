import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { Box, Button, Container, Paper, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RootState } from '../stores/store';

const SERVER_URL = `${process.env.REACT_APP_API_SERVER_URI}`;

let socket: Socket;

interface Message {
  sender: string;
  text: string;
  profileImage: string; // 프로필 이미지 URL 추가
  timestamp: string; // 보낸 시간 추가
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const userName = userInfo?.name || '알수없는 무지';
  const profileImage = userInfo?.profileImage || ''; // 프로필 이미지 URL 가져오기
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    if (userInfo) {
      socket = io(SERVER_URL);

      socket.on('chat message', (msg: Message) => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, msg];
          localStorage.setItem('chatMessages', JSON.stringify(newMessages));
          return newMessages;
        });
        scrollToBottom();
      });

      socket.on('user count', (count) => {
        setUserCount(count);
      });

      return () => {
        socket.disconnect();
        socket.off('chat message');
        socket.off('user count');
      };
    }
  }, [userInfo]);

  const sendMessage = (text: string) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // 0시를 12시로 표시
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${ampm} ${formattedHours}:${formattedMinutes}`; // 포맷된 시간을 문자열로 변환

    const message = { sender: userName, text, profileImage, timestamp };
    socket.emit('chat message', message);
  };

  const clearMessages = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          잡담방
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            현재 접속자: {userCount}
          </Typography>
          <IconButton
            onClick={handleClickOpen}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Paper style={{ height: '470px', overflowY: 'scroll', padding: '10px', marginTop: 10, backgroundColor: '#acbfcf' }}>
        <MessageList messages={messages} currentUser={userName} />
        <div ref={messagesEndRef} />
      </Paper>
      <MessageInput sendMessage={sendMessage} />
      <Dialog
        open={open}
        onClose={handleClose}
      >
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
    </Container>
  );
};

export default ChatComponent;
