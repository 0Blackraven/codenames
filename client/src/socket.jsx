import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom"

    // use this for local testing
    // export const Socket = io("http://localhost:8080");
    export const Socket = io("https://codenames-c0ux.onrender.com",{
    })

Socket.on("gameEnded",()=>{
    alert("Game has already ended");
})

Socket.on("RoomError",()=>{
    const navigate = useNavigate()
    alert("Ur room has expired or does not exist");
    sessionStorage.removeItem("roomCode")
    navigate("/");
})

Socket.on("connect",()=>{
    let code = sessionStorage.getItem("roomCode")
    let username = sessionStorage.getItem("username")
    if(code!=null){
        Socket.emit("reconnect",code,username);
        if(sessionStorage.getItem("team")){
            const isRed = sessionStorage.getItem("team")=="Red";
            const isSpy= sessionStorage.getItem("role")=="Spymaster";
            Socket.emit("changeRoleTeam",code, isRed, isSpy);
        }
        Socket.on("Expired Session",()=>{
        navigate('/');
    })
    }
})