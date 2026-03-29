import '../App.css';
import Header from '../parts/Header';
import gameCover from '../assets/hi.jpg';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Game() {
    /*
    http://localhost:3001/api/games/search/mine
    
    
    
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:3001/api/games/${id}/comments`)
            .then(res => res.json())
            .then(data => setComments(data));
    }, [id]);

    const { id } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/api/games/${id}`)
            .then(res => res.json())
            .then(data => setGame(data));
    }, [id]);

    if (!game) return <p>Loading...</p>;*/

    return (
        <div className="Game">
            <Header />
            <div className='Middle'>
                <h1>BEST GAME EVER {/*{game.title}*/}</h1>
                <div className='Game_content'>
                    <img src={gameCover} alt="Game Cover" />
                    <div className='Game_info'>
                        <p>something about the game {/*{game.description}*/}</p>
                        <div className='Game_buttons'>
                            <button className='button'>Download</button>
                            <button className='button'>Favorite</button>
                            <button className='button'>Rate</button>
                            <button className='button'>Comments</button>
                        </div>

                    </div>
                    <div className='Game_info_text'>
                        <p>Developer: Arsi "Hakita" Patala</p>
                        <p>Publisher: New Blood Interactive</p>
                        <p>Release Date: September 16, 2020</p>
                        <p>Platform: PC</p>
                        <p>Genre: First-Person Shooter</p>
                        <p>Rating: 10/10</p>
                        <p>Price: $20</p>
                    </div>
                    <div className='Game_comments'>
                        <h4>Comments:</h4>
                        <div className='Game_comments_list'>
                            <img src="" alt="pfp" />
                            <p>Comment 1</p>
                            <img src="" alt="pfp" />
                            <p>Comment 2</p>
                            <img src="" alt="pfp" />
                            <p>Comment 3</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Game;