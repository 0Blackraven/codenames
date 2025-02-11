import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 8080;
const BACKEND_URL = 'http://localhost';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) => {
    res.json({ msg: 'Hello From Server' });
});

io.on('connection', (socket) => {
    console.log(socket.id, 'Connected\n');
    // figure out what happens when a user connects
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
