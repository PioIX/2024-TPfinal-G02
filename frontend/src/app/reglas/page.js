import Reglas from "../components/reglas";
import BotonDeJuego from "../components/boton";
import styles from './Reglitas.module.css';

export default function Reglitas() {
  return (
    <div className={styles.page}>
      <Reglas />
      <BotonDeJuego />
    </div>
  );
}
