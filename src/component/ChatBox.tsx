import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { Box, Button, Container, Paper } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RootState } from '../stores/store';

const SERVER_URL =`${process.env.REACT_APP_API_SERVER_URI}`;

const socket: Socket = io(SERVER_URL);

interface Message {
  sender: string;
  text: string;
  profileImage: string; // 프로필 이미지 URL 추가
  timestamp: string; // 보낸 시간 추가
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const userInfo = useSelector((state: RootState) => state.user.user);
  const userName = userInfo?.name || '알수없는 무지';
  const profileImage = userInfo?.profileImage || ''; // 프로필 이미지 URL 가져오기
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    socket.on('chat message', (msg: Message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, msg];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
      scrollToBottom();
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (text: string) => {
    const timestamp = new Date().toLocaleTimeString().substring(0,7); // 현재 시간을 문자열로 변환
    const message = { sender: userName, text, profileImage, timestamp };
    socket.emit('chat message', message);
  };

  const clearMessages = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container>
      <Paper style={{ height: '470px', overflowY: 'scroll', padding: '10px', marginTop: 10, backgroundColor:'grey' }}>
        <MessageList messages={messages} currentUser={userName} />
        <div ref={messagesEndRef} />
      </Paper>
      <MessageInput sendMessage={sendMessage} />
      <Button variant="contained" color="secondary" onClick={clearMessages} style={{ marginTop: '10px' }}>
        Clear Messages
      </Button>
    </Container>
  );
};

export default ChatComponent;
