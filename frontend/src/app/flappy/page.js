"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [yPosition, setYPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(6.5);
  const [gravity, setGravity] = useState(0.5);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(-21);
  const [hasPassedObstacle, setHasPassedObstacle] = useState(false);
  const [speedIncreased, setSpeedIncreased] = useState(false);

  const obstacleWidth = 60;

  const obstacleConfigurations = [
    { topHeight: 360, bottomHeight: 360, color: "#0f9d58", gap: 164 },
    { topHeight: 520, bottomHeight: 200, color: "#0f9d58", gap: 164 },
    { topHeight: 590, bottomHeight: 130, color: "#0f9d58", gap: 164 },
    { topHeight: 130, bottomHeight: 590, color: "#0f9d58", gap: 164 },
    { topHeight: 200, bottomHeight: 520, color: "#0f9d58", gap: 164 },
    { topHeight: 270, bottomHeight: 450, color: "#0f9d58", gap: 164 },
    { topHeight: 450, bottomHeight: 270, color: "#0f9d58", gap: 164 },
  ];

  // Función para el salto
  const jump = () => {
    if (!gameOver) {
      setVelocity(-9);
      setScore((prevScore) => prevScore + 1);
    }
  };

  useEffect(() => {
    setYPosition(window.innerHeight / 2 - 25); // Inicializa la posición vertical del pájaro en el centro
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
        return newY < 0 ? 0 : newY; // Evita que se mueva fuera de la pantalla en el techo
      });

      setObstacleX((prev) => {
        const newX = prev - speed;
        if (newX < -obstacleWidth) {
          const randomIndex = Math.floor(
            Math.random() * obstacleConfigurations.length
          );
          setObstacleIndex(randomIndex);
          setObstaclesPassed((prev) => prev + 1);
          setHasPassedObstacle(false);
          return window.innerWidth;
        }
        return newX;
      });

      if (
        obstacleX + obstacleWidth < window.innerWidth * 0.6 - 25 &&
        !hasPassedObstacle &&
        !gameOver
      ) {
        setScore((prevScore) => prevScore + 20);
        setHasPassedObstacle(true);
      }

      if (obstaclesPassed > 0 && obstaclesPassed % 3 === 0 && !speedIncreased) {
        setSpeed((prevSpeed) => prevSpeed + 0.5);
        setSpeedIncreased(true);
      }

      if (obstaclesPassed % 3 !== 0) {
        setSpeedIncreased(false);
      }

      if (isColliding()) {
        setGameOver(true);
        setScore((prevScore) => prevScore - 15); // Resta 15 puntos cuando se acaba el juego
      }

      if (yPosition <= 0) { // Verificar si tocó el techo
        setGameOver(true);
        setScore((prevScore) => prevScore - 15); // Resta 15 puntos si el pájaro toca el techo
      }
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [
    velocity,
    gravity,
    speed,
    gameOver,
    gameStarted,
    countdown,
    obstacleX,
    hasPassedObstacle,
    obstaclesPassed,
    speedIncreased,
    yPosition,
  ]);

  const isColliding = () => {
    const circleRadius = 25; // Radio del círculo (50px de diámetro dividido entre 2)
    const circleX = window.innerWidth * 0.6; // Posición X del círculo
    const circleY = yPosition + circleRadius; // Centro del círculo en Y

    const obstacleLeft = obstacleX;
    const obstacleRight = obstacleX + obstacleWidth;
    const obstacleTop = obstacleConfigurations[obstacleIndex].topHeight;
    const obstacleBottom =
      window.innerHeight - obstacleConfigurations[obstacleIndex].bottomHeight;

    // Verificar colisión con la parte superior o inferior del obstáculo
    const hitTopObstacle =
      circleX + circleRadius > obstacleLeft &&
      circleX - circleRadius < obstacleRight &&
      circleY - circleRadius < obstacleTop;

    const hitBottomObstacle =
      circleX + circleRadius > obstacleLeft &&
      circleX - circleRadius < obstacleRight &&
      circleY + circleRadius > obstacleBottom;

    return hitTopObstacle || hitBottomObstacle;
  };

  const redirectToHome = () => {
    window.location.href = "/"; // Redirige a la página principal
  };

  if (gameOver) {
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverMessage}>
          <h1 style={styles.gameOverText}>Game Over</h1>
          <h2 style={styles.finalScore}>Final Score: {score}</h2>
          <div style={styles.buttonsContainer}>
            <button
              style={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              style={styles.menuButton}
              onClick={redirectToHome}
            >
              Menu
            </button>
          </div>
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

  const { topHeight, bottomHeight, color, gap } = obstacleConfigurations[obstacleIndex];

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
      <div
        style={{
          position: "absolute",
          left: `${obstacleX}px`,
          bottom: "0",
          width: `${obstacleWidth}px`,
          height: `${bottomHeight}px`,
          backgroundColor: color,
          border: "3px solid black",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${obstacleX}px`,
          top: "0",
          width: `${obstacleWidth}px`,
          height: `${topHeight}px`,
          backgroundColor: color,
          border: "3px solid black",
          boxSizing: "border-box",
          bottom: `calc(100vh - ${bottomHeight + gap}px)`,
        }}
      />
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
    top: "10px",
    left: "10px",
    fontSize: "20px",
    color: "black",
    fontWeight: "bold",
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "column", // Asegura que los botones estén uno debajo del otro
    gap: "10px", // Añade espacio entre los botones
  },
  retryButton: {
    padding: "10px 20px", // Reduce el padding para que los botones no sean tan anchos
    fontSize: "20px",
    backgroundColor: "#ffeb3b",
    color: "#d32f2f",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "auto", // Puedes quitar esta línea si prefieres un tamaño más ajustado
  },
  
  menuButton: {
    padding: "10px 20px", // Reduce el padding también aquí
    fontSize: "20px",
    backgroundColor: "#ffeb3b",
    color: "#d32f2f",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "auto", // Igual que arriba, esta línea puede ser ajustada
  },
};
