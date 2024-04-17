import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../stores/userSlice';
import axios from 'axios';
import "../css/myInfoPage.css";
import { RootState } from '../stores/store';
import {GoogleLogoutButton } from '../component/GoogleLogin';
import {KakaoLogoutButton } from '../component/KakaoLogin';
import { AppDispatch } from '../stores/store'; // AppDispatch 타입 import


interface User {
  _id?: string;
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}

const MyInfoPage: React.FC = () => {
 const userInfo = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const [editMode, setEditMode] = useState(false);
  const [number, setNumber] = useState(userInfo?.number || '');
  const [part, setPart] = useState(userInfo?.part || '');

  const handleSave = async () => {
    if (userInfo && userInfo._id) {
      const updatedUserInfo = {
        ...userInfo,
        number: number,
        part: part
      };

      // Redux Thunk를 사용하여 사용자 정보 업데이트
      dispatch(updateUser({ id: userInfo._id, data: updatedUserInfo }));
    }
    setEditMode(false);
  };

  return (
    <div className="my-info-page">
      <div className="user-info-section">
        <h2>내 정보</h2>
        <div className="user-info">
          {/* 기존 정보 출력 부분 */}
          <div className="info-item">
            <span className="info-title">로그인 플랫폼:</span>
            <span className="info">{userInfo?.socialLogin}</span>
          </div>
          <div className="info-item">
            <span className="info-title">이름:</span>
            <span className="info">{userInfo?.name}</span>
          </div>
          {/* 기수와 파트 정보를 인풋창으로 변환 */}
          <div className="info-item">
            <span className="info-title">기수:</span>
            {editMode ? (
              <input value={number} onChange={(e) => setNumber(e.target.value)} />
            ) : (
              <span className="info">{number}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-title">파트:</span>
            {editMode ? (
              <input value={part} onChange={(e) => setPart(e.target.value)} />
            ) : (
              <span className="info">{part}</span>
            )}
          </div>
          <div className="info-item-center">
            {userInfo?.platform === 'google' && <GoogleLogoutButton />}
            {userInfo?.platform === 'kakao' && <KakaoLogoutButton />}
          </div>
        </div>
      </div>
      <div className="settings-section">
        {editMode ? (
          <button className='settings-btn' onClick={handleSave}>확인</button>
        ) : (
          <button className='settings-btn' onClick={() => setEditMode(true)}>내정보 수정</button>
        )}
      </div>
    </div>
  );
};

export default MyInfoPage;
