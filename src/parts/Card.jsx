import React from 'react';
import '../App.css';
import img from '../assets/tempgame.jpg';

function Card({ game }) {
  return (
    <div className="Card">
      <span>
        <img src={img} alt="Game Image" />
        <h3>{game?.title || "Sarania"}</h3>
        <div className='TextBox'><p>{game?.description || "A visual novel novel novel novel novel novel novel about picking the right choice in your eyes and face the consiquences. You play as a young thing, not belonging anywhere and no matter what you do its useless in the eyes of the world."}</p></div>
      </span>
    </div>
  );
}

export default Card;