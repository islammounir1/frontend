import React from "react";
import Header from "../Component/Header";
import image from "../assets/image.png";


export default function Home() {
  return (
    <>
      

      <div
        className="hero"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h1">
            <h1> Bienvenue au gestion d'archive</h1>
            <p>  Plateforme de gestion des archives permettant de stocker,
            organiser et consulter les documents administratifs de manière
            sécurisée et efficace.</p>
          
          
        </div>
      </div>

      <style>
        {`
          .hero {
            height: 100vh;
            background-size: cover;
            background-position: center;
            position: relative;
            margin-top: 80px;
             position: relative;
          }

          .h1 {
            height: 300px;
            width: 570px;
             border-radius: 30px;
            
            background: rgba(4, 20, 56, 0.88);
            display: flex;
             flex-direction: column;
            justify-content: center;
            align-items: center;
            color:white;
            text-align: center;
            margin-left: 60px;
            margin-top: 60px;
            position: absolute;  
            top: 130px;         
            left: 50px;         
            
          }
          .h1 h1{

         color:rgb(255, 255, 255);
         font-size : 30px;

         }
          .h1 p {

         color : #ddebe9;
         font-size : 18px;
         }
         `}
      </style>
    </>
  );
}