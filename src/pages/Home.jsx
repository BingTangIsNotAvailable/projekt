import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import Header from '../parts/Header.jsx';
import Card from '../parts/Card.jsx';

function Home() {
  const [messages, setMessages] = useState([
    { text: ">_ Hello! I am Planet.X AI. How can I assist you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const [games, setGames] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/games')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGames(data);
        else if (data.success && Array.isArray(data.games)) setGames(data.games);
        else setGames(data);
      })
      .catch(err => console.error("Failed to fetch games:", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Calling our backend on port 3001
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || (response.status === 429 ? "Quota Exceeded: Your API key has ran out of credits." : "Failed to connect to the mainframe.");
        setMessages(prev => [...prev, { text: errorMsg, sender: "bot", isError: true }]);
      } else {
        setMessages(prev => [...prev, { text: data.message, sender: "bot" }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "Network disconnected. Could not reach the server.", sender: "bot", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className='Content'>
        <div className='HomeCard'>
          <h1>Welcome</h1>
          <p>Feel free to share your games, webs or anything you can put in a zip file. Download at your own risk, I am not responsible for any damages.</p>
        </div>
      </div>
      <div className={`ExampleCardsDrawer${cardsOpen ? ' open' : ''}`}>
        <button
          className='ExampleCardsTab'
          onClick={() => setCardsOpen(prev => !prev)}
          title={cardsOpen ? 'Close examples' : 'Show examples'}
        >
          <span className='ExampleCardsTabLabel'>Games</span>
          <span className={`ExampleCardsTabArrow${cardsOpen ? ' flipped' : ''}`}>›</span>
        </button>
        <div className='ExampleCards'>
          {games.length > 0 ? (
            games.map(game => (
              <Card key={game.id} game={game} />
            ))
          ) : (
            <p className="no-games">No games found.</p>
          )}
        </div>
      </div>

      {/* AI Chat Room */}
      <h1 className='Terminal'>Terminal</h1>
      <div className='ChatContainer'>

        <div className='MessagesArea' id='messagesArea'>
          {messages.map((msg, index) => (
            <div key={index} className={`Message Custom${msg.sender === 'bot' ? 'Bot' : 'User'} ${msg.isError ? 'Error' : ''}`}>
              {msg.isError && msg.sender === 'bot' ? (
                <><span className="ErrorTitle">System Error</span>{msg.text}</>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isLoading && (
            <div className="Message CustomBot">
              <span className="typing-indicator">{`>_`}Planet.X AI is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <footer className="InputArea">
          <form className="InputForm" id="chatForm" onSubmit={sendMessage}>
            <input
              type="text"
              id="UserInput"
              placeholder="Initialize transmission..."
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="SendBtn" id="SendBtn" title="Send Message" disabled={isLoading}>
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default Home;