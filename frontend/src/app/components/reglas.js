'use client'; // Asegúrate de que el componente sea renderizado en el cliente

import React, { useState } from 'react';

export default function Reglas() {
    const [hover, setHover] = useState(false);

    const cardStyle = {
        border: '2px solid #007BFF',
        borderRadius: '12px',
        padding: '20px 30px', // Reducir padding superior e inferior
        maxWidth: '350px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        marginTop: '10px', // Reducir margen superior
    };

    const headingStyle = {
        fontSize: '28px',
        color: '#007BFF',
        marginBottom: '15px', // Reducir espacio inferior
        fontWeight: 'bold',
        letterSpacing: '1px',
    };

    const textStyle = {
        fontSize: '18px',
        color: '#333',
        marginBottom: '10px', // Reducir margen inferior
        lineHeight: '1.6',
    };

    const ruleTextStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
        fontFamily: 'Arial, sans-serif',
    };

    return (
        <div
            style={cardStyle}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        >
            <h2 style={headingStyle}>Reglas</h2>
            <p style={ruleTextStyle}>
                <b>Regla 1:</b> Cada salto vale 1 punto y pasar por el obstáculo 20 y perder te saca 15.
            </p>
            <p style={ruleTextStyle}>
                <b>Regla 2:</b> Tocar el techo hace que pierdas y el piso no.
            </p>
            <p style={ruleTextStyle}>
                <b>Regla 3:</b> Cada vez que pasen por 3 obstáculos la velocidad aumenta.
            </p>
            <p style={ruleTextStyle}>
                <b>Regla 4:</b> Quien consiga más <b>puntos gana!</b>
            </p>
            <h2 style={headingStyle}>Ejemplo del juego:</h2>
            {/* Video insertado abajo de las reglas */}
            <div style={{ marginTop: '20px' }}>
                <video width="100%" controls>
                    <source src="/images/ejemplo.mp4" type="video/mp4" />
                    Tu navegador no soporta el formato de video.
                </video>
            </div>
        </div>
    );
}