import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Landing from './pages/Landing'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={Landing} path="/login" />
        <Route Component={ProtectedRoute} path="/">
          <Route Component={Home} path="/" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
