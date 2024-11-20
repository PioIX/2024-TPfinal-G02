"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [yPosition, setYPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(6.5);
  const [gravity, setGravity] = useState(0.5);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(-1);
  const [speedIncreased, setSpeedIncreased] = useState(false);

  const obstacleWidth = 60;
  const obstacleSpacing = 1000 // Aumentado el espacio entre obstáculos

  const obstacleConfigurations = [
    { topHeight: 360, bottomHeight: 360, color: "#0f9d58", gap: 164 },
    { topHeight: 520, bottomHeight: 200, color: "#0f9d58", gap: 164 },
    { topHeight: 590, bottomHeight: 130, color: "#0f9d58", gap: 164 },
    { topHeight: 130, bottomHeight: 590, color: "#0f9d58", gap: 164 },
    { topHeight: 200, bottomHeight: 520, color: "#0f9d58", gap: 164 },
    { topHeight: 270, bottomHeight: 450, color: "#0f9d58", gap: 164 },
    { topHeight: 450, bottomHeight: 270, color: "#0f9d58", gap: 164 },
  ];

  const createObstacle = (x) => {
    const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
    return {
      x,
      ...obstacleConfigurations[randomIndex],
      passed: false,
      index: randomIndex,
    };
  };

  // Modificada la inicialización de obstáculos
  const initializeObstacles = () => {
    const numberOfObstacles = Math.ceil((window.innerWidth * 2) / obstacleSpacing); // Calculamos cuántos obstáculos necesitamos
    const newObstacles = [];
    
    // Generamos obstáculos desde más allá del borde derecho de la pantalla
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = window.innerWidth + (i * obstacleSpacing);
      newObstacles.push(createObstacle(x));
    }
    setObstacles(newObstacles);
  };

  const jump = () => {
    if (!gameOver) {
      setVelocity(-9);
      setScore((prevScore) => prevScore + 1);
    }
  };

  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25);
    initializeObstacles();
  }, []);

  const handleClick = () => {
    if (!gameOver) {
      jump();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
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
        jump();
      }
    }

    const gameLoop = () => {
      if (gameOver) return;

      setVelocity((prev) => prev + gravity);

      setYPosition((prev) => {
        const newY = prev + velocity;
        if (newY > window.innerHeight - 50) return window.innerHeight - 50;
        return newY < 0 ? 0 : newY;
      });

      setObstacles((currentObstacles) => {
        let newObstacles = currentObstacles.map((obstacle) => {
          const newX = obstacle.x - speed;
          
          // Si el obstáculo sale de la pantalla, lo reposicionamos al final
          if (newX < -obstacleWidth) {
            const farthestX = Math.max(...currentObstacles.map(o => o.x));
            return createObstacle(farthestX + obstacleSpacing);
          }

          // Si el pájaro pasa el obstáculo
          if (!obstacle.passed && newX + obstacleWidth < window.innerWidth * 0.6 - 25) {
            setScore((prevScore) => prevScore + 20);
            setObstaclesPassed((prev) => prev + 1);
            return { ...obstacle, x: newX, passed: true };
          }

          return { ...obstacle, x: newX };
        });

        // Ordenamos los obstáculos por posición X para mantener la consistencia
        newObstacles.sort((a, b) => a.x - b.x);
        return newObstacles;
      });

      if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0 && !speedIncreased) {
        setSpeed((prevSpeed) => prevSpeed + 0.5);
        setSpeedIncreased(true);
      }

      if (obstaclesPassed % 3 !== 0) {
        setSpeedIncreased(false);
      }

      if (isColliding()) {
        setGameOver(true);
        setScore((prevScore) => prevScore - 15);
      }

      if (yPosition <= 0) {
        setGameOver(true);
        setScore((prevScore) => prevScore - 15);
      }
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [velocity, gravity, speed, gameOver, gameStarted, countdown, obstacles, obstaclesPassed, speedIncreased, yPosition]);

  const isColliding = () => {
    const circleRadius = 25;
    const circleX = window.innerWidth * 0.6;
    const circleY = yPosition + circleRadius;

    return obstacles.some((obstacle) => {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacleWidth;
      const obstacleTop = obstacle.topHeight;
      const obstacleBottom = window.innerHeight - obstacle.bottomHeight;

      const hitTopObstacle =
        circleX + circleRadius > obstacleLeft &&
        circleX - circleRadius < obstacleRight &&
        circleY - circleRadius < obstacleTop;

      const hitBottomObstacle =
        circleX + circleRadius > obstacleLeft &&
        circleX - circleRadius < obstacleRight &&
        circleY + circleRadius > obstacleBottom;

      return hitTopObstacle || hitBottomObstacle;
    });
  };

  if (gameOver) {
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverMessage}>
          <h1 style={styles.gameOverText}>Game Over</h1>
          <h2 style={styles.finalScore}>Final Score: {score}</h2>
          <button
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted && countdown > 0) {
    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.countdown,
            top: `${yPosition - 60}px`,
          }}
        >
          {countdown}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.circle,
          top: `${yPosition}px`,
          backgroundColor: "red",
          left: "60%",
        }}
      />
      {obstacles.map((obstacle, index) => (
        <div key={index}>
          <div
            style={{
              position: "absolute",
              left: `${obstacle.x}px`,
              bottom: "0",
              width: `${obstacleWidth}px`,
              height: `${obstacle.bottomHeight}px`,
              backgroundColor: obstacle.color,
              border: "3px solid black",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${obstacle.x}px`,
              top: "0",
              width: `${obstacleWidth}px`,
              height: `${obstacle.topHeight}px`,
              backgroundColor: obstacle.color,
              border: "3px solid black",
              boxSizing: "border-box",
              bottom: `calc(100vh - ${obstacle.bottomHeight + obstacle.gap}px)`,
            }}
          />
        </div>
      ))}
      <div style={styles.score}>Score: {score}</div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#87CEEB",
  },
  circle: {
    position: "absolute",
    left: "50%",
    top: "0",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    transform: "translateX(-50%)",
  },
  countdown: {
    position: "absolute",
    fontSize: "100px",
    color: "white",
    fontWeight: "bold",
    left: "50%",
    transform: "translateX(-50%)",
  },
  score: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "30px",
    fontWeight: "bold",
    color: "white",
  },
  gameOverContainer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#d32f2f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  gameOverMessage: {
    textAlign: "center",
  },
  gameOverText: {
    fontSize: "80px",
    color: "white",
    fontWeight: "bold",
    marginBottom: "20px",
    textShadow: "3px 3px 8px rgba(0, 0, 0, 0.7)",
  },
  finalScore: {
    fontSize: "40px",
    color: "white",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  retryButton: {
    padding: "15px 30px",
    fontSize: "20px",
    backgroundColor: "#ffeb3b",
    color: "#d32f2f",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};