import React from "react";
import archive from "../assets/archive.png"; 
import "../Css/Description.css";


export default function About() {
  return (
    <>
      <div className="desc-page-container">
        
      
        <div className="desc-text-section">
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

  
        <div className="desc-image-section">
          <img src={archive} alt="archive" />
        </div>

      </div>

     
    </>
  );
}