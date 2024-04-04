import React from "react";
import "../css/mainScreen.css";
import { Box } from "@mui/material";

import LoginPage from './LoginPage'

import { useNavigate } from 'react-router-dom';
import { NavBar } from "../component/NavBar";

const MainScreen = () => {

  const navigate = useNavigate();

  return (
    <div>
      <LoginPage/>
      {/* <NavBar/> */}
    </div>
  );
};

export default MainScreen;
