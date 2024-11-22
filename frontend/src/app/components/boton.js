'use client';

import React from "react";

export default function BotonDeJuego({ playersCount, socket }) {
  const handleStartGame = () => {
    if (!socket) {
      alert("Error: No se pudo conectar al servidor.");
      return;
    }

    if (playersCount < 2) {
      alert("Debe haber al menos 2 jugadores para iniciar el juego.");
      return;
    }

    socket.emit("startGame");
    console.log("🚀 Solicitando inicio del juego...");
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "15px 30px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <button onClick={handleStartGame} style={buttonStyle}>
      A Jugar
    </button>
  );
}
