"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket;
let otherPlayers = new Map();

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
  const [playersCount, setPlayersCount] = useState(0); // Contador de jugadores conectados
  const gameRef = useRef(null);

  const obstacleWidth = 60;
  const obstacleSpacing = 1000;
  const playerSize = 50;

  const obstacleConfigurations = [
    { topHeight: 360, bottomHeight: 360, color: "linear-gradient(45deg, #00ff00, #66cc66)", gap: 164 },
    { topHeight: 520, bottomHeight: 200, color: "linear-gradient(45deg, #00cc00, #66ff66)", gap: 164 },
    { topHeight: 590, bottomHeight: 130, color: "linear-gradient(45deg, #00cc66, #33cc66)", gap: 164 },
    { topHeight: 130, bottomHeight: 590, color: "linear-gradient(45deg, #66cc00, #66ff33)", gap: 164 },
    { topHeight: 200, bottomHeight: 520, color: "linear-gradient(45deg, #33cc33, #66cc33)", gap: 164 },
    { topHeight: 270, bottomHeight: 450, color: "linear-gradient(45deg, #339933, #66cc66)", gap: 164 },
    { topHeight: 450, bottomHeight: 270, color: "linear-gradient(45deg, #66cc66, #33cc33)", gap: 164 },
  ];

  // Inicializar el socket
  useEffect(() => {
    console.log("🎮 Iniciando multijugador...");
    socket = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor con ID:", socket.id);
      const initialPosition = {
        x: window.innerWidth * 0.6,
        y: yPosition,
      };
      socket.emit("playerJoin", initialPosition);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión:", error);
    });

    socket.on("players", (players) => {
      console.log("📥 Recibidos datos de jugadores:", players);
      otherPlayers.clear();
      players.forEach((player) => {
        if (player.id !== socket.id) {
          otherPlayers.set(player.id, player);
        }
      });
      setPlayersCount(players.length);
    });

    const pingInterval = setInterval(() => {
      if (socket?.connected) {
        socket.emit("ping", { time: new Date().getTime() });
      }
    }, 5000);

    return () => {
      clearInterval(pingInterval);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [yPosition]);

  const createObstacle = (x) => {
    const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
    return {
      x,
      ...obstacleConfigurations[randomIndex],
      passed: false,
      index: randomIndex,
    };
  };

  const initializeObstacles = () => {
    const numberOfObstacles = Math.ceil((window.innerWidth * 2) / obstacleSpacing);
    const newObstacles = [];
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = window.innerWidth + i * obstacleSpacing;
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
    setYPosition(window.innerHeight / 2 - playerSize / 2);
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
      if (playersCount < 2) {
        return; // No iniciar el juego hasta que haya al menos 2 jugadores
      }

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
        if (newY > window.innerHeight - playerSize) return window.innerHeight - playerSize;
        return newY < 0 ? 0 : newY;
      });

      setObstacles((currentObstacles) => {
        let newObstacles = currentObstacles.map((obstacle) => {
          const newX = obstacle.x - speed;

          if (newX < -obstacleWidth) {
            const farthestX = Math.max(...currentObstacles.map((o) => o.x));
            return createObstacle(farthestX + obstacleSpacing);
          }

          if (!obstacle.passed && newX + obstacleWidth < window.innerWidth * 0.6 - playerSize / 2) {
            setScore((prevScore) => prevScore + 10);
            setObstaclesPassed((prev) => prev + 1);
            return { ...obstacle, x: newX, passed: true };
          }

          return { ...obstacle, x: newX };
        });

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

      if (socket?.connected) {
        socket.emit("updatePosition", {
          x: window.innerWidth * 0.6,
          y: yPosition,
        });
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
    obstacles,
    obstaclesPassed,
    speedIncreased,
    yPosition,
    playersCount,
  ]);

  const isColliding = () => {
    const playerX = window.innerWidth * 0.6 - playerSize / 2;
    const playerY = yPosition;

    return obstacles.some((obstacle) => {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacleWidth;
      const obstacleTop = obstacle.topHeight;
      const obstacleBottom = window.innerHeight - obstacle.bottomHeight;

      const hitTopObstacle =
        playerX + playerSize > obstacleLeft &&
        playerX < obstacleRight &&
        playerY < obstacleTop;

      const hitBottomObstacle =
        playerX + playerSize > obstacleLeft &&
        playerX < obstacleRight &&
        playerY + playerSize > obstacleBottom;

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
        {playersCount < 2 && (
          <div style={styles.waitingMessage}>Waiting for another player...</div>
        )}
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
      <img
        src="/images/FlappyRojo.png"
        alt="Player"
        style={{
          ...styles.circle,
          top: `${yPosition}px`,
          transform: "translate(-50%, 0)",
          width: `${playerSize}px`,
          height: `${playerSize}px`,
        }}
      />
      {Array.from(otherPlayers.values()).map((player, index) => (
        <div
          key={`player-${index}`}
          style={{
            ...styles.circle,
            top: `${player.y}px`,
            left: `${player.x}px`,
            backgroundColor: "blue",
          }}
        />
      ))}
      {obstacles.map((obstacle, index) => (
        <div key={index}>
          <div
            style={{
              position: "absolute",
              left: `${obstacle.x}px`,
              bottom: "0",
              width: `${obstacleWidth}px`,
              height: `${obstacle.bottomHeight}px`,
              background: obstacle.color,
              boxSizing: "border-box",
              borderRadius: "3px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${obstacle.x}px`,
              top: "0",
              width: `${obstacleWidth}px`,
              height: `${obstacle.topHeight}px`,
              background: obstacle.color,
              boxSizing: "border-box",
              borderRadius: "3px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
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
    margin: -8,
    padding: -8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    left: "50%",
    top: "0",
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
  waitingMessage: {
    position: "absolute",
    fontSize: "30px",
    color: "white",
    fontWeight: "bold",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 20,
  },
};
