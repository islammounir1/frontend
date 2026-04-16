import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Header.css";
import logo from "../assets/logo.png"

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
    
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      
      

     
      <div className="header-right">
        <button
          className="login-btn"
          onClick={() => navigate("/connexion")}
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;