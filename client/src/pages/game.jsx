import React, { useEffect, useState } from "react";
import getRandomWords from "../assets/randomWord";
import GameCards from "../components/GameCards";

function Game() {
    const [results, setResults] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const temp = await getRandomWords();
                setResults(temp);
            } catch (err) {
                console.error("Error:", err);
            }
        })();
    }, []);

    return (
        <div className="gameCardContainer">
            {Object.entries(results).map(([word, data], index) => (
                <GameCards key={index} id={index} word={word} value={data.value} />
            ))}
        </div>
    );
}

export default Game;
