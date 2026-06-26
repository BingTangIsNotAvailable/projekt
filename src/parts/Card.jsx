import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import defaultImg from '../assets/nopic.jpg';

function Card({ game }) {
  // Use uploaded game cover if exists, otherwise fallback to default asset
  const coverUrl = game?.image_path
    ? `http://localhost:3001${game.image_path}`
    : defaultImg;

  return (
    <Link to={`/Game/${game?.id || 1}`} className="CardLink" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="Card">
        <span>
          <img src={coverUrl} alt={game?.title || "Game Image"} onError={(e) => { e.target.src = defaultImg; }} />
          <h4>{game?.title || "Sarania"}</h4>
          <div className='TextBox'>
            <p>{game?.description || "A visual novel novel novel novel novel novel novel about picking the right choice in your eyes and face the consiquences. You play as a young thing, not belonging anywhere and no matter what you do its useless in the eyes of the world."}</p>
          </div>
        </span>
      </div>
    </Link>
  );
}

export default Card;