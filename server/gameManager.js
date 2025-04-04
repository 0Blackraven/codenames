import { Server, Socket } from 'socket.io';
import { Room } from './room.js';
import { User } from './user.js';
import getRandomWords from './randomWord.js';

const activeRooms = new Map(); 

export class GameManager {
    constructor(server) {
        this.server = server;
        
        setInterval(() => {
            for (const [code, room] of activeRooms.entries()) {
                if (!room.users || room.users.length === 0) {
                    activeRooms.delete(code); // Remove empty rooms
                }
            }
        }, 10 * 60 * 1000);
    }

    randomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code;
        
        do {
            code = '';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (activeRooms.has(code));
    
        return code;
    }

    handleConnection(client) {
        client.on('reconnect', (code, username) => {
            const room = activeRooms.get(code);
            const turn = room.turn;
            if(room.gameOver){
                client.emit("gameEnded");
                return;
            }
            if (!room) {
                client.emit("Expired Session");
                return;
            }
            if (room.users.length >= 14) {
                client.emit("roomFull");
                return;
            }
            client.join(code);
            client.emit("reconnectedlogs", room.logs);
            client.emit("turn",turn);
            client.emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            client.emit("redScore",room.redScore);    
            client.emit("blueScore",room.blueScore);
            const user = new User(client, client.id, username, code);
            room.addUser(user);
        });

        client.on('disconnect', () => {
            for (const [roomCode, room] of activeRooms.entries()) {
                const userIndex = room.users.findIndex(user => user.client.id === client.id);
                const userName = room.users[userIndex]?.username;
                const redSpyIndex = room.redSpy.findIndex(spyName => spyName === userName);
                const blueSpyIndex = room.blueSpy.findIndex(spyName => spyName === userName);
                const redOperIndex = room.redOper.findIndex(spyName => spyName === userName);
                const blueOperIndex = room.blueOper.findIndex(spyName => spyName === userName);
                if (redSpyIndex !== -1) {
                    room.redSpy.splice(redSpyIndex, 1);
                    this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
                }
                if (blueSpyIndex !== -1) {
                    room.blueSpy.splice(blueSpyIndex, 1);
                    this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
                }
                if (redOperIndex !== -1) {
                    room.redOper.splice(redOperIndex, 1);
                    this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
                }
                if (blueOperIndex !== -1) {
                    room.blueOper.splice(blueOperIndex, 1);
                    this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
                }
                if (userIndex !== -1) {
                    room.users.splice(userIndex, 1);
                    setTimeout(() => {
                        if (room.users.length === 0) {
                            activeRooms.delete(roomCode);
                        }
                    }, 3 * 60 * 1000);
                    }
                }
            client.removeAllListeners();
        });

        client.on('removeFromRoom', (roomCode) => {
            const room = activeRooms.get(roomCode);
            if(!room){
                client.emit("RoomError");
                return;
            }
            const userIndex = room.users.findIndex(user => user.client.id === client.id);
            const userName = room.users[userIndex]?.username;
            const redSpyIndex = room.redSpy.findIndex(spyName => spyName === userName);
            const blueSpyIndex = room.blueSpy.findIndex(spyName => spyName === userName);
            const redOperIndex = room.redOper.findIndex(spyName => spyName === userName);
            const blueOperIndex = room.blueOper.findIndex(spyName => spyName === userName);
            if (redSpyIndex !== -1) {
                room.redSpy.splice(redSpyIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (blueSpyIndex !== -1) {
                room.blueSpy.splice(blueSpyIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (redOperIndex !== -1) {
                room.redOper.splice(redOperIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (blueOperIndex !== -1) {
                room.blueOper.splice(blueOperIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (userIndex !== -1) {
                room.users.splice(userIndex, 1);
            }
        });

        client.on('createRoom', async (username) => {
            const code = this.randomCode();
            const roomWords = await getRandomWords();
            client.join(code);
            const user = new User(client, client.id, username, code);
            const room = new Room(code, roomWords, 9, 8, "redSpy");
            room.addUser(user);
            activeRooms.set(code, room);
            client.emit("Successfull", code);
        });

        client.on('joinRoom', (code, username) => {
            const room = activeRooms.get(code);
            if (!room) {
                client.emit("roomError");
                return;
            }
            if (room.users.length >= 14) {
                client.emit("roomFull");
                return;
            }
            client.join(code);
            const user = new User(client, client.id, username, code);
            room.addUser(user);
            client.emit("userJoined");
            client.emit("words", room.words);
        });

        client.on('getWords', (code) => {
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            if (room) {
                client.emit("words", room.words);
            }
        });
        
        client.on('hint', (hint, number, username, code, isRed) => {
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            isRed = isRed;
            if (room) {
                const notification = `${username}:${hint}*${number}`;
                room.addlog(notification);
                this.server.in(code).emit("notification", notification);
                room.updateGuess(number);
                (isRed)?room.updateTurn("redOper"):room.updateTurn("blueOper");
                const turn= room.turn
                this.server.in(code).emit("turn",turn);
            }
        });

        client.on('endGuess', (code,isRed)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
            const turn= room.turn
            this.server.in(code).emit("turn",turn);
        })

        client.on("changeRoleTeam", (roomCode, isRed, isSpy)=>{
            const room = activeRooms.get(roomCode);
            if(!room){
                client.emit("RoomError");
                return;
            }
            const user = room.users.find(user => user.client.id === client.id)?.username;
            const redSpyIndex = room.redSpy.findIndex(spyName => spyName === user);
            const blueSpyIndex = room.blueSpy.findIndex(spyName => spyName === user);
            const redOperIndex = room.redOper.findIndex(spyName => spyName === user);
            const blueOperIndex = room.blueOper.findIndex(spyName => spyName === user);
            if (redSpyIndex !== -1) {
                room.redSpy.splice(redSpyIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (blueSpyIndex !== -1) {
                room.blueSpy.splice(blueSpyIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (redOperIndex !== -1) {
                room.redOper.splice(redOperIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            if (blueOperIndex !== -1) {
                room.blueOper.splice(blueOperIndex, 1);
                this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            }
            room.addRole(user, isRed ? "red" : "blue", isSpy ? "spy" : "operative");
            this.server.in(roomCode).emit("teams", room.redSpy, room.blueSpy, room.redOper, room.blueOper);
            client.emit("UpdateRole", isRed, isSpy);
        });

        client.on("updateWords",(code, isRed, name)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            const words = room.words.find(word=> word.name == name);
            if (words.value === 3) {
                if (!room.gameOver) {
                    room.gameOver = true;
                    this.server.in(code).emit("GameOver", isRed, true);
                    activeRooms.delete(code);
                }
            }            
            if(words.value == 0){
                words.isClicked = true
                room.guessLeft -= 1;
                if(room.guessLeft==0){
                    (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
                    const turn= room.turn
                    this.server.in(code).emit("turn",turn);
                }
            }
            if(words.value == 1 ){
                words.isClicked = true;
                if(isRed){
                    room.redScore -= 1;
                    if(room.redScore == 0){
                        room.gameOver = true;
                        this.server.in(code).emit("GameOver", isRed, false);
                        activeRooms.delete(code);
                        return;
                    }
                    this.server.in(code).emit("redScore", room.redScore);
                    room.guessLeft -= 1;
                    if(room.guessLeft==0){
                        (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
                        const turn= room.turn
                        this.server.in(code).emit("turn",turn);
                    }
                }else{
                    room.redScore -= 1;
                    if(room.redScore == 0){
                        room.gameOver = true;
                        this.server.in(code).emit("GameOver", isRed, false);
                        activeRooms.delete(code);
                        return;
                    }
                    this.server.in(code).emit("redScore", room.redScore);
                    room.updateGuess(0);
                    if(room.guessLeft==0){
                        (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
                        const turn= room.turn
                        this.server.in(code).emit("turn",turn);
                    }
                }
            }
            if(words.value == 2){
                words.isClicked = true;
                if(!isRed){
                    room.blueScore -= 1;
                    if(room.blueScore == 0){
                        room.gameOver=true;
                        this.server.in(code).emit("GameOver", isRed, false);
                        activeRooms.delete(code);
                        return;
                    }
                    this.server.in(code).emit("blueScore", room.blueScore);
                    room.guessLeft -= 1;
                    if(room.guessLeft==0){
                        (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
                        const turn= room.turn
                        this.server.in(code).emit("turn",turn);
                    }
                }else{
                    room.blueScore -= 1;
                    if(room.blueScore == 0){
                        room.gameOver=true;
                        this.server.in(code).emit("GameOver", isRed, false);
                        activeRooms.delete(code);
                        return;
                    }
                    this.server.in(code).emit("blueScore", room.blueScore);
                    room.updateGuess(0);
                    if(room.guessLeft==0){
                        (isRed)?room.updateTurn("blueSpy"):room.updateTurn("redSpy");
                        const turn= room.turn
                        this.server.in(code).emit("turn",turn);
                    }
                }
            }
            this.server.in(code).emit("words", room.words);
        });

        client.on("getScores",(code)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            const redScore = room.redScore;
            const blueScore = room.blueScore;
            this.server.in(code).emit("redScore",redScore);   
            this.server.in(code).emit("blueScore",blueScore);
        })

        client.on('resetWords', async (code)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            if(room.wordsChanged==true){
                this.server.in(code).emit("justChangedWords");
                return;
            }
            room.words = await getRandomWords();
            room.wordsChanged = true;
            room.redScore = 9;
            room.blueScore = 8;
            room.turn = "redSpy";
            room.guessLeft = 0;
            this.server.in(code).emit("redScore",room.redScore);
            this.server.in(code).emit("blueScore",room.blueScore);
            this.server.in(code).emit("turn",room.turn);
            this.server.in(code).emit("words", room.words);
            setTimeout(()=>{
                room.wordsChanged = false;
            }, 10 * 1000);
        })

        client.on("getTeams",(code)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            this.server.in(code).emit("teams",room.redSpy,room.blueSpy,room.redOper,room.blueOper);    
        })

        client.on("getTurn",(code)=>{
            const room = activeRooms.get(code);
            if(!room){
                client.emit("RoomError");
                return;
            }
            const turn = room?.turn
            this.server.in(code).emit("turn",turn);
        })
    }
}
