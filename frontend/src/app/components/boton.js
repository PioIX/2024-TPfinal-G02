'use client'; // Marca este componente como un "Client Component"

import React from 'react';

export default function BotonDeJuego() {
  // Función de redirección
  const handleRedirect = () => {
    window.location.href = "/flappy"; // Redirige a la página '/flappy'
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "blue", // Botón verde
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px", // Bordes redondeados
    cursor: "pointer",
  };

  return (
    <button onClick={handleRedirect} style={buttonStyle}>
      A Jugar
    </button>
  );
}
