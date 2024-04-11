import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../stores/userSlice'; // 상태 업데이트를 위한 액션
import axios from 'axios';
import "../css/myInfoPage.css";
import { RootState } from '../stores/store'; // 상태 타입 임포트 경로 확인 필요

interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}

const MyInfoPage: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  // 로컬 상태로 기수와 파트를 관리합니다.
  const [editMode, setEditMode] = useState(false);
  const [number, setNumber] = useState(userInfo?.number || '');
  const [part, setPart] = useState(userInfo?.part || '');

  const handleSave = async () => {
    // 새로운 사용자 정보 객체를 생성합니다.
    const updatedUserInfo = {
      ...userInfo,
      number,
      part,
    };

    // Redux 스토어 업데이트
    dispatch(updateUser(updatedUserInfo as User));

    // 백엔드로 사용자 정보 업데이트 요청 보내기
    try {
      await axios.post('http://localhost:4000/update-user', updatedUserInfo);
      console.log('사용자 정보 업데이트 성공');
    } catch (error) {
      console.error('사용자 정보 업데이트 실패', error);
    }

    setEditMode(false); // 편집 모드 종료
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
        </div>
      </div>
      <div className="settings-section">
        {editMode ? (
          <button onClick={handleSave}>확인</button>
        ) : (
          <button onClick={() => setEditMode(true)}>설정</button>
        )}
      </div>
    </div>
  );
};

export default MyInfoPage;
