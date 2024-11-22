'use client';  // Asegúrate de que este archivo se ejecute en el cliente

import { useState } from 'react';
import BotonDeJuego from './components/boton';
import styles from "./page.module.css"; // Estilos CSS (asegúrate de que esté bien importado)

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario creado exitosamente');
        // Redirige a la página /reglas utilizando window.location
        window.location.href = '/reglas';
      } else {
        setMessage(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el servidor');
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Crear Usuario</h1>

      {message && (
        <div className={`w-full max-w-md p-4 mb-4 rounded text-center ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={4}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button 
          className={`${styles.button} ${(!username || !password) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          type="submit"
          disabled={!username || !password}
        >
          Crear
        </button>
      </form>
      <BotonDeJuego></BotonDeJuego>
    </div>
  );
}