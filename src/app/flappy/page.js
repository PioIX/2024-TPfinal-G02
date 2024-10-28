"use client"; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const [obstacleX, setObstacleX] = useState(window.innerWidth);
  const gravity = 0.5; 
  const obstacleWidth = 50;
  const obstacleHeight = 200; 
  const gap = 400; 

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

    
    const bottomObstacleTop = window.innerHeight - obstacleHeight;
    const bottomObstacleBottom = bottomObstacleTop + obstacleHeight;

    
    const topObstacleBottom = bottomObstacleTop - gap; 

    
    const hitBottomObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdBottom > bottomObstacleTop;
    const hitTopObstacle = obstacleX < birdRight && obstacleX + obstacleWidth > birdLeft && birdTop < topObstacleBottom;

    return hitBottomObstacle || hitTopObstacle;
  };

  if (isColliding()) {
    return <div style={{ ...styles.container, backgroundColor: 'red' }}>¡Game Over!</div>;
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
