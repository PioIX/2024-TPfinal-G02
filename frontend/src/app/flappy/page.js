"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(6.5); // Velocidad inicial
  const [gravity, setGravity] = useState(0.5); // Gravedad ajustada
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3); // Temporizador de cuenta regresiva
  const [score, setScore] = useState(-21);
  const [hasPassedObstacle, setHasPassedObstacle] = useState(false);
  const [speedIncreased, setSpeedIncreased] = useState(false); // Controla el aumento de la velocidad

  const obstacleWidth = 60;

  const obstacleConfigurations = [
    { topHeight: 310, bottomHeight: 310, color: '#0f9d58', gap: 164 },
    { topHeight: 470, bottomHeight: 150, color: '#0f9d58', gap: 164 }, 
    { topHeight: 540, bottomHeight: 80, color: '#0f9d58', gap: 164 },
    { topHeight: 80, bottomHeight: 540, color: '#0f9d58', gap: 164 }, 
    { topHeight: 150, bottomHeight: 470, color: '#0f9d58', gap: 164 }, 
    { topHeight: 220, bottomHeight: 400, color: '#0f9d58', gap: 164 },
    { topHeight: 400, bottomHeight: 220, color: '#0f9d58', gap: 164 },
];

  // Función de salto
  const jump = () => {
    if (!gameOver) { // Solo permitir el salto si el juego no ha terminado
      setVelocity(-9); // Cambiar la velocidad para simular el salto
      setScore((prevScore) => prevScore + 1); // Aumentar el puntaje solo por salto
    }
  };

  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25); // Inicializar la posición Y
  }, []);

  // Escuchar el evento de clic
  const handleClick = () => {
    if (!gameOver) { // Solo permitir saltar si el juego no ha terminado
      jump();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [gameOver]);

  useEffect(() => {
    if (!gameStarted) {
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setGameStarted(true);
        setCountdown(0);
        jump(); // Empezar el juego con un salto
      }
    }

    const gameLoop = () => {
      if (gameOver) return; // Evitar ejecutar cuando el juego haya terminado

      // Aplicar la gravedad
      setVelocity((prev) => prev + gravity);

      // Actualizar la posición vertical del jugador
      setYPosition((prev) => {
        const newY = prev + velocity;
        if (newY > window.innerHeight - 50) return window.innerHeight - 50; // Evitar que pase del borde inferior
        if (newY <= 0) {
          setGameOver(true); // Si toca el techo, terminar el juego
        }
        return newY < 0 ? 0 : newY;
      });

      // Mover los obstáculos
      setObstacleX((prev) => {
        const newX = prev - speed;
        if (newX < -obstacleWidth) {
          // Generar nuevos obstáculos
          const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
          setObstacleIndex(randomIndex);
          setObstaclesPassed((prev) => prev + 1); // Incrementar el contador de obstáculos pasados
          setHasPassedObstacle(false);
          return window.innerWidth;
        }
        return newX;
      });

      // Detectar si el jugador ha pasado el obstáculo
      if (obstacleX + obstacleWidth < window.innerWidth * 0.60 - 25 && !hasPassedObstacle && !gameOver) {
        setScore((prevScore) => prevScore + 20);
        setHasPassedObstacle(true);
      }

      // Detectar colisiones
      if (isColliding()) {
        setGameOver(true); // Terminar el juego si hay colisión
      }

      // Aumentar la velocidad después de pasar 3 obstáculos
      if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0 && !speedIncreased) {
        setSpeed((prevSpeed) => prevSpeed + 0.5); // Aumentar la velocidad
        setSpeedIncreased(true); // Marcar que ya se ha aumentado la velocidad
      }

      if (obstaclesPassed % 3 !== 0) {
        setSpeedIncreased(false); // Restablecer la bandera de velocidad cuando no se ha pasado 3 obstáculos
      }
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [velocity, gravity, speed, gameOver, gameStarted, countdown, obstacleX, hasPassedObstacle, obstaclesPassed, speedIncreased]);

  const isColliding = () => {
    const birdBottom = yPosition + 50;
    const birdTop = yPosition;
    const birdLeft = window.innerWidth * 0.60 - 25;
    const birdRight = birdLeft + 50;

    const { topHeight, bottomHeight, gap } = obstacleConfigurations[obstacleIndex];

    const bottomObstacleTop = window.innerHeight - bottomHeight;
    const hitBottomObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdBottom > bottomObstacleTop;
    const topObstacleBottom = bottomObstacleTop - gap;
    const hitTopObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdTop < topObstacleBottom;

    return hitBottomObstacle || hitTopObstacle;
  };

  // Mostrar la pantalla de Game Over
  if (gameOver || isColliding()) {
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverMessage}>
          <h1 style={styles.gameOverText}>Game Over</h1>
          <h2 style={styles.finalScore}>Final Score: {score}</h2>
          <button style={styles.retryButton} onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // Mostrar el contador antes de comenzar el juego
  if (!gameStarted && countdown > 0) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.countdown,
          top: `${yPosition - 60}px`,
        }}>
          {countdown}
        </div>
      </div>
    );
  }

  const { topHeight, bottomHeight, color, gap } = obstacleConfigurations[obstacleIndex];

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.circle,
        top: `${yPosition}px`,
        backgroundColor: 'red',
        left: '60%',
      }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        bottom: '0',
        width: `${obstacleWidth}px`,
        height: `${bottomHeight}px`,
        backgroundColor: color,
        border: '3px solid black',
        boxSizing: 'border-box',
      }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        top: '0',
        width: `${obstacleWidth}px`,
        height: `${topHeight}px`,
        backgroundColor: color,
        border: '3px solid black',
        boxSizing: 'border-box',
        bottom: `calc(100vh - ${bottomHeight + gap}px)`,
      }} />
      <div style={styles.score}>
        Score: {score}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#87CEEB',
  },
  circle: {
    position: 'absolute',
    left: '50%',
    top: '0',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
  },
  countdown: {
    position: 'absolute',
    fontSize: '100px',
    color: 'white',
    fontWeight: 'bold',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  score: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'white',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#d32f2f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  gameOverMessage: {
    textAlign: 'center',
  },
  gameOverText: {
    fontSize: '80px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '3px 3px 8px rgba(0, 0, 0, 0.7)',
  },
  finalScore: {
    fontSize: '40px',
    color: 'white',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  retryButton: {
    padding: '15px 30px',
    fontSize: '20px',
    backgroundColor: '#ffeb3b',
    color: '#d32f2f',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
