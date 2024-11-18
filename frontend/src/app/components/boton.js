'use client'; // Marca este componente como un "Client Component"

import React from 'react';

export default function BotonDeJuego() {
  // Función de redirección
  const handleRedirect = () => {
    window.location.href = "/flappy"; // Redirige a la página '/flappy'
  };

  const buttonStyle = {
    marginTop: "20px",         // Espacio superior aumentado
    padding: "15px 25px",      // Aumento en el padding para hacerlo más grande
    backgroundColor: "blue",   // Color de fondo azul
    color: "#fff",
    fontSize: "22px",          // Aumento en el tamaño de la fuente
    fontWeight: "bold",        // Opcional: hace que el texto sea más grueso
    border: "none",
    borderRadius: "10px",      // Bordes más redondeados
    cursor: "pointer",
  };

  // Estilo adicional para cuando el botón es hover
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = "#0056b3"; // Cambio de color al pasar el mouse
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "blue"; // Restaurar el color original
  };

  return (
    <button
      onClick={handleRedirect}
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      A Jugar
    </button>
  );
}
