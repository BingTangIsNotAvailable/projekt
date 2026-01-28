import React from 'react';
import '../App.css';
import Header from '../parts/Header.jsx';
import Card from '../parts/Card.jsx';

/* Home page add examples of games to catch the users eye. align button in sign in and log in (done). button is too light. delete the <a> in Home and implement it to the header.*/
/*connect git*/
function Home() {
  return (
    <div className="App">
      <Header />
      {/* Just a basic Welcome page. */}
      <div className='Content'>
        <div className='HomeCard'>
          <h1>Welcome</h1>
            <p>Your gateway to the universe of possibilities.</p>
            {/*<a href="/User">User</a>
            <a href="/Gamelist">Gamelist</a>*/}
            <a href="/Card">card</a>
        </div>


      </div>
        <div className='ExampleCards'>
          <Card />
          <Card />
          <Card />
        </div>
      {/* Here is going to be a "terminal" where you can ask an ai "smart" questions.
      Guess what? don't have to reply.
      WIP*/}
      <div className='Room'>
        <div className='AlignTerminal'>
          <h2>Terminal:</h2>
          <div className='ChatRoom'>

            <div className='Chat'>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
            </div>
            
              <form action="">
                <div className='InputArea'>
                  <input type="text" placeholder='Ask me anything...'/>
                  <button type="submit" className='btn'>Send</button> 
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;