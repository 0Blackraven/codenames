import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom"

export const Socket = io("http://localhost:8080")

Socket.on("gameEnded",()=>{
    alert("Game has already ended");
})

Socket.on("connect",()=>{
    let code = sessionStorage.getItem("roomCode")
    let username = sessionStorage.getItem("username")
    if(code!=null){
        const isRed = sessionStorage.getItem("team")=="Red";
        const isSpy= sessionStorage.getItem("role")=="Spymaster";
        Socket.emit("reconnect",code,username);
        Socket.emit("changeRoleTeam",code, isRed, isSpy);
        Socket.on("Expired Session",()=>{
        navigate('/');
    })
    }
})