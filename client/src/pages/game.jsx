import {useEffect, useState} from 'react';
import GameBoard from '../components/custom/gameBoard';
import CustomInput from '../components/custom/customInput';
import { Logboard } from '../components/custom/logboard';
import TeamBoard from '../components/custom/teamBoard';
import { Button } from '../components/ui/button';
import { Socket } from '../socket';
import {useNavigate } from "react-router-dom";
import GifComponent from '../components/custom/gifComponent';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"

export default function Game(){
    const code = sessionStorage.getItem("roomCode");
    const navigate = useNavigate();
    const [msg,setMsg]= useState("");
    const [username, setUsername] = useState("");
    const [won, setWon] = useState(false);
    const [isRed, setIsRed] = useState(() => sessionStorage.getItem("team") === "Red");
    const [isBlue, setIsBlue] = useState(() => sessionStorage.getItem("team") === "Blue");
    const [isSpymaster, setIsSpymaster] = useState(() => sessionStorage.getItem("role") === "Spymaster");
    const [isOperative, setIsOperative] = useState(() => sessionStorage.getItem("role") === "Operative");
    const [redScore, setRedScore]= useState(0);
    const [blueScore, setBlueScore] = useState(0);
    const [winTeam, setWinTeam] = useState("");
    const [redSpy, setRedSpy] = useState([]);
    const [blueSpy, setBlueSpy] = useState([]);
    const [redOper, setRedOper] = useState([]);
    const [blueOper, setBlueOper] = useState([]);
    const [turn, setTurn] = useState(false);
    const [turnSpy, setTurnSpy] = useState(false);
    const [turnOper, setTurnOper] = useState(false);
    const [hasCrashed, setHasCrashed] = useState(false);
    
    useEffect(()=>{
        
        Socket.on("serverCrashed",()=>{
            alert("Room has crashed. Please create a new room.");
            navigate("/");
        })
        Socket.emit("getWords", code);
        Socket.emit("getScores",code);
        setUsername(sessionStorage.getItem("username"));

        Socket.on("redScore",(score)=>{
            setRedScore(score);
        })
        Socket.on("blueScore",(score)=>{
            setBlueScore(score);
        })

        Socket.on("GameOver",(isRed,isBlack)=>{
            setWon(true);
            (isBlack)
            ?(isRed)?setWinTeam("BLUE"):setWinTeam("RED")
            :(isRed)?setWinTeam("RED"):setWinTeam("BLUE")
        })

        Socket.on("UpdateRole",(isRed,isSpy)=>{
            setIsRed(isRed);
            setIsBlue(!isRed);
            setIsOperative(!isSpy);
            setIsSpymaster(isSpy);
            console.log(isRed,isBlue,isOperative,isSpymaster);
        });
    },[])

    useEffect(()=>{
        Socket.emit("getTeam",code);
        Socket.on("teams", (redSpy, blueSpy, redOper, blueOper) => {
            setRedSpy(redSpy);
            setBlueSpy(blueSpy);
            setRedOper(redOper);
            setBlueOper(blueOper);
        });
    },[redSpy, blueSpy, redOper, blueOper]);

    useEffect(()=>{
        Socket.emit("getTurn",code);
        Socket.on("turn",(givenTurn)=>{
            handleTurn(givenTurn);
        })
    },[isSpymaster,isRed,isBlue,isOperative,msg])

    const findingTag=()=>{
        let tag
        const role = sessionStorage.getItem("role");
        const team = sessionStorage.getItem("team");
        if(role=="Spymaster" && team=="Red"){
            tag = "redSpy";
        }
        if(role=="Operative" && team=="Red"){
            tag = "redOper";
        }
        if(role=="Spymaster" && team=="Blue"){
            tag = "blueSpy"
        }
        if(role=="Operative" && team=="Blue"){
            tag = "blueOper"
        }
        return tag;
    }
    
    const resetWords=(code)=>{
        Socket.emit("resetWords",code);
    }
    const handleTurn=(givenTurn)=>{
        const tag=findingTag();
        if(tag == givenTurn){
            setTurn(true);
            if(tag=="redSpy" || tag=="blueSpy"){
                setTurnSpy(true);
                setTurnOper(false);
            }
            else if(tag=="redOper" || tag=="blueOper"){
                setTurnOper(true);
                setTurnSpy(false);
            }
        }else{
            setTurn(false);
            if(givenTurn=="redSpy"){setMsg("Red SpyMaster is giving hint")}
            if(givenTurn=="blueSpy"){setMsg("Blue SpyMaster is giving hint")}
            if(givenTurn=="redOper"){setMsg("Red Operatives are guessing")}
            if(givenTurn=="blueOper"){setMsg("Blue Operatives are guessing")}
        }
    }

    const redSpyHandler=()=>{
        sessionStorage.setItem("role","Spymaster");
        sessionStorage.setItem("team","Red");
        setIsSpymaster(true);
        setIsRed(true);
        Socket.emit("changeRoleTeam",code, true, true);
    }

    const redOperHandler=()=>{
        sessionStorage.setItem("role","Operative");
        sessionStorage.setItem("team","Red");
        setIsOperative(true);
        setIsRed(true);
        Socket.emit("changeRoleTeam",code, true, false);
    }

    const blueSpyHandler=()=>{
        sessionStorage.setItem("role","Spymaster");
        sessionStorage.setItem("team","Blue");
        setIsSpymaster(true);
        setIsBlue(true);
        Socket.emit("changeRoleTeam",code, false, true);
    }

    const blueOperHandler=()=>{
        sessionStorage.setItem("role","Operative");
        sessionStorage.setItem("team","Blue");
        setIsOperative(true);
        setIsBlue(true);
        Socket.emit("changeRoleTeam",code, false, false);
    }

    const endGuess=(code,isRed)=>{
        Socket.emit("endGuess",code,isRed);
    }

    return(
        (!won)
        ?(<div className="flex flex-col justify-center w-full">
            <div className="flex items-start justify-end lg:mr-20 mr-15 border-4 border-black">    
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{username}</Button>
                    </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Button className="rounded-lg" onClick={()=>{resetWords(code)}}>Reset Words</Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        {(!isRed || !isSpymaster) && <Button className="rounded-lg" onClick={redSpyHandler}>TURN TO RED SPYMASTER</Button>}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {(!isBlue || !isSpymaster) && <Button className="rounded-lg" onClick={blueSpyHandler}>TURN TO BLUE SPYMASTER</Button>}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {(!isRed || !isOperative) && <Button className="rounded-lg" onClick={redOperHandler}>TURN TO RED OPERATIVE</Button>}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {(!isBlue || !isOperative) && <Button className="rounded-lg" onClick={blueOperHandler}>TURN TO BLUE OPERATIVE</Button>}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid grid-cols-[repeat(5,1fr)] grid-rows-[12fr_2fr_11fr] lg:p-1 border-4 border-black">
                <TeamBoard score={redScore} className="col-start-1 col-span-1 row-start-3 row-span-1 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-3 h-full text-red-500 border-4 border-black">
                <div>
                    <h4 className='font-bold'>SPYMASTER</h4>
                    {!isRed && !isBlue && !isSpymaster && (<Button onClick={redSpyHandler}className="text-[10px] lg:text-[15px]">Join As SpyMaster</Button>)}
                    <div>
                        {redSpy.map((spy, index)=>(
                            <div className="text-black" key={index}>{spy}</div>
                        ))}
                    </div>
                    <h4 className='font-bold'>OPERATIVES</h4>
                    {!isRed && !isBlue && !isOperative && (<Button onClick={redOperHandler}className="text-[10px] lg:text-[15px]">Join As Operative</Button>)}
                    <div>
                        {redOper.map((spy, index)=>(
                            <div className="text-black" key={index}>{spy}</div>
                        ))}
                    </div>
                </div>
                </TeamBoard >
                <div className="col-span-5 lg:col-span-3 col-start-1 lg:col-start-2 row-start-1 row-span-1 lg:p-2 pb-1 border-4 border-black">
                    <GameBoard 
                        turn={turn} 
                        redScore={redScore}
                        blueScore={blueScore}/>
                </div>
                <div className='lg:col-span-3 lg:col-start-2 col-start-1 col-span-5 row-start-2 row-span-1 border-4 border-white'>
                    {!turn ? (<div  className="p-2">{msg}</div>
                        ) : (
                            <>
                                {turnSpy && <CustomInput className=""/>}
                                {turnOper && <Button onClick={()=>endGuess(code,isRed)} className="">End Guess</Button>}
                            </>
                    )}
                </div>
                <div className=' col-start-2 col-end-5 row-start-3 row-span-1 lg:p-4 border-4 border-black w-full'>
                    <Logboard className="min-h-full"/>
                </div>
                <TeamBoard score={blueScore} className="col-span-1 col-start-5 row-start-3 lg:row-start-1 row-span-1 lg:row-span-3 h-full text-blue-500 border-4 border-black">
                <div>
                    <h4 className='font-bold'>SPYMASTER</h4>
                    {!isRed && !isBlue && !isSpymaster && (<Button onClick={blueSpyHandler}className="text-[10px] lg:text-[15px]">Join As SpyMaster</Button>)}
                    <div>
                        {blueSpy.map((spy, index)=>(
                            <div className="text-black" key={index}>{spy}</div>
                        ))}
                    </div>
                    <h4 className='font-bold'>OPERATIVES</h4>
                    {!isRed && !isBlue && !isOperative && (<Button onClick={blueOperHandler}className="text-[10px] lg:text-[15px]">Join As Operative</Button>)}
                    <div>
                        {blueOper.map((spy, index)=>(
                            <div className="text-black" key={index}>{spy}</div>
                        ))}
                    </div>
                </div>
                </TeamBoard>
            </div>
         </div>)
        :(<>
            <div className='flex flex-col items-center pt-50 justify-center gap-4'>
                <h1 className='text-4xl'> GAME OVER </h1>
                <GifComponent url = "https://media.tenor.com/2tBAupuWcMYAAAAj/%E5%A4%A9%E7%AB%BA%E9%BC%A0%E6%A3%AE%E6%A3%AE-%E8%B7%B3%E8%88%9E.gif"/>
                <h1 className='text-2xl'>{winTeam} HAS WON THE GAME</h1>
                <Button onClick={()=>navigate("/")}>Back to Home</Button>
            </div>
         </>)
    )
}