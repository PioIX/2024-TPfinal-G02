export default function Login() {
    function alert() {
      alert("Hola")
    }
    return (
      <main style={{
        backgroundImage: 'URL(flappy.png)',
      }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        // backgroundImage: 'url(/flappy.png)',
        backgroundSize: 'cover',
        padding: '20px',
      }}>
        <h1 style={{color : "black"}}>Login</h1>
        <form style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="Usuario" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
          <input type="password" placeholder="Contraseña" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
          <button type="submit" style={{ padding: '8px', width: '200px', backgroundColor: '#0070f3', color: 'black' }} onClick={alert}>Iniciar Sesión</button>
          </form>
          <h2 style={{color : "black"}}>Crear Cuenta</h2>
          <form>
            <input type="text" placeholder="Usuario" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
            <input type="password" placeholder="Contraseña" required style={{ marginBottom: '10px', padding: '8px', width: '200px' }} />
            <button type="submit" style={{ padding: '8px', width: '200px', backgroundColor: '#0070f3', color: 'black' }}>Crear Cuenta</button>
          </form>
        </div>
      </main>
    );
  }