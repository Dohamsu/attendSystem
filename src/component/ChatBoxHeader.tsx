import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ChatBoxHeaderProps {
  userCount: number;
  handleClickOpen: () => void;
}

const ChatBoxHeader: React.FC<ChatBoxHeaderProps> = ({ userCount, handleClickOpen }) => (
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
);

export default ChatBoxHeader;
