import { Socket } from 'socket.io';

export class User {
    constructor(client, clientId, id, username, code, team, role) {
      this.client = client;
      this.clientId = clientId
      this.id = id; // this helps in case of disconnections due to refreshes
      this.username = username;
      this.code = code;
      this.team = team;   // e.g., "red" or "blue"
      this.role = role;   // e.g., "spymaster" or "operative"
    }
  }
  
