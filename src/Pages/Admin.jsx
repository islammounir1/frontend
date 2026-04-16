import React, { useState } from 'react'

export default function Add() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'agent-accueil'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
   
    console.log('Nouvel utilisateur:', formData)
    alert('Utilisateur ajouté avec succès!')
 
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      role: 'agent-accueil'
    })
  }

  return (
    <div className="container">
      <h2>Ajouter un nouvel utilisateur</h2>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="agent-accueil">Agent d'accueil</option>
              <option value="responsable-archive">Responsable d'archive</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button type="submit">Ajouter l'utilisateur</button>
        </form>
      </div>
    </div>
  )
}