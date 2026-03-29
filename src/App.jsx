import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ERROR from './pages/ERROR.jsx'
import User from './pages/User.jsx'
import Gamelist from './pages/Gamelist.jsx'
import Game from './pages/Game.jsx'
import Verify from "./pages/Verify"
import Loading from "./pages/Loading"
import Pagemaker from "./pages/Pagemaker"


// Will chnage later to a different routing system if possible and READ the documantations
/*      <nav>
        <Link to="/">Home</Link> |
        <Link to="/Login">Login</Link> |
        <Link to="/Signup">Signup</Link>
      </nav> */

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ERROR" element={<ERROR />} />
        <Route path="/User" element={<User />} />
        <Route path="/Gamelist" element={<Gamelist />} />
        <Route path="/Game" element={<Game />} />
        <Route path="*" element={<ERROR />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/Loading" element={<Loading />} />
        <Route path="/Pagemaker" element={<Pagemaker />} />
      </Routes>
    </>
  )
}

export default App