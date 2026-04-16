import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Supprimer() {
  const navigate = useNavigate();
  const [etudiants, setEtudiants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/etudiants")
      .then(res => res.json())
      .then(data => setEtudiants(data))
      .catch(err => console.log(err));
  }, []);


  const supprimer = (id) => {
    const confirmation = window.confirm("Voulez-vous vraiment supprimer cet étudiant ? Cette action est irréversible.");
    
    if (confirmation) {
      fetch(`http://localhost:5000/etudiants/${id}`, {
        method: "DELETE"
      })
        .then(() => {
          setEtudiants((prev) =>
            prev.filter((etudiant) => etudiant.id !== id)
          );
          alert("Étudiant supprimé avec succès !");
        })
        .catch(err => {
          console.log(err);
          alert("Erreur lors de la suppression");
        });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des étudiants</h2>

      {etudiants.map((e) => (
        <div key={e.id} className="etudiant-card">
          <p><strong>nom:</strong> {e.nom} {e.prenom}</p>
          <p><strong>cne:</strong> {e.cne}</p>
          <p><strong>cin:</strong> {e.cin}</p>
          <p><strong>email:</strong> {e.email}</p>
          <p><strong>filière:</strong> {e.filiere}</p>
          <p><strong>date de naissance:</strong> {e.dateNaissance}</p>
          <p><strong>nationalité:</strong> {e.nationalite}</p>
          <p><strong>sexe:</strong> {e.sexe}</p>
          <p><strong>téléphone:</strong> {e.telephone}</p>
          <p><strong>nom du père:</strong> {e.nomPere}</p>
          <p><strong>nom de la mère:</strong> {e.nomMere}</p>
          <p><strong>adresse des parents:</strong> {e.adresseParents}</p>
          <p><strong>baccalauréat:</strong> {e.baccalaureat}</p>
          <p><strong>année d'inscription:</strong> {e.anneeInscription}</p>
          <p><strong>établissement d'origine:</strong> {e.etablissementOrigine}</p>
          <p><strong>établissement d'accueil:</strong> {e.etablissementAccueil}</p>
          <p><strong>photoUrl:</strong> {e.photoUrl}</p>
          
          <div className="etudiant-actions">
            <button className="btn btn-modifier" onClick={() => navigate(`/modifier/${e.id}`)}>
              Modifier
            </button>
            <button className="btn btn-supprimer" onClick={() => supprimer(e.id)}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}