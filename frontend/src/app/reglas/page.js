'use client';

import React, { useState, useEffect } from 'react';

let ws;

export default function Reglas() {
    const [hover, setHover] = useState(false);
    const [playersConnected, setPlayersConnected] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        // Initialize WebSocket connection
        ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log("✅ Connected to WebSocket server");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'playerCount') {
                console.log("📥 Players connected:", data.count);
                setPlayersConnected(data.count);
            } else if (data.type === 'gameStart') {
                setGameStarted(true);
                window.location.href = "/flappy";
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleStartGame = () => {
        if (playersConnected < 2) {
            alert("¡Esperando a otro jugador para comenzar!");
            return;
        }
        ws.send(JSON.stringify({ type: 'startGame' }));
    };

    const cardStyle = {
        border: '2px solid #007BFF',
        borderRadius: '12px',
        padding: '20px 30px',
        maxWidth: '350px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        marginTop: '10px',
        position: 'relative',
    };

    const headingStyle = {
        fontSize: '28px',
        color: '#007BFF',
        marginBottom: '15px',
        fontWeight: 'bold',
        letterSpacing: '1px',
    };

    const ruleTextStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
        fontFamily: 'Arial, sans-serif',
    };

    const playerCountStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '8px 12px',
        backgroundColor: playersConnected < 2 ? '#ff4444' : '#00C851',
        color: 'white',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
    };

    const buttonStyle = {
        marginTop: "20px",
        padding: "15px 30px",
        backgroundColor: playersConnected < 2 ? "#cccccc" : "#007BFF",
        color: "#fff",
        fontSize: "20px",
        fontWeight: "600",
        border: `2px solid ${playersConnected < 2 ? "#999999" : "#0056b3"}`,
        borderRadius: "8px",
        cursor: playersConnected < 2 ? "not-allowed" : "pointer",
        textTransform: "uppercase",
        letterSpacing: "1px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    };

    return (
        <div style={cardStyle} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
            <div style={playerCountStyle}>
                {playersConnected}/2 Jugadores
            </div>
            
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
            <div style={{ marginTop: '20px' }}>
                <video width="100%" controls>
                    <source src="/images/ejemplo.mp4" type="video/mp4" />
                    Tu navegador no soporta el formato de video.
                </video>
            </div>

            <button
                style={buttonStyle}
                onClick={handleStartGame}
            >
                {playersConnected < 2 ? "Esperando jugadores..." : "¡A Jugar!"}
            </button>
        </div>
    );
}