const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const players = new Map();
const gameState = {
    started: false,
    frontPlayerDead: false,
    backPlayerDead: false
};

io.on('connection', (socket) => {
    console.log('🟢 Jugador conectado:', socket.id);
    players.set(socket.id, { id: socket.id, x: 0, y: 0, score: 0 });

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
        gameState.started = true;
        gameState.frontPlayerDead = false;
        gameState.backPlayerDead = false;
        io.emit('startGame', { players: playersArray, roles });
    });

    socket.on('playerDead', (role) => {
        if (role === 'front') {
            gameState.frontPlayerDead = true;
        } else if (role === 'back') {
            gameState.backPlayerDead = true;
        }

        if (gameState.frontPlayerDead && gameState.backPlayerDead) {
            io.emit('gameOver');
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
        roles[player.id] = index === 0 ? 'front' : 'back';
    });
    return roles;
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});