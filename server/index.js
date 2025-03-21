import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameManager } from './gameManager.js'

const PORT = 8080;
const BACKEND_URL = 'http://localhost';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

const gameManager = new GameManager(io);

app.get('/', (req, res) => {
    res.json({ msg: 'Hello From Server' });
});

io.on('connection', (socket) => {
    console.log(socket.id, 'Connected\n');
    gameManager.handleConnection(socket);
});

io.engine.on('connection_error', (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
});

httpServer.listen(PORT, () => {
    console.log(`Server Running on ${BACKEND_URL}:${PORT}`);
});