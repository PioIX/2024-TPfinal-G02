"use client"; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const [obstacleX, setObstacleX] = useState(window.innerWidth); // Inicializar el obstáculo en el borde derecho
  const gravity = 0.5; 
  const obstacleWidth = 50;
  const obstacleHeight = 200; // Altura del obstáculo
  const gap = 150; // Espacio entre los obstáculos

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

      // Mover el obstáculo hacia la izquierda
      setObstacleX((prev) => {
        const newX = prev - 5; // Velocidad del obstáculo
        if (newX < -obstacleWidth) {
          // Resetear la posición del obstáculo si sale de la pantalla
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
    const birdBottom = yPosition + 50; // Parte inferior del círculo
    const birdTop = yPosition; // Parte superior del círculo
    const birdLeft = window.innerWidth / 2 - 25; // Parte izquierda del círculo
    const birdRight = window.innerWidth / 2 + 25; // Parte derecha del círculo

    // Verificar colisión con el obstáculo inferior
    const bottomObstacleTop = window.innerHeight - obstacleHeight;
    const bottomObstacleBottom = bottomObstacleTop + obstacleHeight;

    // Verificar colisión con el obstáculo superior
    const topObstacleBottom = bottomObstacleTop - gap; // Ajustar la posición del obstáculo superior

    return (
      (obstacleX < birdRight &&
      obstacleX + obstacleWidth > birdLeft &&
      (birdBottom > bottomObstacleTop)) || // Colisión con el obstáculo inferior
      (obstacleX < birdRight &&
      obstacleX + obstacleWidth > birdLeft &&
      (birdTop < topObstacleBottom)) // Colisión con el obstáculo superior
    );
  };

  if (isColliding()) {
    return <div style={{ ...styles.container, backgroundColor: 'red' }}>¡Game Over!</div>; // Pantalla de game over
  }

  return (
    <div style={styles.container}>
      <div style={{ ...styles.circle, top: `${yPosition}px` }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        bottom: '0',
        width: `${obstacleWidth}px`,
        height: `${obstacleHeight}px`,
        backgroundColor: 'green',
      }} />
      <div style={{
        position: 'absolute',
        left: `${obstacleX}px`,
        top: '0',
        width: `${obstacleWidth}px`,
        height: `${obstacleHeight}px`,
        backgroundColor: 'green',
        bottom: `calc(100vh - ${obstacleHeight + gap}px)`,
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