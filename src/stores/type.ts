// src/store/types.ts
interface User {
  socialLogin: string;
  name: string;
  number: string;
  part: string;
  email: string; 
  platform: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loginChecked: boolean;
}
  export interface RootState {
    user: UserState;
  }
  