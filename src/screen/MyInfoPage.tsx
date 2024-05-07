import * as React from "react";
import { Box, Typography } from '@mui/material';
import "../css/myInfoPage.css"; 
import profileBackground from '../images/profileBackground.png';
import profileSample from '../images/profileSample.png';
import editBtn from '../images/editBtn.svg';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupsIcon from '@mui/icons-material/Groups';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import { RootState } from '../stores/store';
import EditUserInfoDialog from '../component/EditUserInfoDialog'; // 가정된 EditUserInfoDialog 컴포넌트의 경로
import {GoogleLogoutButton } from '../component/GoogleLogin';
import {KakaoLogoutButton } from '../component/KakaoLogin';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LinkIcon from '@mui/icons-material/Link';
import kakaoIcon from "../images/kakao_icon.png";
import googleIcon from "../images/google_icon.png";
import { useSelector } from 'react-redux';

import '../css/myInfoPage.css';


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

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <Box className="section">
    <Typography variant="h6" className="section-title">{title}</Typography>
    {children}
  </Box>
);

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value }) => (
  <Box className="setting-item">
    <Box className="setting-item-content">
      {icon}
      <Typography className="setting-item-label">{label}</Typography>
    </Box>
    {value && <Typography className="setting-item-value">{value}</Typography>}
  </Box>
);

const MyInfoPage: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.user); // state.user.user는 예시입니다. 실제 상태 경로에 맞게 조정하세요.

  const settings = [
    { icon: <EmailIcon />, label: "이메일", value: userInfo?.email||'sample@naver.com' },
    { icon: <AudiotrackIcon />, label: "파트", value: userInfo?.part },
    { icon: <AccountBoxIcon />, label: "닉네임", value: userInfo?.nickName },
    { icon: <GroupsIcon />, label: "기수", value: userInfo?.number },
    { icon: <LinkIcon />, label: "소셜 로그인", value: userInfo?.socialLogin },
  ];


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="profile-settings">
      <img className="profileBackground" src={profileBackground} alt="Profile Background" />
      <Box className="moreIconBtn" onClick={handleClickOpen}>
         <EditNoteIcon/>
      </Box>
      {userInfo && <EditUserInfoDialog open={open} userInfo={userInfo} onClose={handleClose} />}

      <Box className="profileBox">
        <img className="profileImg" src={profileSample} alt="Profile Sample" />
        <img className="editBtn" src={editBtn} alt="Edit Button" />
        <Typography variant="h1" className="profile-name">{userInfo?.name}</Typography>
        <Typography className="profile-email">{userInfo?.email || 'sample@naver.com'}</Typography>
      </Box>

      <Section title="">
        {settings.map((setting, index) => (
          <SettingItem key={index} {...setting} />
        ))}
      </Section>

      {/* <Typography className="profile-logout"> 로그아웃</Typography> */}

      {userInfo?.platform === 'google' && <GoogleLogoutButton />}
      {userInfo?.platform === 'kakao' && <KakaoLogoutButton />}

    </Box>
  );
};

export default MyInfoPage;
