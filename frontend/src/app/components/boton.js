'use client';

import { useRouter } from "next/navigation";

export default function BotonDeJuego() {
  const router = useRouter();

  const handleStartGame = () => {
    // Redirige a la página /flappy cuando se haga clic en el botón
    router.push("/flappy");
  };

  // Estilo del botón (puedes ajustarlo según sea necesario)
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
