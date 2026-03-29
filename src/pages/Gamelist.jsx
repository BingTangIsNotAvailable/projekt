import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';

function Gamelist() {
  return (
    <div className="Gamelist">
      <Header />
      <div className="Contentlist">
        <div className='Genres'>
          <h3>Genres</h3>
          <a href="#">Action</a>
          <a href="#">Adventure</a>
          <a href="#">RPG</a>
          <a href="#">Strategy</a>
          <a href="#">Simulation</a>
          <a href="#">Sports</a>
          <a href="#">Puzzle</a>
          <a href="#">Racing</a>
          <a href="#">Fighting</a>
          <a href="#">MMO</a>
          <a href="#">Horror</a>
          <a href="#">Survival</a>
          <a href="#">Webs</a>
          <a href="#">Other</a>
        </div>

        <div className='Games'>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>

  );
}

export default Gamelist;