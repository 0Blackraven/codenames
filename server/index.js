import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameManager } from './gameManager.js'
import  cors  from 'cors';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const gameManager = new GameManager(io);

app.get('/', (req, res) => {
    res.json({ msg: 'Hello From Server' });
});

io.on('connection', (socket) => {
    gameManager.handleConnection(socket);
});

io.engine.on('connection_error', (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
});

httpServer.listen(PORT, () => {
    console.log(`Server Running on :${PORT}`);
});