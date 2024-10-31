"use client"; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const [obstacleIndex, setObstacleIndex] = useState(0); // Índice del obstáculo actual
  const gravity = 0.5; 
  const obstacleWidth = 50;
  const gap = 300; 

  // Configuración de obstáculos con alturas incrementadas en 20
  const obstacleConfigurations = [
    { topHeight: 290, bottomHeight: 290 }, // Primer obstáculo
    { topHeight: 410, bottomHeight: 170 }, // Segundo obstáculo
    { topHeight: 170, bottomHeight: 410 }, // Tercer obstáculo
    { topHeight: 470, bottomHeight: 110 }, // Cuarto obstáculo
    { topHeight: 110, bottomHeight: 470 }, // Quinto obstáculo
    { topHeight: 510, bottomHeight: 70 },  // Sexto obstáculo
    { topHeight: 70, bottomHeight: 510 },   // Séptimo obstáculo
    { topHeight: 370, bottomHeight: 210 },  // Octavo obstáculo
    { topHeight: 170, bottomHeight: 410 },  // Noveno obstáculo
    { topHeight: 150, bottomHeight: 430 },  // Décimo obstáculo
    { topHeight: 430, bottomHeight: 150 },  // Undécimo obstáculo
  ];

  const jump = () => {
    setVelocity(-10);
  };

  useEffect(() => {
    const handleClick = () => jump();

    window.addEventListener('click', handleClick);

    const gameLoop = () => {
      setVelocity((prev) => prev + gravity);
      setYPosition((prev) => {
        const newY = prev + velocity;
        if (newY > window.innerHeight - 50) return window.innerHeight - 50; 
        return newY < 0 ? 0 : newY; 
      });

      setObstacleX((prev) => {
        const newX = prev - 5; 
        if (newX < -obstacleWidth) {
          setObstacleIndex((prevIndex) => (prevIndex + 1) % obstacleConfigurations.length); // Cambiar al siguiente obstáculo
          return window.innerWidth;
        }
        return newX;
      });
    };

    const interval = setInterval(gameLoop, 16); 

    return () => {
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [velocity, gravity]);

  const isColliding = () => {
    const birdBottom = yPosition + 50; 
    const birdTop = yPosition; 
    const birdLeft = window.innerWidth / 2 - 25;
    const birdRight = window.innerWidth / 2 + 25; 

    const { topHeight, bottomHeight } = obstacleConfigurations[obstacleIndex];

    const bottomObstacleTop = window.innerHeight - bottomHeight;
    const hitBottomObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdBottom > bottomObstacleTop;
    const topObstacleBottom = bottomObstacleTop - gap; 
    const hitTopObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdTop < topObstacleBottom;

    return hitBottomObstacle || hitTopObstacle;
  };

  if (isColliding()) {
    return <div style={{ ...styles.container, backgroundColor: 'red' }}>¡Game Over!</div>;
  }

  const { topHeight, bottomHeight } = obstacleConfigurations[obstacleIndex];

  return (
    <div style={styles.container}>
      <div style={{ ...styles.circle, top: `${yPosition}px` }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        bottom: '0',
        width: `${obstacleWidth}px`,
        height: `${bottomHeight}px`,
        backgroundColor: '#0f9d58', // Color verde
        border: '3px solid black', // Línea negra alrededor
        boxSizing: 'border-box', // Incluye el borde en el tamaño total
      }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        top: '0',
        width: `${obstacleWidth}px`,
        height: `${topHeight}px`,
        backgroundColor: '#0f9d58', // Color verde
        border: '3px solid black', // Línea negra alrededor
        boxSizing: 'border-box', // Incluye el borde en el tamaño total
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
    backgroundColor: '#87CEEB', 
  },
  circle: {
    position: 'absolute',
    left: '50%',
    top: '0',
    width: '50px',
    height: '50px',
    backgroundColor: 'red',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
  },
};