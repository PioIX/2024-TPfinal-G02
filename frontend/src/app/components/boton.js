'use client';

import React, { useState } from "react";

export default function BotonDeJuego({ playersCount, socket }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleStartGame = () => {
    if (!socket) {
      alert("Error: No se pudo conectar al servidor.");
      return;
    }

    if (playersCount < 2) {
      alert("Debe haber al menos 2 jugadores para iniciar el juego.");
      return;
    }

    // Emitir evento para iniciar el juego
    socket.emit("startGame");
    console.log("🚀 Solicitando inicio del juego...");
  };

  // Estilos del botón (incluye hover dinámico)
  const buttonStyle = {
    marginTop: "20px",
    padding: "15px 30px",
    backgroundColor: isHovered ? "#0056b3" : "#007BFF",
    color: isHovered ? "#e6e6e6" : "#fff",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
    transition: "background-color 0.3s, color 0.3s", // Transición suave
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleStartGame}
      onMouseEnter={() => setIsHovered(true)} // Activar hover
      onMouseLeave={() => setIsHovered(false)} // Desactivar hover
    >
      A Jugar
    </button>
  );
}
