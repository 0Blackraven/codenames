import { useState } from 'react'
import './App.css'
import Landing from './pages/landing'
import Game from './pages/game'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ThemeButton from './components/custom/themeButton'

function App() {
  return (
    <Router>
      <ThemeButton className="absolute top-5 right-5"/>
      <Routes>
        <Route path = '/' element = {<Landing/>} /> 
        <Route path = '/:game' element = {<Game/>} />
      </Routes>
    </Router>
  )
}

export default App;
