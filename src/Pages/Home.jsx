import React from "react";
import { Link } from "react-router-dom";
import Description from "./Description";
import image from "../assets/image.png";
import "../Css/Home.css";

export default function Home() {
  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h1">
          <h1>Bienvenue au gestion d'archive de l'ENSA</h1>
          <p>
            Plateforme de gestion des archives permettant de stocker,
            organiser et consulter les documents administratifs.
          </p>
        </div>
      </div>

      
      <Description />
    </>
  );
}