import { Server, Socket } from 'socket.io';
import { User } from './user.js';
import getRandomWords from './randomWord.js';

const mapOfWords = new Map();
const mapOfRooms = new Map();

export class GameManager {
    constructor(server) {
        this.server = server;

        // Periodically delete empty rooms every 10 minutes
        setInterval(() => {
            mapOfRooms.forEach((users, code) => {
                if (!users || users.length === 0) {
                    mapOfRooms.delete(code);
                    console.log(`Room ${code} deleted due to no users`);
                }
            });
        }, 10 * 60 * 1000);
    }

    handleConnection(client) {
        console.log(`New client connected: ${client.id}`);

        client.on('disconnect', () => this.handleDisconnect(client));
        client.on('createRoom', (username) => this.createRoom(client, username));
        client.on('joinRoom', (code, username) => this.joinRoom(client, code, username));
        client.on('getWords', (code) => this.getWords(client,code));
    }

    randomCode() {
        let code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    async createRoom(client, username) {
        const code = this.randomCode();
        client.join(code);
        const user = new User(client, client.id, username, code);
        mapOfRooms.set(code, [user]); 
        const roomWords = await getRandomWords();
        mapOfWords.set(code, roomWords);
        console.log(`Room created with code: ${code}`);
        client.emit("Successfull", code);
    }

    getWords(client, code){
        const roomWords = mapOfWords.get(code);
        client.emit("words", roomWords);
    }

    joinRoom(client, code, username) {
        if (!mapOfRooms.has(code)) {
            client.emit("roomError"); // Room does not exist
            return;
        }

        const users = mapOfRooms.get(code);

        if (!users) {
            client.emit("roomError"); // Prevent undefined errors
            return;
        }

        if (users.length >= 14) { // Fixed incorrect assignment
            client.emit("roomFull");
            return;
        }

        client.join(code);
        const user = new User(client, client.id, username, code);
        users.push(user);
        console.log(`${username} joined room ${code}`);
        client.emit("userJoined");
    }

    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);

        let roomCode = null;

        mapOfRooms.forEach((users, code) => {
            if (!users) return; // Prevent undefined errors

            const userIndex = users.findIndex(user => user.id === client.id);
            if (userIndex !== -1) {
                roomCode = code;
                users.splice(userIndex, 1);
                console.log(`User ${client.id} removed from room ${code}`);

                if (users.length === 0) {
                    console.log(`Room ${code} is now empty, deleting it.`);
                    mapOfRooms.delete(code);
                }
            }
        });
    }
}
