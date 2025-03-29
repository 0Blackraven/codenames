import {useEffect, useState} from 'react';
import GameBoard from '@/components/custom/gameBoard';
import CustomInput from '@/components/custom/customInput';
import { Logboard } from '@/components/custom/logboard';
import TeamBoard from '@/components/custom/teamBoard';
import UserDropDown from '@/components/custom/userDropDown';
import { Button } from '@/components/ui/button';
import { Socket } from '@/socket';
import {useNavigate } from "react-router-dom";
import GifComponent from '@/components/custom/gifComponent';

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
    
    useEffect(()=>{
        
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
        ?(<div className="flex flex-col justify-center ml-35 mr-35">
            <div className="flex items-start justify-end ">    
                <UserDropDown 
                    className="w-12 h-12"
                    children={username}
                    isRed={isRed}
                    isBlue={isBlue}
                    isSpy={isSpymaster}
                    isOper={isOperative}></UserDropDown>
            </div>
            <div className="flex flex-row flex-grow gap-4 h-[85dvh] w-[85dvw]">
                <TeamBoard score={redScore}>
                <div className="flex flex-col gap-2">
                <h4>SPYMASTER</h4>
                {!isRed && !isBlue && !isSpymaster && (<Button onClick={redSpyHandler}>Join As SpyMaster</Button>)}
                <div>
                    {redSpy.map((spy, index)=>(
                        <div key={index}>{spy}</div>
                    ))}
                </div>
                <h4>OPERATIVES</h4>
                {!isRed && !isBlue && !isOperative && (<Button onClick={redOperHandler}>Join As Operative</Button>)}
                <div>
                    {redOper.map((spy, index)=>(
                        <div key={index}>{spy}</div>
                    ))}
                </div>
                </div>
                </TeamBoard>
                <div className="flex flex-col flex-grow gap-4">
                    <GameBoard 
                        turn={turn} 
                        redScore={redScore}
                        blueScore={blueScore}/>
                    {!turn ? (<div>{msg}</div>
                         ) : (
                                <>
                                    {turnSpy && <CustomInput />}
                                    {turnOper && <Button onClick={()=>endGuess(code,isRed)}>End Guess</Button>}
                                </>
                    )}
                    <Logboard/>
                </div>
                <TeamBoard score={blueScore}>
                <div className='flex flex-col gap-2'>
                    <h4>SPYMASTER</h4>
                    {!isRed && !isBlue && !isSpymaster && (<Button onClick={blueSpyHandler}>Join As SpyMaster</Button>)}
                    <div>
                        {blueSpy.map((spy, index)=>(
                            <div key={index}>{spy}</div>
                        ))}
                    </div>
                    <h4>OPERATIVES</h4>
                    {!isRed && !isBlue && !isOperative && (<Button onClick={blueOperHandler}>Join As Operative</Button>)}
                    <div>
                        {blueOper.map((spy, index)=>(
                            <div key={index}>{spy}</div>
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