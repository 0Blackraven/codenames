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

    const [hint, setHint] = useState("")
    const [number, setNumber] = useState(null)
    const handleSubmit = (e) =>{
        e.preventDefault();
        Socket.emit("hint", hint, number);
    }
    // work the server part


  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-row gap-2 justify-center", className)}>
      <Input placeholder="Enter Clue" className={"w-80"} onChange={(e)=>{
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