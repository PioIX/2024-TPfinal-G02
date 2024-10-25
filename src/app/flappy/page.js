// src/app/flappy/page.js

"use client"; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [yPosition, setYPosition] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const gravity = 0.5; 

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
    };

    const interval = setInterval(gameLoop, 16); 

    return () => {
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [velocity, gravity]);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.circle, top: `${yPosition}px` }} />
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