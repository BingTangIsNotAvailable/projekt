import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import gameCover from '../assets/hi.jpg';

function Game() {
    return (
        <div className="Game">
            <Header />
            <div className='Middle'>
                <h1>ULTRAKILL</h1>
                <div className='Game_content'>
                    <img src={gameCover} alt="Game Cover" />
                    <div className='Game_info'>
                        <p>ULTRAKILL is a fast-paced first-person shooter game developed by Arsi "Hakita" Patala and published by New Blood Interactive. It was released in early access on September 16, 2020, and is currently available on PC. and it is very good. More info coming soon. I need more text for testing purposes. ULTRAKILL is a fast-paced first-person shooter game developed by Arsi "Hakita" Patala and published by New Blood Interactive. It was released in early access on September 16, 2020, and is currently available on PC. and it is very good. More info coming soon. I need more text for testing purposes.</p>
                        <div className='Game_buttons'>
                            <button>Download</button>
                            <button>Favorite</button>
                            <button>Rate</button>
                            <button>Comments</button>
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