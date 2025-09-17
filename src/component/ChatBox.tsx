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
  const [scrollBehavior, setScrollBehavior] = useState<'auto' | 'smooth'>('auto'); // 초기에는 'auto'로 설정

  useEffect(() => {
    if (userInfo) {
      socket = io(SERVER_URL, {
        query: { name: userInfo.name, profileImage: userInfo.profileImage },
      });

      // 이전 메시지를 서버로부터 로드
      socket.on('previous messages', (msgs: Message[]) => {
        setMessages(msgs);
        console.log('이전 메시지 로드');
        scrollToBottom();
      });

      // 새로운 채팅 메시지를 수신
      socket.on('chat message', (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        console.log('최신  로드');

        scrollToBottom();
      });

      socket.on('user count', (count) => {
        setUserCount(count);
      });

      // 2초 후에 스크롤 속성을 'smooth'로 변경
      setTimeout(() => {
        setScrollBehavior('smooth');
      }, 3000);

      return () => {
        socket.disconnect();
        socket.off('previous messages');
        socket.off('chat message');
        socket.off('user count');
      };
    }
  }, [userInfo]);

  const sendMessage = (text: string) => {
    const message = { text }; // 클라이언트에서 메시지와 보낸 사람만 전송
    socket.emit('chat message', message);
  };

  const clearMessages = () => {
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
    messagesEndRef.current?.scrollIntoView({ behavior: scrollBehavior });
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
