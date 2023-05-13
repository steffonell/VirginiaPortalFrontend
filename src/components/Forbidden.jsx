import React from 'react';
import '../styles/forbidden.css'

const Forbidden = () => {
  return (
    <div className="forbidden-container">
      <h1 className="forbidden-title">Zabranjeno</h1>
      <p className="forbidden-message">Vaš nalog nema ovlašćenje za pristup ovom resursu.</p>
    </div>
  );
};

export default Forbidden;
