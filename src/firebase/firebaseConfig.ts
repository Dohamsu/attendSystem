// Firebase 모듈 임포트
import { initializeApp } from 'firebase/app';
import CONST from '../common/const';

// Firebase 프로젝트 설정
const firebaseConfig = CONST.FIREBASE_CONFIG;

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 초기화된 Firebase 앱 내보내기
export default app;
