import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./Component/Header";
import Navbar from "./Component/Navbar"; 
import Footer from "./Component/Footer";

import Home from "./Pages/Home";
import Connexion from "./Pages/Connexion";
import Diagramme from "./Pages/Diagramme";
import Ajouter from "./Pages/Ajouter";
import Modifier from "./Pages/Modifier";
import Supprimer from "./Pages/Supprimer";
import Admin from "./Pages/Admin";
import Adduti from "./Pages/Adduti";

import Détails from "./Pages/Détails";
import Donnee from "./Pages/Donnee";

function Layout() {
  const location = useLocation();

  const showHeader = location.pathname === "/";

  return (
    <div className="app-container">
      {showHeader ? <Header /> : <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/diagramme" element={<Diagramme />} />
          <Route path="/diagramme/donnee" element={<Donnee />} />
          <Route path="/diagramme/admin" element={<Admin />} />
          <Route path="/adduti" element={<Adduti />} />
          <Route path="/ajouter" element={<Ajouter />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}