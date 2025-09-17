interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface Constants {
  KAKAO_REST_API_KEY: string;
  KAKAO_REDIRECT_URL: string;
  FIREBASE_CONFIG: FirebaseConfig;
}

const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || '';
const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL || '';

const FIREBASE_CONFIG: FirebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

const CONSTANTS: Constants = {
    KAKAO_REST_API_KEY,
    KAKAO_REDIRECT_URL,
    FIREBASE_CONFIG,
};

export default CONSTANTS;
