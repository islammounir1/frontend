import React from "react";
import logo from "../Images/logo.png";

function Navbar() {
  return (
    <header className="navbar">
     <img src={logo} alt={logo}
      className="logo" />
      <div className="titre">ArchivePro</div>

    </header>
  );
}

export default Navbar;