export class Room {
    constructor(roomCode, words, redScore, blueScore, turn){
        this.roomCode = roomCode;
        this.words = words;
        this.redScore = redScore;
        this.blueScore = blueScore;
        this.turn = turn;
        this.guessLeft = 0;
        this.gameOver = false;
        this.logs = [];
        this.redSpy = [];
        this.blueSpy = [];
        this.redOper = [];
        this.blueOper = [];
        this.users = [];
        this.wordChanged = false;
    }

    addUser(user){
        this.users.push(user);
    }

    addRole(username,team, role){
        if(team=="red"){
            if(role=="spy"){
                this.redSpy.push(username);
            }else{
                this.redOper.push(username);
            }
        }else{
            if(role=="spy"){
                this.blueSpy.push(username);
            }else{
                this.blueOper.push(username);
            }
        }
    }
    updateTurn(turn){
        this.turn=turn;
    }
    addlog(msg){
        this.logs.push(msg);
    }
    updateGuess(number){
        this.guessLeft=number;
    }
}