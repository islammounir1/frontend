import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Css/Header.css";
import logo from "../assets/logo.png";

const styles = {
  nav: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontWeight: "bold"
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
   
    navigate("/");
    setShowLogoutModal(false);
  };

  const isLoginPage = location.pathname === "/connexion";

  return (
    <>
      <header className="header">
        <div className="header-left">
          <Link to="/"><img src={logo} alt="Logo" className="logo" /></Link>
        </div>

        {!isLoginPage && (
          <nav style={styles.nav}>
            <Link to="/diagramme" style={styles.link}>Home</Link>
            <Link to="/diagramme/donnee" style={styles.link}>Données</Link>
            <Link to="/diagramme/admin" style={styles.link}>Admin</Link>
            <Link to="/adduti" style={styles.link}>Gestion</Link>
            
            <button 
              className="logout-btn" 
              onClick={() => setShowLogoutModal(true)}
              title="Déconnexion"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </nav>
        )}
      </header>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmer la déconnexion</h3>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Annuler
              </button>
              <button className="btn-confirm" onClick={handleLogout}>
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;


