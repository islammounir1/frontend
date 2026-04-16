import React, { useState } from 'react'
import "../Css/Connexion.css"

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    window.location.href = '/diagramme'
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  )
}