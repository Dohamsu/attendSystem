import React from "react";
import "../css/mainScreen.css";
// SVG 파일들
import Path4 from "../images/path-4.svg";
import Vector9 from "../images/vector-9.svg";
import Vector10 from "../images/vector-10.svg";
import Path6 from "../images/path-6.svg";
import OvalCopy2 from "../images/oval-copy-2.svg";
// PNG 파일
import SleepyAfrican from "../images/woman.png";
import Slider from "../images/slider.png";
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {

  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <div className="div">
        <div className="overlap">
          <img className="path" alt="Path" src={Path4} />
          <img className="sleepy-african" alt="Sleepy african" src={SleepyAfrican} />
          <div className="slide">
            <div className="overlap-group">
              <div className="mobile">
                <div className="ellipse-wrapper">
                  <div className="ellipse" />
                </div>
                <img className="vector" alt="Vector" src={Vector9} />
                <img className="img" alt="Vector" src={Vector10} />
              </div>
            </div>
          </div>
        </div>
        <img className="slider" alt="Slider" src={Slider} />
        <div className="sub-clipping-group">
          <div className="sub">Welcome Michael!</div>
        </div>
        <div className="tittle-clipping">
          <p className="tittle">
            <span className="text-wrapper">It's Time </span>
            <span className="text-wrapper">to <br />
              Practice!!
            </span>
          </p>
        </div>
        <div className="overlap-2">
          <p className="logo">
            <span onClick={()=> navigate('/')} 
            className="span">한음</span>
          </p>
          <div  onClick={()=> navigate('/login')} >로그인 페이지 이도오오옹</div>
          <img className="path-2" alt="Path" src={Path6}/>
          <img className="oval-copy" alt="Oval copy" src={OvalCopy2} />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
