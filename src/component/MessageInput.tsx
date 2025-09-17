import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface MessageInputProps {
  sendMessage: (msg: string) => void;
}

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const escapedInput = escapeHtml(input);
      sendMessage(escapedInput);
      setInput('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) { // 최대 글자 수 제한
      setInput(e.target.value);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', marginTop: '10px' }}>
      <TextField
        variant="outlined"
        value={input}
        onChange={handleChange}
        fullWidth
        autoComplete="off"
        inputProps={{ maxLength: 100, style: { fontSize: '14px' } }} // 최대 글자 수와 폰트 크기 설정
        sx={{
          fontSize: '14px',
          padding: 0, // 패딩 조정
          '& .MuiInputBase-root': {
            height: '40px', // 높이 설정
            padding: '0 8px', // 내부 패딩 조정
          },
          '& .MuiOutlinedInput-input': {
            padding: '8px', // 입력 필드 패딩 조정
          }
        }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: '10px', height: '40px' }}>
        전송
      </Button>
    </Box>
  );
};

export default MessageInput;
