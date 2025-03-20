import { Socket } from 'socket.io';

export class User {
    constructor(client, id, username, code, team, role) {
      this.client = client;
      this.id = id;
      this.username = username;
      this.code = code;
      this.team = team;   // e.g., "red" or "blue"
      this.role = role;   // e.g., "spymaster" or "operative"
    }
  }
  
