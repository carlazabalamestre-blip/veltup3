import React from 'react';

export function Footer() {
  return (
    <footer className="page-section">
      <div className="container">
        <div className="grid-2">
          <div>
            <h3>VELTUP</h3>
            <p>Menjar saludable i personalitzat en format tupper. Comoditat, sostenibilitat i confiança per a la teva rutina setmanal.</p>
          </div>
          <div>
            <h3>Contacte</h3>
            <p>Email: hola@veltup.cat</p>
            <p>Telèfon: 900 123 456</p>
            <p>Adreça: Barcelona · Enviaments setmanals</p>
          </div>
        </div>
        <div className="disclaimer-box" style={{ marginTop: '24px' }}>
          <strong>Avis legal</strong>
          <p>Aquesta aplicació ofereix orientació nutricional general i no substitueix el diagnòstic, tractament o seguiment d’un professional sanitari. En cas d’al·lèrgies greus, patologies, medicació o símptomes persistents, consulta sempre un metge o nutricionista.</p>
        </div>
      </div>
    </footer>
  );
}
