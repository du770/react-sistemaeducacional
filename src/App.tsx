import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './styles/theme.css'

import Courses from './pages/Courses'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Grades from './pages/Grades'

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <BrowserRouter>
      <header>
        <h1>React Sistema Educacional</h1>
        <nav>
          <Link to="/">Cursos</Link>
          <Link to="/classes">Turmas</Link>
          <Link to="/students">Estudantes</Link>
          <Link to="/grades">Notas</Link>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        </button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/grades" element={<Grades />} />
        </Routes>
      </main>

      {/* Toasts globais */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  )
}

export default App
