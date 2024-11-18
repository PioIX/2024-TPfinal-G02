import styles from './page.module.css';
import BotonDeJuego from './components/boton';

// Define the buttonStyle, inputStyle, and headingStyle objects outside the Login function
const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "blue", // Botón azul
  color: "#fff",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px", // Bordes redondeados
  cursor: "pointer",
};

const inputStyle = {
  padding: "10px",         // Similar al padding del botón
  width: "200px",          // Mismo tamaño que el botón
  marginBottom: "10px",    // Espaciado entre inputs
  border: "1px solid #ccc", // Borde gris claro
  borderRadius: "5px",     // Bordes redondeados
  fontSize: "16px",        // Tamaño de fuente similar al del botón
  outline: "none",         // Sin contorno cuando el input está enfocado
};

const headingStyle = {
  fontSize: '36px',  // Tamaño de letra más grande
  color: '#333',
  marginBottom: '10px',
};

export default function Login() {
  return (
    <div className={styles.page}>
      <h1 style={headingStyle}>Login</h1>
      <form style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Usuario"
          required
          style={inputStyle} // Aplicar el estilo común al input
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          style={inputStyle} // Aplicar el estilo común al input
        />
        <button type="submit" style={buttonStyle}>Iniciar Sesión</button>
      </form>

      <h1 style={headingStyle}>Crear Cuenta</h1> 
      <form>
        <input
          type="text"
          placeholder="Usuario"
          required
          style={inputStyle} // Aplicar el estilo común al input
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          style={inputStyle} // Aplicar el estilo común al input
        />
        <button type="submit" style={buttonStyle}>Crear Cuenta</button>
        <BotonDeJuego />
      </form>
    </div>
  );
}
