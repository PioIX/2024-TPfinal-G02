// backend/server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware para logs
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Servir archivos estáticos desde el frontend
app.use(express.static('../frontend'));

const players = new Map();

io.on('connection', socket => {
    console.log('🟢 Nuevo jugador conectado:', socket.id);
    
    // Enviar número actual de jugadores
    console.log(`Jugadores conectados: ${players.size}`);
    
    socket.on('playerJoin', (playerData) => {
        console.log(`📥 Jugador ${socket.id} se unió con datos:`, playerData);
        players.set(socket.id, {
            id: socket.id,
            x: playerData.x - 100,
            y: playerData.y,
            score: 0
        });
        
        // Emitir estado actualizado
        const playersArray = Array.from(players.values());
        console.log('🔄 Enviando actualización de jugadores:', playersArray);
        io.emit('players', playersArray);
    });
    
    socket.on('updatePosition', (position) => {
        const player = players.get(socket.id);
        if (player) {
            player.x = position.x - 100;
            player.y = position.y;
            io.emit('players', Array.from(players.values()));
        }
    });
    
    socket.on('disconnect', () => {
        console.log('🔴 Jugador desconectado:', socket.id);
        players.delete(socket.id);
        io.emit('players', Array.from(players.values()));
    });
    
    // Ping para verificar conexión
    socket.on('ping', () => {
        socket.emit('pong', { time: new Date().getTime() });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});