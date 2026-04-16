import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Détails({ etudiant, onClose }) {
  const navigate = useNavigate()

  if (!etudiant) {
    return null
  }

  return (
    <div className="details-overlay">
      <div className="details-card">
        <div className="details-actions">
           <button
            className="btn btn-modifier"
            onClick={() => navigate(`/Modifier/${etudiant.id}`)}
          >
            Modifier
          </button>
          <button className="btn btn-fermer" onClick={onClose}>
            Fermer
          </button>
         
        </div>

        <h2>Détails de {etudiant.nom} {etudiant.prenom}</h2>
        <img
          src={etudiant.photoUrl || 'https://via.placeholder.com/150'}
          alt={`${etudiant.nom} ${etudiant.prenom}`}
          className="details-photo"
        />

        <div className="details-grid">
          <p><strong>CNE :</strong> {etudiant.cne}</p>
          <p><strong>CIN :</strong> {etudiant.cin}</p>
          <p><strong>Email :</strong> {etudiant.email}</p>
          <p><strong>Téléphone :</strong> {etudiant.telephone}</p>
          <p><strong>Date de naissance :</strong> {etudiant.dateNaissance}</p>
          <p><strong>Nationalité :</strong> {etudiant.nationalite}</p>
          <p><strong>Sexe :</strong> {etudiant.sexe}</p>
          <p><strong>Filière :</strong> {etudiant.filiere}</p>
          <p><strong>Baccalauréat :</strong> {etudiant.baccalaureat}</p>
          <p><strong>Année d'inscription :</strong> {etudiant.anneeInscription}</p>
          <p><strong>Établissement d'origine :</strong> {etudiant.etablissementOrigine}</p>
          <p><strong>Établissement d'accueil :</strong> {etudiant.etablissementAccueil}</p>
          <p><strong>Nom du père :</strong> {etudiant.nomPere}</p>
          <p><strong>Nom de la mère :</strong> {etudiant.nomMere}</p>
          <p><strong>Adresse des parents :</strong> {etudiant.adresseParents}</p>
        </div>
      </div>
    </div>
  )
}