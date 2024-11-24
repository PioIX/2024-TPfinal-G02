const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir todas las conexiones (ajusta según tu entorno de producción)
        methods: ["GET", "POST"],
    },
});

// Mapa para almacenar información de los jugadores
const players = new Map();

io.on('connection', (socket) => {
    console.log('🟢 Jugador conectado:', socket.id);

    // Agregar jugador al mapa cuando se conecta
    players.set(socket.id, { id: socket.id, x: 0, y: 0, score: 0 });

    // Emitir lista actualizada de jugadores a todos los clientes
    io.emit('players', Array.from(players.values()));

    // Escuchar cuando un jugador envía información adicional
    socket.on('playerJoin', (playerData) => {
        if (players.has(socket.id)) {
            players.set(socket.id, { ...playerData, id: socket.id });
            io.emit('players', Array.from(players.values())); // Actualizar la lista de jugadores
        }
    });

    // Escuchar cuando un jugador quiere iniciar el juego
    socket.on('startGame', () => {
        if (players.size < 2) {
            console.log("❌ No hay suficientes jugadores para iniciar el juego.");
            socket.emit('error', { message: "Debe haber al menos 2 jugadores para iniciar el juego." });
            return;
        }

        console.log("🎮 Iniciando el juego...");
        const playersArray = Array.from(players.values());
        const roles = assignRoles(playersArray); // Asignar roles

        // Emitir el evento `startGame` a todos los clientes
        io.emit('startGame', { players: playersArray, roles });
    });

    // Escuchar actualizaciones de posición de los jugadores
    socket.on('updatePosition', (position) => {
        if (players.has(socket.id)) {
            players.get(socket.id).x = position.x;
            players.get(socket.id).y = position.y;

            // Emitir la lista de jugadores actualizada a todos
            io.emit('players', Array.from(players.values()));
        }
    });

    // Escuchar desconexión de jugadores
    socket.on('disconnect', () => {
        console.log('🔴 Jugador desconectado:', socket.id);

        // Eliminar jugador del mapa y notificar a los demás
        players.delete(socket.id);
        io.emit('players', Array.from(players.values()));
    });
});

// Función para asignar roles a los jugadores
function assignRoles(playersArray) {
    const roles = {};
    playersArray.forEach((player, index) => {
        roles[player.id] = index === 0 ? 'front' : 'back'; // Primer jugador "front", los demás "back"
    });
    return roles;
}

// Ruta para verificar que el servidor está corriendo
app.get('/', (req, res) => {
    res.send("🚀 Servidor de Flappy Multiplayer activo");
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
