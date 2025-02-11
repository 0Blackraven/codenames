import { useNavigate } from 'react-router-dom';

export function Join(){
    const navigate = useNavigate();

    const joinHandler = (e) => {
        e.preventDefault();
        navigate('/game');
    }
    return (
        <div>
            <h1>Join A Game</h1>
            <form onSubmit ={joinHandler}>
                <input type="text" placeholder="Enter Game Code" required/>
                <input type="text" placeholder="Enter Your Username" required/>
                <button type = "submit">Join</button>
            </form>
        </div>
    );
}