import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { Container, Paper } from '@mui/material';
import { RootState } from '../stores/store';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatBoxHeader';
import MessageDialog from './ChatBoxDialog';

const SERVER_URL = `${process.env.REACT_APP_API_SERVER_URI}`;

let socket: Socket;

interface Message {
  sender: string;
  text: string;
  profileImage: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const userName = userInfo?.name || '알수없는 무지';
  const profileImage = userInfo?.profileImage || '';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  
    if (userInfo) {
      socket = io(SERVER_URL, {
        query: { name: userInfo.name, profileImage: userInfo.profileImage },
      });
  
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
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${ampm} ${formattedHours}:${formattedMinutes}`;

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
      <ChatHeader userCount={userCount} handleClickOpen={handleClickOpen} />
      <Paper style={{ height: '470px', overflowY: 'scroll', padding: '10px', marginTop: 10, backgroundColor: '#acbfcf' }}>
        <MessageList messages={messages} currentUser={userName} />
        <div ref={messagesEndRef} />
      </Paper>
      <MessageInput sendMessage={sendMessage} />
      <MessageDialog open={open} handleClose={handleClose} clearMessages={clearMessages} />
    </Container>
  );
};

export default ChatBox;
