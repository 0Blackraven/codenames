import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/landing'
import {Join} from './pages/join'
import {Create} from './pages/create'
import Game from './pages/game'



function App() {

  return (
    <Router>
      <Routes>
        <Route path = '/' element = {<Landing />} />
        <Route path = '/join' element = {<Join />} />
        <Route path = '/create' element = {<Create />} /> 
        <Route path = '/game' element = {<Game />} />
      </Routes>
    </Router>
  )
}

export default App
