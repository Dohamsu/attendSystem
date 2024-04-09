// src/store/types.ts
export interface AuthState {
    isLoggedIn: boolean;
  }
  
  export interface RootState {
    auth: AuthState;
  }
  