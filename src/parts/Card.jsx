import React from 'react';
import '../App.css';
import img from '../assets/tempgame.jpg';

function Card() {
  return (
    <div className="Card">
      <span>
        <img src={img} alt="Game Image" />
        <h3>Sarania</h3>
        <div className='TextBox'><p>A visual novel about picking the right choice in your eyes and face the consiquences. You play as a young thing, not belonging anywhere and no matter what you do its useless in the eyes of the world.</p></div>
      </span>
      <h5>Date: 1.1.2024</h5>
    </div>
  );
}

export default Card;