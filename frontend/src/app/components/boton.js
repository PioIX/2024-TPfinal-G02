'use client';

import React, { useState } from "react";

export default function BotonDeJuego({ playersCount, socket }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleStartGame = () => {
    if (!socket) {
      alert("Error: No se pudo conectar al servidor.");
      return;
    }

    if (playersCount !== 2) {
      alert("Debe haber exactamente 2 jugadores para iniciar el juego.");
      return;
    }

    socket.emit("startGame");
    console.log("🚀 Solicitando inicio del juego...");
  };

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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, color 0.3s",
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleStartGame}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      A Jugar
    </button>
  );
}
