// pages/MyInfoPage.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import "../css/myInfoPage.css";
import { RootState } from '../stores/store';

const MyInfoPage: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user);

  return (
    <div className="my-info-page">
      <div className="user-info-section">
        <h2>내 정보</h2>
        <div className="user-info">
          <div className="info-item">
            <span className="info-title">로그인 플랫폼:</span>
            <span className="info">{userInfo.socialLogin}</span>
          </div>
          <div className="info-item">
            <span className="info-title">이름:</span>
            <span className="info">{userInfo.name}</span>
          </div>
          <div className="info-item">
            <span className="info-title">기수:</span>
            <span className="info">{userInfo.number}</span>
          </div>
          <div className="info-item">
            <span className="info-title">파트:</span>
            <span className="info">{userInfo.part}</span>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <button className="settings-btn">설정</button>
      </div>
    </div>
  );
};

export default MyInfoPage;
