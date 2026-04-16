import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Css/Donnee.css'
import Détails from './Détails'
export default function Donnees() {
  const [selectedEtudiant, setSelectedEtudiant] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [etudiants, setEtudiants] = useState([
    {
      id: 1,
      cne: 'CNE001',
      cin: 'CIN001',
      nom: 'Dupont',
      prenom: 'Jean',
      dateNaissance: '2000-05-15',
      nationalite: 'Française',
      sexe: 'Masculin',
      telephone: '06 12 34 56 78',
      email: 'jean.dupont@email.com',
      nomPere: 'Pierre Dupont',
      nomMere: 'Marie Dupont',
      adresseParents: '123 Rue de Paris',
      baccalaureat: 'S',
      filiere: 'Informatique',
      anneeInscription: '2020',
      etablissementOrigine: 'Lycée Saint-Louis',
      etablissementAccueil: 'Université Paris',
      photoUrl: 'https://via.placeholder.com/100'
    },
    {
      id: 2,
      cne: 'CNE002',
      cin: 'CIN002',
      nom: 'Martin',
      prenom: 'Sophie',
      dateNaissance: '2001-03-22',
      nationalite: 'Française',
      sexe: 'Féminin',
      telephone: '06 98 76 54 32',
      email: 'sophie.martin@email.com',
      nomPere: 'Claude Martin',
      nomMere: 'Anne Martin',
      adresseParents: '456 Avenue de Lyon',
      baccalaureat: 'ES',
      filiere: 'Gestion',
      anneeInscription: '2021',
      etablissementOrigine: 'Lycée La Martinière',
      etablissementAccueil: 'Université Lyon',
      photoUrl: 'https://via.placeholder.com/100'
    }
  ])

  const supprimer = (id) => {
    setEtudiants((prevEtudiants) => prevEtudiants.filter((etudiant) => etudiant.id !== id))
  }

  const filteredEtudiants = etudiants.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="données">
      <h2>Liste des Étudiants</h2>
      
      <div className="search-add-container">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="btn btn-ajouter" onClick={() => navigate('/ajouter')}>
          Ajouter un étudiant
        </button>
      </div>
      
      {filteredEtudiants.map((e) => (
        <div key={e.id} className="etudiant-card">
          <p><strong>nom:</strong> {e.nom} {e.prenom}</p>
          <p><strong>cne:</strong> {e.cne}</p>
          <div className="etudiant-actions">
            
            <button className='btn btn-supprimer' onClick={() => supprimer(e.id)}>Supprimer</button>
            <button className='btn btn-details' onClick={() => setSelectedEtudiant(e)}>Détails</button>
          </div>
        </div>
      ))}

      {selectedEtudiant && (
        <Détails
          etudiant={selectedEtudiant}
          onClose={() => setSelectedEtudiant(null)}
        />
      )}
    </div>
  )
}