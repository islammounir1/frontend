import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Modifier.css";

 export default function Modifier() {
  const navigate = useNavigate();

  const [etudiants, setEtudiants] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    cne: "",
    cin: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
    sexe: "",
    adresse: "",
    telephone: "",
    email: "",
    nomPere: "",
    nomMere: "",
    adresseParents: "",
    baccalaureat: "",
    filiere: "",
    anneeInscription: "",
    etablissementOrigine: "",
    etablissementAccueil: "",
    photoUrl: ""
  });


  useEffect(() => {
    fetch("http://localhost:5000/etudiants")
      .then(res => res.json())
      .then(data => setEtudiants(data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    fetch(`http://localhost:5000/etudiants/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(updatedStudent => {
        setEtudiants(etudiants.map(e => e.id === editId ? updatedStudent : e));
        setEditId(null);
      })
      .catch(err => console.log(err));
  };

  const startEdit = (e) => {
    setEditId(e.id);
    setFormData(e);
  };

  return (
    <div className="modifier-container">
      <h2>Gestion & Modification</h2>

      {etudiants.map((e) => (
        <div key={e.id} className="etudiant-edit-card">
          {editId === e.id ? (
            <div className="modifier-form">
              <div className="modifier-form-grid">
                <input name="cne" value={formData.cne} onChange={handleChange} placeholder="CNE" />
                <input name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" />
                <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
                <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
                <input name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} placeholder="Date Naissance" />
                <input name="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} placeholder="Lieu Naissance" />
                <input name="nationalite" value={formData.nationalite} onChange={handleChange} placeholder="Nationalité" />
                <input name="sexe" value={formData.sexe} onChange={handleChange} placeholder="Sexe" />
                <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" />
                <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input name="filiere" value={formData.filiere} onChange={handleChange} placeholder="Filière" />
                <input name="nomPere" value={formData.nomPere} onChange={handleChange} placeholder="Nom Père" />
                <input name="nomMere" value={formData.nomMere} onChange={handleChange} placeholder="Nom Mère" />
                <input name="adresseParents" value={formData.adresseParents} onChange={handleChange} placeholder="Adresse Parents" />
                <input name="baccalaureat" value={formData.baccalaureat} onChange={handleChange} placeholder="Baccalauréat" />
                <input name="anneeInscription" value={formData.anneeInscription} onChange={handleChange} placeholder="Année Inscription" />
                <input name="etablissementOrigine" value={formData.etablissementOrigine} onChange={handleChange} placeholder="Établissement Origine" />
                <input name="etablissementAccueil" value={formData.etablissementAccueil} onChange={handleChange} placeholder="Établissement Accueil" />
                <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL" />
              </div>
              <div className="edit-actions">
                <button className="btn-save" onClick={handleUpdate}>Enregistrer les modifications</button>
                <button className="btn-cancel" onClick={() => setEditId(null)}>Annuler</button>
              </div>
            </div>
          ) : (
            <div className="etudiant-view-container">
              <div className="etudiant-view">
                <p><strong>Nom Complet:</strong> {e.nom} {e.prenom}</p>
                <p><strong>CNE:</strong> {e.cne}</p>
                <p><strong>CIN:</strong> {e.cin}</p>
                <p><strong>Filière:</strong> {e.filiere}</p>
                <p><strong>Email:</strong> {e.email}</p>
                <p><strong>Téléphone:</strong> {e.telephone}</p>
                <p><strong>Ville Nais.:</strong> {e.lieuNaissance}</p>
                <p><strong>Année Inscr.:</strong> {e.anneeInscription}</p>
              </div>
              <div className="edit-actions">
                <button className="btn-edit" onClick={() => startEdit(e)}>Modifier</button>
                <button className="btn-supprimer" onClick={() => navigate(`/supprimer/${e.id}`)}>Supprimer</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}