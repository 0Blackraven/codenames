import './App.css'
import Landing from './pages/landing'
import Game from './pages/game'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ThemeButton from './components/custom/themeButton'

function App() {
  return (
    <Router>
      <div>
        <ThemeButton className="fixed lg:top-2 lg:right-9 right-3"/>
      </div>     
      <Routes className="">
        <Route path = '/' element = {<Landing/>} /> 
        <Route path = '/:game' element = {<Game/>} />
      </Routes>
    </Router>
  )
}

export default App;
