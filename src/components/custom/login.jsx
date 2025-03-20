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
import { Link, useNavigate } from "react-router-dom"

export default function Login(
  className,
) {
  const [signupNext, setSignupNext] = useState(0);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

  const handleCreateClick = (e) => {
    // e.preventDefault();
    Socket.emit("createRoom",  username );
    Socket.once("Successfull", ( code ) => {
        setCode(code);
        console.log(code);
    });
    setSignupNext(1);
  };  

  const handleJoinClick = (e) => {
      // e.preventDefault();
      Socket.emit("getWords", code);
      navigate(`/${code}`);
  };

  const joinHandler = (e) => {
    e.preventDefault();
    Socket.emit("joinRoom", code, username);
    Socket.on("roomError", ()=>{
      alert("Are you a complete dumbfuck that you can't even copy the code correctly? Or did your friends ditch you?")
    })
    Socket.on("roomFull", ()=>{
      alert("Lmao. Your friends ditched you. Get the fuck outta here")
    })
    Socket.on("userJoined", ()=>{
      Socket.emit("getWords", code);
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
              {/* Maybe an welcome icon */}
              <CardTitle>Join Game</CardTitle>
              <CardDescription>
                Enter your Room Id and Username to join the game.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="habibi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="roomid">Room Id</Label>
                <Input 
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
                {/* Maybe an signup icon */}
                <CardTitle>Create</CardTitle>
                <CardDescription>
                  Create a room and invite your friends to play.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input 
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
                {/* Maybe an signup icon */}
                <CardTitle>Room Code</CardTitle>
                <CardDescription>Share this with your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* show the room id  */}
                <div>
                    <h1>{code}</h1>
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

// have to a add all the connection logic