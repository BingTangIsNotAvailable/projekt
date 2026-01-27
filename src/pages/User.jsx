import React from 'react';
import '../App.css';
import Header from '../parts/Header';

function User() {
  return (
    <div className="User">
        
      <Header/>
      <span>
        {/*<Card/>
        <Card/>*/}
      </span>

      <div>
        <img src="" alt="" />
        <h1>USER</h1>
        <div className='line'></div>
        <p>This is the user page. More features coming soon!</p>
      </div>

      <span>
        
      </span>
    </div>
  );
}

export default User;