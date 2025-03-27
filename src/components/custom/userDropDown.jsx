import { Button } from "@/components/ui/button"
import { cn } from "../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Socket } from "../../socket"

export default function UserDropDown({
    children,
    className,
    isRed,
    isBlue,
    isSpy,
    isOper,
}) {
  const code = sessionStorage.getItem("roomCode");
  const [isRedSpy, setIsRedSpy] = useState(false);
  const [isRedOper, setIsRedOper] = useState(false);
  const [isBlueSpy, setIsBlueSpy] = useState(false);
  const [isBlueOper, setIsBlueOper] = useState(false);
  
  useEffect(()=>{
    setIsBlueOper(isOper && isBlue);
    setIsBlueSpy(isSpy && isBlue);
    setIsRedOper(isOper && isRed);
    setIsRedSpy(isSpy && isRed);
  },[isBlue,isRed,isOper,isSpy,isBlueSpy,isBlueOper,isRedSpy,isRedOper]);

  const resetWords=(code)=>{
    Socket.emit("resetWords",code);
  }

  const redSpyHandler=()=>{
    sessionStorage.setItem("role","Spymaster");
    sessionStorage.setItem("team","Red");
    Socket.emit("changeRoleTeam",code, true, true);
    Socket.emit("getTurn",code);
  }
  
  const redOperHandler=()=>{
    sessionStorage.setItem("role","Operative");
    sessionStorage.setItem("team","Red");
    Socket.emit("changeRoleTeam",code, true, false);
    Socket.emit("getTurn",code);
  }

  const blueSpyHandler=()=>{
    sessionStorage.setItem("role","Spymaster");
    sessionStorage.setItem("team","Blue");
    Socket.emit("changeRoleTeam",code, false, true);
    Socket.emit("getTurn",code);
  }
  
  const blueOperHandler=()=>{
    sessionStorage.setItem("role","Operative");
    sessionStorage.setItem("team","Blue");
    Socket.emit("changeRoleTeam",code, false, false);
    Socket.emit("getTurn",code);
  }
  

  return (
    <DropdownMenu className={cn(className)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{children}</Button>
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
            {!isRedSpy && <Button className="rounded-lg" onClick={redSpyHandler}>TURN TO RED SPYMASTER</Button>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {!isBlueSpy && <Button className="rounded-lg" onClick={blueSpyHandler}>TURN TO BLUE SPYMASTER</Button>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {!isRedOper && <Button className="rounded-lg" onClick={redOperHandler}>TURN TO RED OPERATIVE</Button>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {!isBlueOper && <Button className="rounded-lg" onClick={blueOperHandler}>TURN TO BLUE OPERATIVE</Button>}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
