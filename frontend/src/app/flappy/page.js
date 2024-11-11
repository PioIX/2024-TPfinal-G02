"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const gravity = 0.5;
  const obstacleWidth = 65;
  const [speed, setSpeed] = useState(7);
  const [gameOver, setGameOver] = useState(false);

  const obstacleConfigurations = [
    { topHeight: 310, bottomHeight: 310, color: '#0f9d58', gap: 170 },
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 170 },
    { topHeight: 190, bottomHeight: 430, color: '#e91e63', gap: 170 },
    { topHeight: 360, bottomHeight: 260, color: '#9e9e9e', gap: 170 },
    { topHeight: 390, bottomHeight: 230, color: '#3f51b5', gap: 170 },
    { topHeight: 100, bottomHeight: 520, color: '#f44336', gap: 170 },
    { topHeight: 130, bottomHeight: 490, color: '#9c27b0', gap: 170 },
    { topHeight: 190, bottomHeight: 430, color: '#2196f3', gap: 170 },
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 170 },
    { topHeight: 450, bottomHeight: 170, color: '#8bc34a', gap: 170 },
    { topHeight: 380, bottomHeight: 220, color: '#4caf50', gap: 170 },
    { topHeight: 450, bottomHeight: 170, color: '#ffeb3b', gap: 170 },
    { topHeight: 410, bottomHeight: 210, color: '#673ab7', gap: 170 },
    { topHeight: 480, bottomHeight: 120, color: '#ff9800', gap: 170 },
    { topHeight: 520, bottomHeight: 100, color: '#ffeb3b', gap: 170 },
    { topHeight: 530, bottomHeight: 90, color: '#ff9800', gap: 170 },
  ];

  const jump = () => {
    setVelocity(-10);
  };

  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25);
  }, []);

  useEffect(() => {
    const handleClick = () => jump();

    window.addEventListener('click', handleClick);

    const gameLoop = () => {
      if (gameOver) return;

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
          return window.innerWidth;
        }
        return newX;
      });

      if (isColliding()) {
        setGameOver(true);
      }
    };

    const interval = setInterval(gameLoop, 16);

    return () => {
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [velocity, gravity, speed, gameOver]);

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

    const { topHeight, bottomHeight, gap } = obstacleConfigurations[obstacleIndex];

    const bottomObstacleTop = window.innerHeight - bottomHeight;
    const topObstacleBottom = bottomObstacleTop - gap;

    const hitBottomObstacle =
      obstacleX < birdRight &&
      obstacleX + obstacleWidth > birdLeft &&
      birdBottom > bottomObstacleTop;

    const hitTopObstacle =
      obstacleX < birdRight &&
      obstacleX + obstacleWidth > birdLeft &&
      birdTop < topObstacleBottom;

    return hitBottomObstacle || hitTopObstacle;
  };

  if (gameOver || isColliding()) {
    return <div style={{ ...styles.container, backgroundColor: 'red' }}>¡Game Over!</div>;
  }

  const { topHeight, bottomHeight, color, gap } = obstacleConfigurations[obstacleIndex];

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.circle,
        top: `${yPosition}px`,
        backgroundColor: 'red',
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
};

