import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";


 export default function Home() {
  

  return (
    <div className="home">
             <img src={logo} alt={logo}
              className="logo" />
              <div className="titre"></div>
      <h1>Bienvenue dans votre système de gestion d'archives</h1>
      <p>Organisez, stockez et accédez facilement à vos documents.</p>

      <div className="formulaire">
     <form>
      <label>utilisateur:</label>
      <input type="text" placeholder="Ecrivez votre utilisateur" />
      <label>mot de passe:</label>
      <input   type="password" placeholder="Ecrivez votre mot de passe "/>
     </form>
     <boutton  type="submit" className="btn" > se connecter </boutton>
      </div>
    </div>
  );
}

