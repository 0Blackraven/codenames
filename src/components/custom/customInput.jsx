import NumberComboBox from '../ui/com'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ChevronRight } from "lucide-react"
import { cn } from '@/lib/utils'  
import { Socket } from '@/socket'
import { useState } from 'react'

export default function CustomInput({
    className,
}) {
    const username = sessionStorage.getItem("username");
    const code = sessionStorage.getItem("roomCode");
    const isRed = (sessionStorage.getItem("team")=="Red");
    const [hint, setHint] = useState("");
    const [number, setNumber] = useState(null);
    const handleSubmit = (e) =>{
        e.preventDefault();
        if(hint!="" && number!=null){
          Socket.emit("hint", hint, number, username, code,isRed);
        }else{
          alert("Enter some hint or number please!!!");
        }
    }
    


  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-row justify-center", className)}>
      <Input placeholder="Enter Clue" className={"w-40"} onChange={(e)=>{
          setHint(e.target.value);
      }}/>
      <NumberComboBox onChange={(num)=>{
          setNumber(num);
      }}/>
      <Button type="submit" variant="outline" size="icon">
        <ChevronRight />
      </Button>
    </form>

  );
}