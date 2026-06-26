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
import Forgotpassword from "./pages/Forgotpassword"
import Resetpassword from "./pages/Resetpassword"

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
        <Route path="/Game/:id" element={<Game />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/Loading" element={<Loading />} />
        <Route path="/Pagemaker" element={<Pagemaker />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset/:token" element={<Resetpassword />} />
        <Route path="*" element={<ERROR />} />
      </Routes>
    </>
  )
}

export default App