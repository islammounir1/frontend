import React, { useState } from "react";
import "../Css/Ajouter.css";

 export default function Ajouter() {
  const [form, setForm] = useState({
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/etudiants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
     
      alert('Étudiant ajouté avec succès !');
      setForm({
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
      alert("Étudiant ajouté !");
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="container">
      <h2>Ajouter Étudiant</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="grid">
          <input name="cne" value={form.cne} placeholder="CNE" onChange={handleChange} />
          <input name="cin" value={form.cin} placeholder="CIN" onChange={handleChange} />

          <input name="nom" value={form.nom} placeholder="Nom" onChange={handleChange} />
          <input name="prenom" value={form.prenom} placeholder="Prénom" onChange={handleChange} />

          <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleChange} />
          <input name="lieuNaissance" value={form.lieuNaissance} placeholder="Lieu de naissance" onChange={handleChange} />

          <input name="nationalite" value={form.nationalite} placeholder="Nationalité" onChange={handleChange} />

          <select name="sexe" value={form.sexe} onChange={handleChange}>
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>

          <input name="adresse" value={form.adresse} placeholder="Adresse" onChange={handleChange} />
          <input name="telephone" value={form.telephone} placeholder="Téléphone" onChange={handleChange} />

          <input name="email" value={form.email} placeholder="Email" onChange={handleChange} />
          <input name="filiere" value={form.filiere} placeholder="Filière" onChange={handleChange} />
          <input name="nomPere" value={form.nomPere} placeholder="Nom Père" onChange={handleChange} />
          <input name="nomMere" value={form.nomMere} placeholder="Nom Mère" onChange={handleChange} />
          <input name="adresseParents" value={form.adresseParents} placeholder="Adresse Parents" onChange={handleChange} />
          <input name="baccalaureat" value={form.baccalaureat} placeholder="Baccalauréat" onChange={handleChange} />
          <input name="anneeInscription" value={form.anneeInscription} placeholder="Année Inscription" onChange={handleChange} />
          <input name="etablissementOrigine" value={form.etablissementOrigine} placeholder="Établissement Origine" onChange={handleChange} />
          <input name="etablissementAccueil" value={form.etablissementAccueil} placeholder="Établissement Accueil" onChange={handleChange} />
          <input name="photoUrl" value={form.photoUrl} placeholder="Photo URL" onChange={handleChange} />
        </div>

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};