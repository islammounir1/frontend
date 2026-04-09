import React from "react";
import archive from "../assets/archive.png"; // mets ton image ici

export default function About() {
  return (
    <>
      <div className="container">
        
        {/* Texte à gauche */}
        <div className="left">
          <h1>Gestion des Archives</h1>
          <p>
            La gestion d’archives d’un site web consiste à organiser, conserver et retrouver
             l’ensemble des contenus et données du site sur le long terme, tout en garantissant
              leur intégrité, leur sécurité et leur conformité. Elle ne se limite pas aux anciennes pages :
               elle inclut aussi les médias (images, vidéos, documents), les versions du code, les bases de données, les sauvegardes, les journaux
                (logs) et parfois les échanges importants (formulaires, commandes, tickets). Une bonne stratégie d’archivage permet de préserver l’historique du site, 
                de revenir à une version antérieure en cas d’erreur ou de piratage, 
            et de répondre à des exigences légales ou contractuelles.
          </p>
        </div>

        {/* Image à droite */}
        <div className="right">
          <img src={archive} alt="archive" />
        </div>

      </div>

      <style>
        {`
          .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 50px;
            height: 100vh;
          }

          .left {
            width: 50%;
          }

          .left h1 {
            font-size: 40px;
            margin-bottom: 20px;
          }

          .left p {
            font-size: 18px;
            color: #555;
          }

          .right {
            width: 50%;
            display: flex;
            justify-content: center;
          }

          .right img {
            width: 80%;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  );
}