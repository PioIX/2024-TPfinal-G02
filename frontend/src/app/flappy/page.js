"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); // Valor inicial temporal
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const gravity = 0.5; // La gravedad hace que el círculo caiga
  const obstacleWidth = 65;
  const [speed, setSpeed] = useState(7);
  const [gameOver, setGameOver] = useState(false); // Estado para verificar si el juego ha terminado

  const obstacleConfigurations = [
    { topHeight: 310, bottomHeight: 310, color: '#0f9d58', gap: 170 },  // Verde
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 170 },  // Naranja
    { topHeight: 190, bottomHeight: 430, color: '#e91e63', gap: 170 },  // Rosa
    { topHeight: 360, bottomHeight: 260, color: '#9e9e9e', gap: 170 },  // Gris
    { topHeight: 390, bottomHeight: 230, color: '#3f51b5', gap: 170 },  // Azul oscuro
    { topHeight: 100, bottomHeight: 520, color: '#f44336', gap: 170 },  // Rojo
    { topHeight: 130, bottomHeight: 490, color: '#9c27b0', gap: 170 },  // Púrpura claro
    { topHeight: 190, bottomHeight: 430, color: '#2196f3', gap: 170 },  // Azul claro
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 170 },  // Naranja
    { topHeight: 450, bottomHeight: 170, color: '#8bc34a', gap: 170 },  // Verde claro
    { topHeight: 380, bottomHeight: 220, color: '#4caf50', gap: 170 },  // Verde pasto
    { topHeight: 450, bottomHeight: 170, color: '#ffeb3b', gap: 170 },  // Amarillo
    { topHeight: 410, bottomHeight: 210, color: '#673ab7', gap: 170 },  // Púrpura
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 170 },  // Naranja
    { topHeight: 520, bottomHeight: 100, color: '#ffeb3b', gap: 170 },  // Amarillo
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 170 },  // Naranja
  ];

  const jump = () => {
    setVelocity(-10); // El círculo sube cuando se hace clic
  };

  // Establecer la posición inicial del círculo solo una vez al cargar la página
  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25); // El círculo comienza en el medio vertical de la pantalla
  }, []);

  useEffect(() => {
    const handleClick = () => jump();

    window.addEventListener('click', handleClick);

    const gameLoop = () => {
      if (gameOver) return; // Si el juego ha terminado, no actualices nada

      setVelocity((prev) => prev + gravity); // La gravedad aumenta la velocidad hacia abajo
      setYPosition((prev) => {
        const newY = prev + velocity;
        if (newY > window.innerHeight - 50) return window.innerHeight - 50; // Evita que el círculo caiga fuera de la pantalla
        if (newY <= 0) {
          setGameOver(true); // Si la pelota toca el techo, termina el juego
        }
        return newY < 0 ? 0 : newY; // Evita que el círculo suba fuera de la pantalla
      });

      setObstacleX((prev) => {
        const newX = prev - speed;
        if (newX < -obstacleWidth) {
          // Randomizar la configuración del siguiente obstáculo
          const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
          setObstacleIndex(randomIndex);
          setObstaclesPassed((prev) => prev + 1);
          return window.innerWidth; // Reinicia la posición del obstáculo cuando sale de la pantalla
        }
        return newX;
      });

      // Verifica si hay una colisión con los obstáculos
      if (isColliding()) {
        setGameOver(true); // Si hay colisión, termina el juego
      }
    };

    const interval = setInterval(gameLoop, 16); // Se ejecuta el bucle del juego a 60fps (16ms)

    return () => {
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [velocity, gravity, speed, gameOver]);

  useEffect(() => {
    if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0) {
      setSpeed((prevSpeed) => prevSpeed + 0.5); // Aumenta la velocidad cada 3 obstáculos
    }
  }, [obstaclesPassed]);

  const isColliding = () => {
    const birdBottom = yPosition + 50; // Parte inferior del círculo
    const birdTop = yPosition; // Parte superior del círculo
    const birdLeft = window.innerWidth / 2 - 25;
    const birdRight = window.innerWidth / 2 + 25;

    const { topHeight, bottomHeight, gap } = obstacleConfigurations[obstacleIndex];

    const bottomObstacleTop = window.innerHeight - bottomHeight;
    const hitBottomObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdBottom > bottomObstacleTop;
    const topObstacleBottom = bottomObstacleTop - gap; // Usa el gap dinámico
    const hitTopObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdTop < topObstacleBottom;

    return hitBottomObstacle || hitTopObstacle;
  };

  if (gameOver || isColliding()) {
    return <div style={{ ...styles.container, backgroundColor: 'red' }}>¡Game Over!</div>; // Cambia el fondo a rojo cuando colisiona o toca el techo
  }

  const { topHeight, bottomHeight, color, gap } = obstacleConfigurations[obstacleIndex];

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.circle,
        top: `${yPosition}px`, // Controla la posición vertical del círculo
        backgroundColor: 'red',  // El color del círculo es rojo
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
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#87CEEB', // Cielo azul claro
  },
  circle: {
    position: 'absolute',
    left: '50%',
    top: '0', // El círculo empieza en la parte superior
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
  },
};
