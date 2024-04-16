// services/UserService.ts

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_SERVER_URI}/api/users/`;

interface User {
  name: string;
  email: string;
  password?: string;
}

// 사용자 생성
const createUser = async (userData: User) => {
  const response = await axios.post<User>(API_URL, userData);
  return response.data;
};

// 사용자 목록 조회
const getUsers = async () => {
  const response = await axios.get<User[]>(API_URL);
  return response.data;
};

export { createUser, getUsers };
