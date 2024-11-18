'use client'; // Marca este componente como un "Client Component"

import React from 'react';

export default function BotonDeJuego() {
  // Función de redirección
  const handleRedirect = () => {
    window.location.href = "/flappy"; // Redirige a la página '/flappy'
  };

  const buttonStyle = {
    marginTop: "20px",          // Espacio superior
    padding: "15px 30px",       // Tamaño adecuado
    backgroundColor: "#007BFF", // Azul moderno
    color: "#fff",              // Texto blanco
    fontSize: "20px",           // Tamaño de fuente
    fontWeight: "600",          // Texto ligeramente grueso
    border: "2px solid #0056b3",// Borde azul más oscuro
    borderRadius: "8px",        // Bordes redondeados
    cursor: "pointer",
    textTransform: "uppercase", // Texto en mayúsculas
    letterSpacing: "1px",       // Espaciado entre letras
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
  };

  // Estilo para el estado hover
  const hoverStyle = {
    backgroundColor: "#0056b3", // Fondo más oscuro
    borderColor: "#003f7f",     // Borde aún más oscuro
    color: "#e6e6e6",           // Texto ligeramente gris
  };

  return (
    <button
      onClick={handleRedirect}
      style={buttonStyle}
      onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} // Sin animación, cambia al estilo hover
      onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)} // Restaura el estilo original
    >
      A Jugar
    </button>
  );
}
