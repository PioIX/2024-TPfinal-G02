import React from 'react';

export default function Reglas() {
    // Estilos CSS como objeto en JavaScript
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '300px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    };

    const headingStyle = {
        fontSize: '24px',
        color: '#333',
        marginBottom: '10px',
    };

    const textStyle = {
        fontSize: '18px',
        color: '#666',
    };

    return (
        <div style={cardStyle}>
            <h2 style={headingStyle}>Reglas</h2>
            <p style={textStyle}>
                <b>Regla 1:</b> Cada salto vale 1 punto y pasar por el obstáculo 20 y perder te saca 15
            </p>
            <p style={textStyle}>
                <b>Regla 2:</b> Tocar el techo hace que pierdas y el piso no
            </p>
            <p style={textStyle}>
                <b>Regla 3:</b> Cada vez que pasen por 3 obstaculos la velocidad aumenta
            </p>
            <p style={textStyle}>
                <b>Regla 4:</b> Quien consiga mas <b>puntos gana!!!</b>
            </p>
        </div>
    );
    
}
