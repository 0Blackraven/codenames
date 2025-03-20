import {useState} from 'react';
import GameBoard from '@/components/custom/gameBoard';


export default function Game(){
    
    
    return(
        <>
            <div>Game Page</div>
            <div>
                <GameBoard/>
            </div>
        </>
    )
}
// const [isRed, setIsRed] = useState(false);
// const [isBlue, setIsBlue] = useState(false);
// const [isSpymaster, setIsSpymaster] = useState(false);
// const [isOperative, setIsOperative] = useState(false);