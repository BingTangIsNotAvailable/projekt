import React from 'react';
import '../App.css';
import img from '../assets/tempgame.jpg';

function Card() {
  return (
    <div className="Card">
      <span>
        <img src={img} alt="Game Image" />
        <h3>Game name</h3>
        <div className='TextBox'><p>aaaaaaaaaaa aaaaaaaaaa aaaaa aaaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaa aaaaaaaa</p></div>
      </span>
      <h5>Date: 1.1.2024</h5>
    </div>
  );
}

export default Card;