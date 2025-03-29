import { Button } from "../ui/button"
import {cn} from "../../lib/utils"
import { ChevronRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { useState } from "react"
import { Socket } from "../../socket"
import {useNavigate } from "react-router-dom"
import  CopyToClipBoard  from "./copyToClipBoard"

export default function Login(
  className,
) {
  const [signupNext, setSignupNext] = useState(0);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

  const handleCreateClick = (e) => {
    // e.preventDefault();
    if(sessionStorage.getItem("roomCode")){
      Socket.emit("removeFromRoom",sessionStorage.getItem("roomCode"));
      sessionStorage.removeItem("roomCode");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("team");
    }
    console.log(username);
    Socket.emit("createRoom",  username );
    Socket.once("Successfull", ( code ) => {
        setCode(code);
        console.log(code);
    });
    setSignupNext(1);
  };  

  const handleJoinClick = (e) => {
      sessionStorage.setItem("username",username);
      sessionStorage.setItem("roomCode",code);
      navigate(`/${code}`);
  };

  const joinHandler = (e) => {
    e.preventDefault();
    if(sessionStorage.getItem("roomCode")){
      Socket.emit("removeFromRoom",sessionStorage.getItem("roomCode"));
      sessionStorage.removeItem("roomCode");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("team");
    }
    Socket.emit("joinRoom", code, username);
    Socket.off("roomError");
    Socket.on("roomError", ()=>{
      alert("Are you a complete dumbfuck that you can't even copy the code correctly? Or did your friends ditch you?");

    })
    Socket.off("roomFull")
    Socket.on("roomFull", ()=>{
      alert("Lmao. Your friends ditched you. Get the fuck outta here")
    })
    Socket.on("userJoined", ()=>{
      console.log(username);
      sessionStorage.setItem("username",username);
      sessionStorage.setItem("roomCode",code);
      navigate(`/${code}`);
    })
  }

  return (
    <div className={cn(className)}>
      <Tabs defaultValue="Create" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Create" onClick={() => setSignupNext(0)}>
            Create
          </TabsTrigger>
          <TabsTrigger value="Join" onClick={() => setSignupNext(0)}>
            Join
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Join">
          <Card>
            <CardHeader>
              <CardTitle>Join Game</CardTitle>
              <CardDescription>
                Enter your Room Id and Username to join the game.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input 
                  required
                  id="username" 
                  type="text" 
                  placeholder="habibi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="roomid">Room Id</Label>
                <Input 
                  required
                  id="roomid"  
                  placeholder="12345"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}/>
              </div>
            </CardContent>
            <CardFooter className= "justify-center">
              <Button onClick={(e) => joinHandler(e)}>
                <div className="flex flex-row items-center gap-1">
                  <h1>Join Game</h1>
                  <ChevronRight/>
                </div>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="Create">
          {signupNext == 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Create</CardTitle>
                <CardDescription>
                  Create a room and invite your friends to play.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    required
                    id="username" 
                    type="text" 
                    placeholder="habibi"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                </div>
              </CardContent>
              <CardFooter className= "justify-center">
                <Button onClick={() => handleCreateClick()}>
                  <div className="flex flex-row items-center gap-2">
                    <h1>Get Code</h1>
                  </div>
                </Button>
              </CardFooter>
            </Card>
          )}
          {signupNext == 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Room Code</CardTitle>
                <CardDescription>Share this with your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-row items-center justify-center gap-2">
                    <h1>{code}</h1>
                    <CopyToClipBoard text={code}/>
                </div>
              </CardContent>
              <CardFooter className= "justify-center">
                    <Button onClick={() => handleJoinClick()}>
                      <div className="flex flex-row items-center gap-2">
                        <h1>Start Game</h1>
                        <ChevronRight/>
                      </div>
                    </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}