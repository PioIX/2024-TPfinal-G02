// Paquetes instalados: -g nodemon, express, body-parser, mysql2, socket.io
// Agregado al archivo "package.json" la línea --> "start": "nodemon index"

// Proyecto "Node_base"
// Desarrollo de Aplicaciones Informáticas - Proyecto de Producción - 5to Informática

// Docentes: Nicolás Facón, Matías Marchesi, Martín Rivas

// Revisión 5 - Año 2024

// Cargo librerías instaladas y necesarias
const express = require('express');
const bodyParser = require('body-parser');
const MySQL = require('./modulos/mysql');
const session = require('express-session');
const bcrypt = require('bcryptjs'); // Usamos bcrypt para comparar las contraseñas de forma segura

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const LISTEN_PORT = 4000;

const server = app.listen(LISTEN_PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const sessionMiddleware = session({
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
        return res.status(400).send({ message: 'El nombre de usuario y la contraseña son obligatorios.' });
    }

    try {
        // Consultamos si el jugador existe en la base de datos
        const respuesta = await MySQL.realizarQuery(
            `SELECT * FROM Jugadores WHERE Nombre = '${nombre}'`
        );

        if (respuesta.length === 0) {
            return res.status(401).send({ message: 'Credenciales incorrectas.' });
        }

        // Comparamos la contraseña proporcionada con el hash almacenado
        const isPasswordValid = await bcrypt.compare(contraseña, respuesta[0].Contraseña);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Credenciales incorrectas.' });
        }

        // Guardamos la sesión del jugador
        req.session.user = respuesta[0];
        req.session.room = ''; // Puedes añadir lógica para asignar una sala de chat específica si es necesario

        res.status(200).send({
            message: 'Login exitoso',
            user: respuesta[0]
        });
    } catch (error) {
        console.error('Error al realizar login:', error);
        res.status(500).send({ message: 'Error en el servidor.' });
    }
});

// Ruta de logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Error al cerrar sesión.' });
        }
        res.status(200).send({ message: 'Sesión cerrada exitosamente.' });
    });
});

// Socket.io eventos
io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);

        io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });

    socket.on('sendMessage', data => {
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
    });

    socket.on('disconnect', () => {
        console.log("Disconnect");
    });
});