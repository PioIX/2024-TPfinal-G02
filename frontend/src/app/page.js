'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reglas from "./components/reglas";
import BotonDeJuego from "./components/boton";
import styles from "./page.module.css";

export default function Reglitas() {
  const [playersCount, setPlayersCount] = useState(1);  // Inicia con 1 jugador (el jugador local)
  const router = useRouter();

  useEffect(() => {
    // Aquí ya no es necesario conectarse al socket
    // Puedes eliminar la conexión a socket.io si no la necesitas para la lógica de navegación
  }, []);

  return (
    <div className={styles.page}>
      <Reglas />
      <BotonDeJuego />
    </div>
  );
}
