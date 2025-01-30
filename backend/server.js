const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir conexiones desde cualquier origen
  },
});

let players = {}; // Solo dos jugadores máximo

io.on("connection", (socket) => {
  console.log(`🟢 Usuario conectado: ${socket.id}`);

  // Si ya hay dos jugadores, rechazamos la conexión
  if (Object.keys(players).length >= 2) {
    socket.emit("gameFull"); // Enviar un evento de juego lleno
    console.log("❌ Sala llena, rechazando nuevo jugador.");
    socket.disconnect();
    return;
  }

  // Asignar rol según el orden de conexión
  const playerRole = Object.keys(players).length === 0 ? "player1" : "player2";
  players[socket.id] = playerRole;

  // Enviar a los clientes la cantidad de jugadores conectados
  io.emit("players", Object.keys(players).length);

  // Cuando hay dos jugadores, empezamos el juego
  if (Object.keys(players).length === 2) {
    io.emit("startGame", { roles: players });
  }

  socket.on("disconnect", () => {
    console.log(`🔴 Usuario desconectado: ${socket.id}`);
    delete players[socket.id]; // Remover jugador
    io.emit("players", Object.keys(players).length); // Actualizar el contador
  });
});

server.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
