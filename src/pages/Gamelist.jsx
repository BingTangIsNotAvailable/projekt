import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';
import React, { useEffect, useState } from 'react';

function Gamelist() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/genres")
      .then(res => res.json())
      .then(data => setGenres(data));
  }, []);

  useEffect(() => {
    const url = search
      ? `http://localhost:3001/api/games/search/${search}`
      : "http://localhost:3001/api/games";

    fetch(url)
      .then(res => res.json())
      .then(data => setGames(data));
  }, [search]);

  return (
    <div className="Gamelist">
      <Header />
      <div className="Contentlist">
        <div className='Genres'>
          <h3>Genres</h3>
          {genres.map(genre => (
            <a key={genre.id} href="#">{genre.name}</a>
          ))}
          {/* the last genre is not visible and is too far down - scrolling is functional but is too close to the edge */}
        </div>
        <div className='Change'>
          <div className='Search'>
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='Games'>
            {games.map(game => (
              <Card key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Gamelist;