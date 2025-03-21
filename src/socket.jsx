import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom"

export const Socket = io("http://localhost:8080")

Socket.on("connect",()=>{
    let code = sessionStorage.getItem("roomCode")
    if(code!=null){
        Socket.emit("reconnect",code);
        Socket.on("Expired Session",()=>{
        navigate('/');
    })
    }
})