import * as React from "react";
import Tile from "./Tile";
import { Socket } from "../../socket";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils"
import clsx from "clsx"

export default function GameBoard({
  className,
  turn,
  redScore,
  blueScore,
}) {
  const colorMap = {
    0: "text-[#ffb703]",
    1: "text-red-500",
    2: "text-blue-500",
    3: "text-black"
  };
  const code = sessionStorage.getItem("roomCode");
  const [words, setWords] = useState([]);
  const isSpy = ("Spymaster" == sessionStorage.getItem("role"));
  const isRed = ("Red" == sessionStorage.getItem("team"));

  useEffect(() => {
    Socket.on("words", (roomWords) => {
      console.log("am here");
      setWords(roomWords);
    });
  }, [redScore, blueScore,words,turn]);

  const handleWordClicked = (name) => {
    if (isSpy) {
        console.log("Blocked: Spymaster cannot click");
        return;
    }
    if (!turn) {
        console.log("Blocked: Not your turn");
        return
      }
    Socket.emit("updateWords", code, isRed, name);
};
  
  //red value=1 blue value=2 black value=3 neutral value=0
  return (
    <div className={cn("grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(5,1fr)] gap-1",className)}>
      {words.map((wordObj, index) => (
        <Tile 
          key={index}
          value={wordObj.value}
          isClicked={wordObj.isClicked}
          onClick={()=>handleWordClicked(wordObj.name)}
          className={clsx(
            (!wordObj.isClicked && !isSpy)?"text-gray-500":colorMap[wordObj.value]
          )}
        >{wordObj.name}</Tile>
      ))}
    </div>
  );
}



