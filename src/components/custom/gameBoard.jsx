import * as React from "react";
import Tile from "./Tile";
import { Socket } from "../../socket";
import { useEffect, useState } from "react";

export default function GameBoard() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    // Listen for the words event from the server
    Socket.once("words", (roomWords) => {
      console.log("Words received:", roomWords);
      setWords(roomWords);
    });
  }, []);

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-2 p-2 w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] mx-auto">
      {words.map((wordObj, index) => (
        <Tile key={index} name={wordObj.name} value={wordObj.value} />
      ))}
    </div>
  );
}



