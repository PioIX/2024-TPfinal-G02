"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const [player1Position, setPlayer1Position] = useState(0);
  const [player2Position, setPlayer2Position] = useState(0);
  const [player1Velocity, setPlayer1Velocity] = useState(0);
  const [player2Velocity, setPlayer2Velocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(6.5);
  const [gravity, setGravity] = useState(0.5);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [player1Score, setPlayer1Score] = useState(-1);
  const [player2Score, setPlayer2Score] = useState(-1);
  const [speedIncreased, setSpeedIncreased] = useState(false);

  const obstacleWidth = 60;
  const obstacleSpacing = 1000;
  const playerSize = 90;
  const hitboxOffset = 12;
  const playerHitboxSize = playerSize - (hitboxOffset * 2);
  const player2XOffset = -100;

  const obstacleConfigurations = [
    { topHeight: 360, bottomHeight: 360, gap: 170 },
    { topHeight: 520, bottomHeight: 200, gap: 170 },
    { topHeight: 590, bottomHeight: 130, gap: 170 },
    { topHeight: 130, bottomHeight: 590, gap: 170 },
    { topHeight: 200, bottomHeight: 520, gap: 170 },
    { topHeight: 270, bottomHeight: 450, gap: 170 },
    { topHeight: 450, bottomHeight: 270, gap: 170 },
  ];

  const createObstacle = (x) => {
    const randomIndex = Math.floor(Math.random() * obstacleConfigurations.length);
    return {
      x,
      ...obstacleConfigurations[randomIndex],
      passed: false,
      passedByPlayer2: false,
      index: randomIndex,
    };
  };

  const initializeObstacles = () => {
    const numberOfObstacles = Math.ceil((window.innerWidth * 2) / obstacleSpacing);
    const newObstacles = [];
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = window.innerWidth + (i * obstacleSpacing);
      newObstacles.push(createObstacle(x));
    }
    setObstacles(newObstacles);
  };

  const jump = (isPlayer1) => {
    if (!gameOver) {
      if (isPlayer1) {
        setPlayer1Velocity(-9);
        setPlayer1Score((prevScore) => prevScore + 1);
      } else {
        setPlayer2Velocity(-9);
        setPlayer2Score((prevScore) => prevScore + 1);
      }
    }
  };

  useEffect(() => {
    const initialY = window.innerHeight / 2 - playerSize / 2;
    setPlayer1Position(initialY);
    setPlayer2Position(initialY);
    initializeObstacles();
  }, []);

  const handleClick = () => {
    if (!gameOver) {
      jump(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.code === 'Space' && !gameOver) {
      event.preventDefault();
      jump(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyPress);
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
        jump(true);
        jump(false);
      }
    }

    const gameLoop = () => {
      if (gameOver) return;

      setPlayer1Velocity((prev) => prev + gravity);
      setPlayer2Velocity((prev) => prev + gravity);

      setPlayer1Position((prev) => {
        const newY = prev + player1Velocity;
        if (newY > window.innerHeight - playerSize) return window.innerHeight - playerSize;
        return newY < 0 ? 0 : newY;
      });

      setPlayer2Position((prev) => {
        const newY = prev + player2Velocity;
        if (newY > window.innerHeight - playerSize) return window.innerHeight - playerSize;
        return newY < 0 ? 0 : newY;
      });

      setObstacles((currentObstacles) => {
        let newObstacles = currentObstacles.map((obstacle) => {
          const newX = obstacle.x - speed;

          if (newX < -obstacleWidth) {
            const farthestX = Math.max(...currentObstacles.map(o => o.x));
            return createObstacle(farthestX + obstacleSpacing);
          }

          let updatedObstacle = { ...obstacle, x: newX };

          if (!obstacle.passed && newX + obstacleWidth < window.innerWidth * 0.4 - playerSize / 2) {
            setPlayer1Score((prevScore) => prevScore + 10);
            setObstaclesPassed((prev) => prev + 1);
            updatedObstacle.passed = true;
          }

          if (!obstacle.passedByPlayer2 && newX + obstacleWidth < window.innerWidth * 0.4 - playerSize / 2 + player2XOffset) {
            setPlayer2Score((prevScore) => prevScore + 10);
            updatedObstacle.passedByPlayer2 = true;
          }

          return updatedObstacle;
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

      if (isColliding(true) || isColliding(false)) {
        setGameOver(true);
        if (isColliding(true)) setPlayer1Score((prevScore) => prevScore - 15);
        if (isColliding(false)) setPlayer2Score((prevScore) => prevScore - 15);
      }

      if (player1Position <= 0 || player2Position <= 0) {
        setGameOver(true);
        if (player1Position <= 0) setPlayer1Score((prevScore) => prevScore - 15);
        if (player2Position <= 0) setPlayer2Score((prevScore) => prevScore - 15);
      }
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [player1Velocity, player2Velocity, gravity, speed, gameOver, gameStarted, countdown, obstacles, obstaclesPassed, speedIncreased, player1Position, player2Position]);

  const isColliding = (isPlayer1) => {
    const playerX = window.innerWidth * 0.4 + (isPlayer1 ? 0 : player2XOffset);
    const playerY = isPlayer1 ? player1Position + hitboxOffset : player2Position + hitboxOffset;

    return obstacles.some((obstacle) => {
      const obstacleLeft = obstacle.x + 5;
      const obstacleRight = obstacle.x + obstacleWidth - 5;
      const obstacleTop = obstacle.topHeight;
      const obstacleBottom = window.innerHeight - obstacle.bottomHeight;

      const hitTopObstacle =
        playerX + playerHitboxSize > obstacleLeft &&
        playerX < obstacleRight &&
        playerY < obstacleTop;

      const hitBottomObstacle =
        playerX + playerHitboxSize > obstacleLeft &&
        playerX < obstacleRight &&
        playerY + playerHitboxSize > obstacleBottom;

      return hitTopObstacle || hitBottomObstacle;
    });
  };

  if (gameOver) {
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverMessage}>
          <h1 style={styles.gameOverText}>Game Over</h1>
          <h2 style={styles.finalScore}>Player 1 Score: {player1Score}</h2>
          <h2 style={styles.finalScore}>Player 2 Score: {player2Score}</h2>
          <h2 style={styles.finalScore}>
            Winner: {player1Score > player2Score ? "Player 1" : player1Score < player2Score ? "Player 2" : "Tie!"}
          </h2>
          <button
            style={styles.retryButton}
            onClick={() => window.location.href = '/'}
          >
            Volver
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
            top: `${player1Position - 60}px`,
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
        alt="Player 1"
        style={{
          ...styles.circle,
          top: `${player1Position}px`,
          left: "40%",
          transform: "translate(-50%, 0)",
          width: `${playerSize}px`,
          height: `${playerSize}px`,
        }}
      />
      <img
        src="/images/FlappyRojo.png"
        alt="Player 2"
        style={{
          ...styles.circle,
          top: `${player2Position}px`,
          left: `calc(40% + ${player2XOffset}px)`,
          transform: "translate(-50%, 0)",
          width: `${playerSize}px`,
          height: `${playerSize}px`,
          filter: "hue-rotate(240deg) brightness(1.2) contrast(1.3)",
        }}
      />
      
      {obstacles.map((obstacle, index) => (
        <div key={index}>
          <div style={{
            position: "absolute",
            left: `${obstacle.x}px`,
            bottom: "0",
            width: `${obstacleWidth}px`,
            height: `${obstacle.bottomHeight}px`,
            background: "#75C147",
            boxSizing: "border-box",
            borderLeft: "3px solid #558B2F",
            borderRight: "3px solid #558B2F",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              width: "100%",
              height: "20px",
              background: "#558B2F",
              borderRadius: "4px 4px 0 0",
              boxShadow: "inset 0 -2px 3px rgba(0, 0, 0, 0.3)"
            }} />
            <div style={{
              position: "absolute",
              top: "20px",
              left: "10px",
              width: "8px",
              height: "100%",
              background: "rgba(255, 255, 255, 0.1)"
            }} />
          </div>
          <div style={{
            position: "absolute",
            left: `${obstacle.x}px`,
            top: "0",
            width: `${obstacleWidth}px`,
            height: `${obstacle.topHeight}px`,
            background: "#75C147",
            boxSizing: "border-box",
            borderLeft: "3px solid #558B2F",
            borderRight: "3px solid #558B2F",
          }}>
            <div style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              height: "20px",
              background: "#558B2F",
              borderRadius: "0 0 4px 4px",
              boxShadow: "inset 0 2px 3px rgba(0, 0, 0, 0.3)"
            }} />
            <div style={{
              position: "absolute",
              top: "0",
              left: "10px",
              width: "8px",
              height: "100%",
              background: "rgba(255, 255, 255, 0.1)"
            }} />
          </div>
        </div>
      ))}
      <div style={styles.score}>
        <div>Player 1 Score: {player1Score}</div>
        <div>Player 2 Score: {player2Score}</div>
      </div>
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
    top: "0",
    zIndex: 1,
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
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    border: "2px solid #fffb00",
    zIndex: 10,
  },
  gameOverContainer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  gameOverMessage: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: "36px",
    fontWeight: "bold",
  },
  gameOverText: {
    fontSize: "60px",
    margin: "20px 0",
  },
  finalScore: {
    fontSize: "24px",
    margin: "10px 0",
  },
  retryButton: {
    backgroundColor: "#fffb00",
    padding: "12px 24px",
    fontSize: "24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};
