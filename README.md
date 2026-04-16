# Gestion des Archives - Frontend

Application frontend React pour une plateforme de gestion d archives (etudiants, utilisateurs, consultation et visualisation).

Ce projet sert de base d interface web pour:
- authentifier un utilisateur (ecran de connexion simple)
- consulter et rechercher des donnees etudiants
- afficher des graphiques de categories
- gerer une liste d utilisateurs
- ajouter, modifier et supprimer des fiches etudiants

## 1) Vue d ensemble

Le frontend est construit avec React + Vite et utilise React Router pour la navigation. L application adopte une architecture simple:
- un layout global avec Header ou Navbar selon la route
- un Footer permanent
- des pages metier dans `src/Pages`
- des composants reutilisables dans `src/Component`
- un systeme de styles par page dans `src/Css` + styles globaux dans `src/index.css`

Le design actuel est base sur un theme clair, effet glassmorphism, et animations de fond (aurora) via variables CSS.

## 2) Stack technique

- Framework UI: React 19
- Bundler: Vite 8
- Routing: react-router-dom 7
- Data viz: recharts
- Qualite code: ESLint 9

Dependances principales (voir `package.json`):
- `react`
- `react-dom`
- `react-router-dom`
- `recharts`

## 3) Arborescence du projet

Structure fonctionnelle principale:

```text
frontend/
	public/
	src/
		Component/
			Header.jsx
			Navbar.jsx
			Footer.jsx
		Pages/
			Home.jsx
			Connexion.jsx
			Diagramme.jsx
			Donnee.jsx
			Détails.jsx
			Ajouter.jsx
			Modifier.jsx
			Supprimer.jsx
			Admin.jsx
			Adduti.jsx
			Description.jsx
		Css/
			Header.css
			Footer.css
			Home.css
			Connexion.css
			Description.css
			Donnee.css
			Ajouter.css
			Modifier.css
			Adduti.css
		assets/
			logo.png
			archive.png
			image.png
		App.jsx
		main.jsx
		index.css
	index.html
	vite.config.js
	eslint.config.js
	package.json
```

## 4) Architecture de navigation

Routes declarees dans `src/App.jsx`:

- `/` -> page d accueil (`Home`)
- `/connexion` -> page de login (`Connexion`)
- `/diagramme` -> tableau de bord graphiques (`Diagramme`)
- `/diagramme/donnee` -> liste etudiants + recherche + details (`Donnee`)
- `/diagramme/admin` -> formulaire ajout utilisateur (`Admin`)
- `/adduti` -> gestion utilisateurs (liste + suppression locale) (`Adduti`)
- `/ajouter` -> formulaire ajout etudiant (`Ajouter`)

Comportement du layout:
- sur `/`: affichage `Header`
- sur autres routes: affichage `Navbar`
- `Footer` visible partout

## 5) Description detaillee des modules

### 5.1 Accueil (`Home` + `Description`)
- Hero avec image de fond institutionnelle
- Message de bienvenue pour la plateforme de gestion d archives
- Bloc descriptif sur les enjeux de conservation, securite, historique et conformite

### 5.2 Connexion (`Connexion`)
- Formulaire email/mot de passe avec etat local React
- Soumission redirige vers `/diagramme`
- Version actuelle sans authentification backend ni token

### 5.3 Visualisation (`Diagramme`)
- Affichage de 2 graphes Recharts:
	- diagramme circulaire
	- diagramme en barres
- Donnees actuellement statiques (categories: Sport, Etudes, Jeux, Autres)

### 5.4 Donnees etudiants (`Donnee` + `Détails`)
- Liste d etudiants en etat local
- Barre de recherche (nom, prenom, CNE, email)
- Actions par carte:
	- suppression locale
	- ouverture d une fenetre de details
- Fenetre `Détails`:
	- resume complet de la fiche etudiant
	- bouton pour fermer
	- bouton pour aller vers la modification

### 5.5 Ajout etudiant (`Ajouter`)
- Formulaire complet (identite, contact, filiere, origine, accueil, etc.)
- Envoi en POST vers `http://localhost:5000/etudiants`
- Reinitialisation du formulaire apres succes

### 5.6 Modification et suppression (`Modifier`, `Supprimer`)
- `Modifier`:
	- charge les etudiants depuis `http://localhost:5000/etudiants`
	- mode edition inline pour une fiche
	- sauvegarde via requete PUT
- `Supprimer`:
	- charge les etudiants via API
	- suppression via requete DELETE avec confirmation utilisateur

### 5.7 Gestion utilisateurs (`Adduti`, `Admin`)
- `Adduti`:
	- liste locale des utilisateurs
	- badges de roles (admin, responsable archive, agent accueil)
	- suppression locale avec confirmation
- `Admin`:
	- formulaire d ajout utilisateur
	- logique actuelle cote frontend (console + alert)

## 6) Style et experience utilisateur

Le projet applique:
- variables CSS globales (couleurs, radius, typo)
- fond anime type aurora
- composants en style glassmorphism
- formulaire et boutons avec transitions, ombres et hover

Important:
- `src/App.css` contient encore du style issu du template Vite, peu utilise par l application metier
- le style principal actif est surtout dans `src/index.css` + fichiers de `src/Css`

## 7) Donnees et integration backend

Etat actuel des sources de donnees:
- statique locale: `Donnee`, `Adduti`, `Diagramme`
- API REST locale: `Ajouter`, `Modifier`, `Supprimer`

Base URL actuellement codee en dur:
- `http://localhost:5000/etudiants`

Operations API utilisees:
- `POST /etudiants` (ajout)
- `GET /etudiants` (lecture)
- `PUT /etudiants/:id` (modification)
- `DELETE /etudiants/:id` (suppression)

## 8) Installation et execution

Prerequis:
- Node.js 18+ recommande
- npm

Installation:

```bash
npm install
```

Lancer en developpement:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Previsualisation du build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## 9) Etat qualite observe

Analyse locale effectuee:
- lint: OK
- build Vite: OK

Observation performance:
- Vite signale un bundle JS > 500 kB apres minification
- ce n est pas bloquant, mais il est recommande d introduire du code splitting (imports dynamiques) pour les pages lourdes

## 10) Limites actuelles (important)

1. Authentification non securisee (pas de backend auth, pas de JWT/session)
2. Donnees encore melangees entre mock local et API reelle
3. Certaines routes sont appelees dans des boutons mais non declarees dans le routeur:
	 - navigation vers `/Modifier/:id`
	 - navigation vers `/supprimer/:id`
4. URL API hardcodee (pas de variable d environnement)
5. Validation formulaire basique, gestion d erreurs API minimale

## 11) Recommandations prioritaires

1. Centraliser la couche API (service unique + gestion erreurs)
2. Utiliser une variable d environnement Vite (`VITE_API_URL`)
3. Aligner toutes les routes de navigation avec les routes React Router
4. Ajouter une vraie authentification (login + guard de routes)
5. Mettre en place un store de donnees (ou React Query) pour coherer les ecrans
6. Decouper les pages en lazy loading pour ameliorer le poids du bundle

## 12) Vision fonctionnelle cible

Ce frontend peut evoluer vers un portail complet de gestion d archives academiques:
- cycle de vie des dossiers etudiants
- gestion des roles et permissions
- traçabilite des actions
- reporting visuel sur les archives et les operations
- connexion propre avec le backend Laravel du workspace

---

Si vous voulez, je peux aussi fournir une version 2 du README avec:
- diagramme d architecture (frontend <-> API)
- convention de nommage des composants
- plan de migration vers une architecture plus modulaire.
