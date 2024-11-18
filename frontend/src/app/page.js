'use client';

import styles from './page.module.css';
import BotonDeJuego from './components/boton'; // Ajusta esta ruta según tu estructura de carpetas

export default function Login() {
  return (
    <div className={styles.page}>
      {/* Sección de Inicio de Sesión */}
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <form className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Usuario"
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          required
        />
        <button className={styles.button} type="submit">
          Iniciar Sesión
        </button>
      </form>

      {/* Sección de Crear Cuenta */}
      <h1 className={styles.title}>Crear Cuenta</h1>
      <form className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Usuario"
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          required
        />
        <button className={styles.button} type="submit">
          Crear Cuenta
        </button>
      </form>

      {/* Botón de Juego */}
      <BotonDeJuego />
    </div>
  );
}
