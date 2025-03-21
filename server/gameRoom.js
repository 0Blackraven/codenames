
export class GameRoom{
    constructor(server){
        this.server = server;
    }
    


    handleRedScore(client,score){
        score = score - 1;
        client.to(code).emit("redScore", score);
    }
    handleBlueScore(client,score){
        score = score - 1;
        client.to(code).emit("blueScore", score);
    }
    handleHint(client,notification){
        client.to(code).emit("notification", notification, username);
    }
    blackTile(client){
        client.to(code).emit("blackTile");
        //turn all turn variable to false game end
    }

}