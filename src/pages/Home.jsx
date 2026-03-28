import React from 'react';
import '../App.css';
import Header from '../parts/Header.jsx';
import Card from '../parts/Card.jsx';
// Connect ai probably api to the terminal, but for now it's just a static chat room. WIP
// train your own ai to answer questions about the game, or just have fun asking it random stuff. WIP sure
// WORK DAMN IT!!
function Home() {
  return (
    <div className="App">
      <Header />
      <div className='Content'>
        <div className='HomeCard'>
          <h1>Welcome</h1>
          <p>Your gateway to the universe of possibilities.</p>
        </div>
      </div>
      <div className='ExampleCards'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      {/* Here is going to be a "terminal" where you can ask an ai "smart" questions.
      Guess what? don't have to reply.
      WIP*/}
      <div className='Room'>
        <div className='AlignTerminal'>
          <h3>Terminal:</h3>
          <div className='ChatRoom'>

            <div className='Chat'>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
              <p>{'>'}_ Ask me anything.</p>
              <p>Hello there! {'<User'}</p>
              <p>{'>'}_ ...Bye.</p>
            </div>

            <form action="">
              <div className='InputArea'>
                <input type="text" placeholder='Ask me anything...' />
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