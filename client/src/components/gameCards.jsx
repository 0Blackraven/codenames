

function GameCards({ id, word, value }) {
    return (
        <div className="game-cards">
            <button id={id}>
                {word} 
            </button>
        </div>
    );
}


export default GameCards;