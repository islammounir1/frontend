import React from "react";
import logoo from "../assets/logoo.png";


export default function Header() {
  return (
    <>
      <header className="header">
        <img src={logoo} alt="logo ENSA" className="logo" />
        <button className="login-btn">Login</button>
      </header>

      <style>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1px 30px;
            background-color: #ffffff;
            position: fixed;  
           top: 0;           
           left: 0;
           width: 1200px;
           z-index: 1000; 

          .logo {
            height: 80px;
          }

          .login-btn {
            padding: 15px 35px;
            background-color: #195b8a;
            color: white;
             font-size : 15px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
          }

          .login-btn:hover {
            background-color: #184254;
          }
        `}
      </style>
      
    </>
  );
}