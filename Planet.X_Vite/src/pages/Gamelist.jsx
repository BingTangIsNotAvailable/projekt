import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';
import React, { useEffect, useState } from 'react';

function Gamelist() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  useEffect(() => {
    fetch(`${window.API_URL}/api/genres`)
      .then(res => res.json())
      .then(data => setGenres(data));
  }, []);

  useEffect(() => {
    const url = search
      ? `${window.API_URL}/api/games/search/${search}`
      : `${window.API_URL}/api/games`;

    fetch(url)
      .then(res => res.json())
      .then(data => setGames(data));
  }, [search]);

  // Map pre-populated games to genres locally if database columns are null
  const getGameGenreId = (game) => {
    if (game.genre_id) return parseInt(game.genre_id);
    const title = game.title?.toLowerCase() || "";
    /*if (title.includes("ultrakill") || title.includes("doom")) return 1; // Action
    if (title.includes("minecraft")) return 12; // Survival
    if (title.includes("stardew")) return 3; // RPG*/
    return null;
  };

  const filteredGames = games.filter(game => {
    if (!selectedGenreId) return true;
    return getGameGenreId(game) === selectedGenreId;
  });

  return (
    <div className="Gamelist">
      <Header />
      <div className="Contentlist">
        <div className='Genres'>
          <h3>Genres</h3>
          <a
            href="#"
            className={selectedGenreId === null ? "active-genre" : ""}
            onClick={(e) => { e.preventDefault(); setSelectedGenreId(null); }}
          >
            All Genres
          </a>
          {genres.map(genre => (
            <a
              key={genre.id}
              href="#"
              className={selectedGenreId === genre.id ? "active-genre" : ""}
              onClick={(e) => { e.preventDefault(); setSelectedGenreId(genre.id); }}
            >
              {genre.name}
            </a>
          ))}
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
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                <Card key={game.id} game={game} />
              ))
            ) : (
              <p className="no-games">No games found in this genre.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gamelist;