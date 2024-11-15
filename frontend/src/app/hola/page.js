import React from "react";
import Reglas from "../components/reglas";
import BotonDeJuego from "../components/boton";

export default function Hola() {
  // Estilos para el contenedor
  const containerStyle = {
    backgroundColor: "#007BFF", // Fondo azul
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center", // Centrar verticalmente
    minHeight: "100vh", // Asegura que ocupe toda la altura de la ventana
    flexDirection: "column", // Para que el botón esté debajo de las reglas
  };

  return (
    <div style={containerStyle}>
      <Reglas />
      {/* Usamos el nuevo componente para el botón */}
      <BotonDeJuego />
    </div>
  );
}
