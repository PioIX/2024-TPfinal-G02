import styles from './page.module.css';

export default function Login() {
  return (

    <div className={styles.page}>
      <h1 style={{color : "black"}}>Login</h1>
      <form style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Usuario" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
        <input type="password" placeholder="Contraseña" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
        <button type="submit" style={{ padding: '8px', width: '200px', backgroundColor: '#0070f3', color: 'black' }}>Iniciar Sesión</button>
        </form>
        <h1 style={{color : "black"}}>Crear Cuenta</h1>
        <form>
          <input type="text" placeholder="Usuario" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
          <input type="password" placeholder="Contraseña" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
          <button type="submit" style={{ padding: '8px', width: '200px', backgroundColor: '#0070f3', color: 'black' }}>Crear Cuenta</button>
        </form>
    </div>

  );
}