import { Socket } from 'socket.io';

export class User {
    constructor(client, clientId, username, code) {
      this.client = client;
      this.clientId = clientId
      this.username = username;
      this.code = code;
}
}
  
  