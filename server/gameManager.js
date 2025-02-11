import { Server, Socket } from 'socket.io';
import { User } from './user';

const mapOfRooms = new Map();

export class GameManager {
    constructor() {
        this.users = [];
        this.server = {};
        this.room = [];
    }

    handleConnection(client, server) {
        this.server = server;
        client.on('disconnect', () => {
            if (this.users.find(user => user.id === client.id)) {
                this.users = this.users.filter(user => user.id !== client.id);
                this.noOfPlayers--;
            }
            console.log('user disconnected');
        });
        client.on('createRoom', (username) => this.createRoom(client, username));
        client.on('joinRoom', (code, username) => this.joinRoom(client, code, username));
    }

    randomCode() {
        let code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    createRoom(client, username) {
        const code = this.randomCode();
        client.join(code);
        this.users.push(new User(client, client.id, username, code));
        mapOfRooms.set(code, this.users);
        console.log('room created');
        this.server.to(code).emit(username + ' has joined the room');
        this.server.to(code).emit('Share this room id with your friends: ' + code);
    }

    joinRoom(client, code, username) {
        if (mapOfRooms.has(code)) {
            client.join(code);
            const user = new User(client, client.id, username, code);
            this.users = mapOfRooms.get(code) || [];
            this.users.push(user);
            mapOfRooms.set(code, this.users);
            console.log('room joined');
            this.server.to(code).emit(username + ' has joined the room');
        } else {
            client.emit('Room does not exist');
        }
    }

    cleanExpiredRooms() {
        mapOfRooms.forEach((users, code) => {
            if (users.length === 0) {
                mapOfRooms.delete(code);
                console.log(`Room ${code} has been deleted due to no users.`);
            }
        });
    }
}
