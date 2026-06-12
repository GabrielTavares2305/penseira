import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Projects from './components/Projects'
import Study from './components/Study'
import News from './components/News'

const PAGES = {
  home:     '// VISÃO GERAL',
  jobs:     '// VAGAS · TI',
  projects: '// PROJETOS',
  study:    '// ESTUDOS',
  news:     '// NOTÍCIAS TI',
}

export default function App() {
  const [page, setPage] = useState('home')
  const [time, setTime] = useState(new Date())
  const [pomodoroSessions, setPomodoroSessions] = useState(0)
  const [savedJobs] = useState([])
  const [projects] = useState([{}, {}])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = `${pad(time.getDate())}.${pad(time.getMonth()+1)}.${time.getFullYear()}`

  return (
    <div className="app">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-logo">PENSEIRA</div>
            <div className="topbar-sep" />
            <div className="page-title">{PAGES[page]}</div>
          </div>
          <div className="topbar-right">
            <span style={{ color: 'var(--text-muted)' }}>STATUS <span>ONLINE</span></span>
            <span style={{ color: 'var(--text-muted)' }}>SYS <span>NOMINAL</span></span>
            <span style={{ color: 'var(--text-muted)' }}>{dateStr} <span>{timeStr}</span></span>
          </div>
        </header>
        <div className="main-content">
          {page === 'home'     && <Home onNavigate={setPage} jobs={savedJobs} projects={projects} studySessions={pomodoroSessions} />}
          {page === 'jobs'     && <Jobs />}
          {page === 'projects' && <Projects />}
          {page === 'study'    && <Study onPomodoroComplete={() => setPomodoroSessions(s => s+1)} totalSessions={pomodoroSessions} />}
          {page === 'news'     && <News />}
        </div>
      </div>
    </div>
  )
}
