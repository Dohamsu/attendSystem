import React from "react";
import {Box, Typography, Avatar} from "@mui/material";

interface Message {
    sender: string;
    text: string;
    profileImage: string; // 프로필 이미지 URL 추가
    timestamp: string; // 보낸 시간 추가
}

interface MessageListProps {
    messages: Message[];
    currentUser: string;
}

const MessageList: React.FC<MessageListProps> = ({messages, currentUser}) => {
    return (
        <Box>
            {messages.map((msg, index) => (
                <Box
                    key={index}
                    sx={{
                        display: msg.sender === currentUser ? "block" : "flex",
                        textAlign: msg.sender === currentUser ? "right" : "left",
                        padding: "5px",
                    }}
                >
                    <Box display="flex">
                        {msg.sender !== currentUser && (
                            <Avatar
                                alt={msg.sender}
                                src={msg.profileImage} // 프로필 이미지 URL 사용
                                sx={{width: 32, height: 32, marginRight: "10px"}}
                            />
                        )}
                    </Box>
                    <Box sx={{}}>
                        <Box>
                            {msg.sender !== currentUser && (
                                <Typography variant="caption" color="textSecondary">
                                    {msg.sender}
                                </Typography>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display:'flex', 
                                flexDirection:  msg.sender === currentUser ?  "row-reverse" : "row",
                                justifyContent: "flex-start" ,
                                alignItems: "self-end",
                                gap:1
                            }}
                        >
                            <Box
                                sx={{
                                    display: "inline-block",
                                    textAlign: "left",
                                    padding: "10px",
                                    marginTop: "2px",
                                    borderRadius: "5px",
                                    backgroundColor:
                                        msg.sender === currentUser ? "#DCF8C6" : "#FFF",
                                    maxWidth: "80%",
                                    boxShadow: 0,
                                    wordBreak: "break-word",
                                }}
                            >
                                <Typography variant="body1" sx={{lineHeight: 1.2, fontSize: 14}}>
                                    {msg.text}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{display: "block", marginTop: "2px"}}
                                >
                                    {msg.timestamp}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;
