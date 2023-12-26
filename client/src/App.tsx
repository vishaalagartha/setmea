import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Route Component={Home} path="/" />
    </BrowserRouter>
  )
}

export default App
