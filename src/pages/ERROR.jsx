import React from 'react';
import '../App.css';

function ERROR() {
  return (
    <div className="Error">
      <div>
        <h1>ERROR</h1>
        <h4>{`>`}_ Something went wrong</h4>
        <p>This page doesn't exist</p>
        <h5>: 404</h5>
        <img src="" alt="" />
      </div>

    </div>
  );
}

export default ERROR;