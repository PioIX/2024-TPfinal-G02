"use client"; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const gravity = 0.5; 
  const obstacleWidth = 65; 
  const gap = 300; 
  const [speed, setSpeed] = useState(7); 

  const obstacleConfigurations = [
    { topHeight: 310, bottomHeight: 310, color: '#0f9d58' },
    { topHeight: 430, bottomHeight: 190, color: '#f44336' },
    { topHeight: 190, bottomHeight: 430, color: '#2196f3' },
    { topHeight: 130, bottomHeight: 490, color: '#9c27b0' },
    { topHeight: 90, bottomHeight: 530, color: '#4caf50' },
    { topHeight: 490, bottomHeight: 130, color: '#ffeb3b' },
    { topHeight: 390, bottomHeight: 230, color: '#3f51b5' },
    { topHeight: 530, bottomHeight: 90, color: '#ff9800' },
    { topHeight: 190, bottomHeight: 430, color: '#e91e63' },
    { topHeight: 450, bottomHeight: 170, color: '#8bc34a' },
    { topHeight: 170, bottomHeight: 450, color: '#00bcd4' },
    { topHeight: 360, bottomHeight: 260, color: '#9e9e9e' },
    { topHeight: 260, bottomHeight: 360, color: '#c2185b' },
    { topHeight: 410, bottomHeight: 210, color: '#673ab7' },
    { topHeight: 100, bottomHeight: 520, color: '#f44336' },
    { topHeight: 480, bottomHeight: 120, color: '#ff9800' },
    { topHeight: 380, bottomHeight: 220, color: '#4caf50' },
    { topHeight: 140, bottomHeight: 480, color: '#3f51b5' },
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
        const newX = prev - speed;
        if (newX < -obstacleWidth) {
          setObstacleIndex((prevIndex) => (prevIndex + 1) % obstacleConfigurations.length);
          setObstaclesPassed((prev) => prev + 1);
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
  }, [velocity, gravity, speed]);

  useEffect(() => {
    if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0) {
      setSpeed((prevSpeed) => prevSpeed + 0.5);
    }
  }, [obstaclesPassed]);

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

  const { topHeight, bottomHeight, color } = obstacleConfigurations[obstacleIndex];

  return (
    <div style={styles.container}>
      <div style={{ 
        ...styles.circle, 
        top: `${yPosition}px`, 
        backgroundColor: obstaclesPassed >= 3 ? 'orange' : 'red',
        border: obstaclesPassed >= 3 ? '3px solid yellow' : 'none',
      }} />
      {obstaclesPassed >= 3 && (
        <div style={styles.flames} />
      )}
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
  flames: {
    position: 'absolute',
    left: '50%',
    top: '0',
    width: '70px',  // Ancho de las llamas
    height: '50px', // Alto de las llamas
    backgroundSize: 'contain',
    transform: 'translateX(-50%)',
  },
};
