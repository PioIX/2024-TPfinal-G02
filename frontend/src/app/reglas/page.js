'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reglas from "../components/reglas";
import BotonDeJuego from "../components/boton";
import io from "socket.io-client";
import styles from './Reglitas.module.css';

let socket;

export default function Reglitas() {
    const [playersCount, setPlayersCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("✅ Conectado:", socket.id);
        });

        socket.on("players", (players) => {
            setPlayersCount(players.length);
        });

        socket.on("startGame", ({ roles }) => {
            const role = roles[socket.id];
            router.push(`/flappy?role=${role}`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className={styles.page}>
            <h1>Flappy Multiplayer</h1>
            <p>Jugadores conectados: {playersCount}</p>
            <Reglas />
            <BotonDeJuego playersCount={playersCount} socket={socket} />
        </div>
    );
}