import React from "react";

function Footer() {
  return (
    <>
      <style>
        {`
          .footer {
            text-align: center;
            width: 100%;
            background-color: #f1f5f9;
            border-top: 1px solid #e5e7eb;
            
            bottom: 0;
            background-color :#195b8a ;
          }
         
        `}
      </style>

      <footer className="footer">
        <p>©️ 2026 ArchivePro - Tous droits réservés</p>
      </footer>
    </>
  );
}

export default Footer;