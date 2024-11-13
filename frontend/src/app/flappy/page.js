"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(7);
  const [gravity, setGravity] = useState(0.5);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(-1);
  const [hasPassedObstacle, setHasPassedObstacle] = useState(false);
  const obstacleWidth = 60;

  const obstacleConfigurations = [
    { topHeight: 310, bottomHeight: 310, color: '#0f9d58', gap: 164 },
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 164 },
    { topHeight: 190, bottomHeight: 430, color: '#e91e63', gap: 164 },
    { topHeight: 360, bottomHeight: 260, color: '#9e9e9e', gap: 164 },
    { topHeight: 390, bottomHeight: 230, color: '#3f51b5', gap: 164 },
    { topHeight: 100, bottomHeight: 520, color: '#f44336', gap: 164 },
    { topHeight: 130, bottomHeight: 490, color: '#9c27b0', gap: 164 },
    { topHeight: 190, bottomHeight: 430, color: '#2196f3', gap: 164 },
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 164 },
    { topHeight: 450, bottomHeight: 170, color: '#8bc34a', gap: 164 },
    { topHeight: 380, bottomHeight: 220, color: '#4caf50', gap: 164 },
    { topHeight: 450, bottomHeight: 170, color: '#ffeb3b', gap: 164 },
    { topHeight: 410, bottomHeight: 210, color: '#673ab7', gap: 164 },
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 164 },
    { topHeight: 520, bottomHeight: 100, color: '#ffeb3b', gap: 164 },
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 164 },
  ];

  // Asegurarse de que el salto solo sume 1 punto
  const jump = () => {
    if (!gameOver) {
      setVelocity(-9);
      setScore((prevScore) => prevScore + 1); // Solo 1 punto por salto
    }
  };

  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25);
  }, []);

  useEffect(() => {
    const handleClick = () => jump();
    window.addEventListener('click', handleClick);

    if (!gameStarted) {
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setGameStarted(true);
        setCountdown(0);
        jump();
      }
    }

    const gameLoop = () => {
      if (gameOver) return; // Evitar ejecutar el bucle de juego cuando el juego haya terminado

      setVelocity((prev) => prev + gravity);
      setYPosition((prev) => {
        const newY = prev + velocity;
        if (newY > window.innerHeight - 50) return window.innerHeight - 50;
        if (newY <= 0) {
          setGameOver(true);
        }
        return newY < 0 ? 0 : newY;
      });

      setObstacleX((prev) => {
        const newX = prev - speed;
        if (newX < -obstacleWidth) {
          const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
          setObstacleIndex(randomIndex);
          setObstaclesPassed((prev) => prev + 1);
          setHasPassedObstacle(false);
          return window.innerWidth;
        }
        return newX;
      });

      if (obstacleX + obstacleWidth < window.innerWidth * 0.60 - 25 && !hasPassedObstacle && !gameOver) {
        setScore((prevScore) => prevScore + 20);
        setObstaclesPassed((prev) => prev + 1);
        setHasPassedObstacle(true);
      }

      if (isColliding()) {
        setGameOver(true);
      }
    };

    const interval = setInterval(gameLoop, 16);

    return () => {
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [velocity, gravity, speed, gameOver, gameStarted, countdown, obstacleX, hasPassedObstacle]);

  // Aumentar velocidad cada 3 obstáculos
  useEffect(() => {
    if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0) {
      setSpeed((prevSpeed) => prevSpeed + 0.5);
    }
  }, [obstaclesPassed]);

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
      <div style={{ ...styles.gameOverContainer }}>
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
        {console.log(speed)}
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
