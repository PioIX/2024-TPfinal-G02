const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// Mapa para almacenar jugadores conectados
const players = new Map();

io.on('connection', (socket) => {
    console.log('🟢 Jugador conectado:', socket.id);
    players.set(socket.id, { id: socket.id, x: 0, y: 0, score: 0 });

    // Emitir lista de jugadores actualizada
    io.emit('players', Array.from(players.values()));

    socket.on('playerJoin', (playerData) => {
        if (players.has(socket.id)) {
            players.set(socket.id, { ...playerData, id: socket.id });
            io.emit('players', Array.from(players.values()));
        }
    });

    socket.on('startGame', () => {
        const playersArray = Array.from(players.values());
        const roles = assignRoles(playersArray);
        io.emit('startGame', { players: playersArray, roles });
    });

    socket.on('updatePosition', (position) => {
        if (players.has(socket.id)) {
            players.get(socket.id).x = position.x;
            players.get(socket.id).y = position.y;
            io.emit('players', Array.from(players.values()));
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Jugador desconectado:', socket.id);
        players.delete(socket.id);
        io.emit('players', Array.from(players.values()));
    });
});

function assignRoles(playersArray) {
    const roles = {};
    playersArray.forEach((player, index) => {
        roles[player.id] = index === 0 ? 'front' : 'back'; // Alternar roles
    });
    return roles;
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
