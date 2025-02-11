import { Socket } from 'socket.io';

export class User {
    constructor(client, id, username, code) {
        this.client = client;
        this.id = id;
        this.username = username;
        this.code = code;
    }
}
