
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../Css/Adduti.css"

export default function Adduti() {
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      role: 'admin'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@email.com',
      role: 'agent-accueil'
    }
  ])

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin':
        return 'role-badge-admin'
      case 'responsable-archive':
        return 'role-badge-archive'
      case 'agent-accueil':
        return 'role-badge-accueil'
      default:
        return 'role-badge-default'
    }
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin':
        return 'Administrateur'
      case 'responsable-archive':
        return 'Responsable d\'archive'
      case 'agent-accueil':
        return 'Agent d\'accueil'
      default:
        return role
    }
  }

  const handleDelete = (id) => {
    if(window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion des Utilisateurs</h2>
        <Link to="/diagramme/admin" className="btn-add-admin">Ajouter utilisateur</Link>
      </div>
      
      <div className="users-stats">
        <div className="stat-card">
          <p className="stat-number">{users.length}</p>
          <p className="stat-label">Utilisateurs total</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{users.filter(u => u.role === 'admin').length}</p>
          <p className="stat-label">Administrateurs</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{users.filter(u => u.role === 'agent-accueil').length}</p>
          <p className="stat-label">Agents d'accueil</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{users.filter(u => u.role === 'responsable-archive').length}</p>
          <p className="stat-label">Responsables d'archive</p>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <button className="btn-edit">Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
