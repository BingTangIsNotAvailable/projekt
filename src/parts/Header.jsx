import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Ico from '../assets/PlanetIcon.png';

// Global audio state to persist playback across page navigation
const TRACKS = [
  '/music/track1.mp3',
  '/music/track2.mp3',
  '/music/track3.mp3'
];

let globalAudio = null;
let globalIsPlaying = false;
let currentTrackUrl = '';
const stateSubscribers = new Set();

function updateSubscribers() {
  stateSubscribers.forEach(callback => callback(globalIsPlaying));
}

function startRandomPlayback() {
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.addEventListener('ended', () => {
      playRandomTrack();
    });
  }
  playRandomTrack();
}

function playRandomTrack() {
  if (!globalAudio) return;

  let nextTrack = TRACKS[Math.floor(Math.random() * TRACKS.length)];
  if (TRACKS.length > 1 && nextTrack === currentTrackUrl) {
    const remainingTracks = TRACKS.filter(t => t !== currentTrackUrl);
    nextTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
  }

  currentTrackUrl = nextTrack;
  globalAudio.src = nextTrack;
  globalAudio.play()
    .then(() => {
      globalIsPlaying = true;
      updateSubscribers();
    })
    .catch(err => {
      console.error("Playback failed, audio skipped:", err);
      globalIsPlaying = false;
      updateSubscribers();
    });
}

function stopPlayback() {
  if (globalAudio) {
    globalAudio.pause();
  }
  globalIsPlaying = false;
  updateSubscribers();
}

function togglePlayback() {
  if (globalIsPlaying) {
    stopPlayback();
  } else {
    startRandomPlayback();
  }
}

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return systemPrefersDark ? "dark" : "light";
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsPlaying(globalIsPlaying);
    const handleStateChange = (playingState) => {
      setIsPlaying(playingState);
    };
    stateSubscribers.add(handleStateChange);
    return () => {
      stateSubscribers.delete(handleStateChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
  };

  if (token) {
    console.log("User is logged in");
  }
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className='header_filler'></div>
      <div className="header">
        <div className='left_header'>
          <a href="/" className="logo_box">
            <img src={Ico} alt="Icon" className='icon' />
            <h1>Planet.X</h1>
          </a>
        </div>
        <div className='right_header'>
          {/* Music button*/}
          <button
            className={`Clear_btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlayback}
            title={isPlaying ? "Mute music" : "Play random music"}
          >
            <i>&#9835;</i>
          </button>

          {/* theme button */}
          <button 
            className='Clear_btn'
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <i> &#9681;</i>
          </button>
          {/*<Link to="/Login" className='btn_white btn'>Log In</Link>
          <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
          <Link to="/User" className='btn_white btn_round btn'>User</Link>*/}
          {token ? (
            <>
              <Link to="/User" className='btn_white btn_round btn'>User</Link>
              <button className='btn_blue btn_round btn' onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" className='btn_white btn'>Log In</Link>
              <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
            </>
          )}
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown_btn">V</button>
            {isDropdownOpen && (
              <div className="dropdown_content">
                <Link to="/Pagemaker">Create Page</Link>
                <Link to="/Gamelist">Game List</Link>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
/*
    <div className="header">
      <div className='left_header'>
        <a href="/" className="logo_box">
          <img src={Ico} alt="Icon" className='icon' />
          <h1>Planet.X</h1>
        </a>


      </div>
      <div className='right_header'>
        <Link to="/Login" className='btn_white btn'>Log In</Link>
        <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
      </div>
    </div>
*/