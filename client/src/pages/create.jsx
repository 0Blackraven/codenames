import { useNavigate } from 'react-router-dom';
import react from 'react';

export function Create(){

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/game');
        alert("GameRoom Created!");
    };

    return (
        <>
            <div className = "create-header">
                <h1>Create A GameRoom</h1>
            </div>
            <div className="create-container">
                <form onSubmit = {handleClick} className="create-form">
                    <input type="text" placeholder="Pick a username" />
                    <button type = "submit" >Create</button>
                </form>
            </div>  
        </>
    );
}