import { useState, useEffect } from 'react'
import './App.css'
import SplashLogin from './components/SplashLogin'
import Onboarding  from './components/Onboarding'
import Welcome     from './components/Welcome'
import Sidebar     from './components/Sidebar'
import Home        from './components/Home'
import Jobs        from './components/Jobs'
import Projects    from './components/Projects'
import Study       from './components/Study'
import News        from './components/News'
import Moodboard   from './components/Moodboard'
import Financas    from './components/Financas'
import Settings    from './components/Settings'
import { useAuth }         from './hooks/useAuth'
import { useTheme }        from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNotifications} from './hooks/useNotifications'
import { Home as HomeIcon, Briefcase, Server, BookOpen, Newspaper, LogOut } from 'lucide-react'

const PAGE_TITLES = {
  home:      '// VISÃO GERAL',
  jobs:      '// VAGAS',
  projects:  '// PROJETOS',
  study:     '// ESTUDOS',
  news:      '// NOTÍCIAS',
  moodboard: '// MOODBOARD',
  financas:  '// CONTROLE DE GASTOS',
  settings:  '// CONFIGURAÇÕES',
}

const todayKey = () => new Date().toISOString().slice(0,10)

function AuthenticatedApp({ user, profile, onProfileUpdate, logout }) {
  const uid      = user.uid
  const theme    = profile?.theme || 'stark-gold'
  const features = profile?.features || []

  useTheme(theme)

  const [page, setPage] = useState('home')
  const [time, setTime] = useState(new Date())

  const [pomodoroLog, setPomodoroLog] = useLocalStorage(`${uid}_pomodoro_log`, [])
  const [reminders,   setReminders]   = useLocalStorage(`${uid}_reminders`,    [])
  const [dailyCheck,  setDailyCheck]  = useLocalStorage(`${uid}_daily_check`,  { date:'', items:[] })
  const [savedJobs]                   = useLocalStorage(`${uid}_saved_jobs`,    [])
  const [projects]                    = useLocalStorage(`${uid}_projects`,      [])

  const { scheduleReminder } = useNotifications()

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date())
      const s = new Date()
      if (s.getSeconds() === 0) scheduleReminder(reminders)
    }, 1000)
    return () => clearInterval(t)
  }, [reminders])

  useEffect(() => {
    if (dailyCheck.date !== todayKey()) {
      setDailyCheck({
        date: todayKey(),
        items: [
          { id:1, text:'Estudar pelo menos 1 matéria',  done:false },
          { id:2, text:'Fazer uma revisão pendente',    done:false },
          { id:3, text:'Candidatar para uma vaga',      done:false },
          { id:4, text:'Atualizar um projeto',          done:false },
          { id:5, text:'Ler notícias',                  done:false },
        ]
      })
    }
  }, [])

  const onPomodoroComplete = () => {
    const today = todayKey()
    setPomodoroLog(log => {
      const ex = log.find(l=>l.date===today)
      if (ex) return log.map(l=>l.date===today?{...l,count:l.count+1}:l)
      return [...log,{date:today,count:1}]
    })
  }

  const toggleDailyItem = (id) => {
    setDailyCheck(d=>({...d,items:d.items.map(i=>i.id===id?{...i,done:!i.done}:i)}))
  }

  const pad     = n => String(n).padStart(2,'0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = `${pad(time.getDate())}.${pad(time.getMonth()+1)}.${time.getFullYear()}`
  const totalSessions = pomodoroLog.reduce((a,l)=>a+l.count,0)
  const displayName   = (profile?.name||user.displayName||user.email)?.split(' ')[0]||'Usuário'

  return (
    <div className="app">
      <Sidebar active={page} onNavigate={setPage} features={features}/>
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-logo">PENSEIRA</div>
            <div className="topbar-sep"/>
            <div className="page-title">{PAGE_TITLES[page]||''}</div>
          </div>
          <div className="topbar-right">
            <span style={{color:'var(--text-muted)'}}>OLÁ, <span>{displayName.toUpperCase()}</span></span>
            <span style={{color:'var(--text-muted)'}}>{dateStr} <span>{timeStr}</span></span>
            <button onClick={logout} title="Sair"
              style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:4,fontFamily:'var(--font-hud)',fontSize:10,letterSpacing:1}}>
              <LogOut size={13}/> SAIR
            </button>
          </div>
        </header>
        <div className="main-content">
          {page==='home'      && <Home onNavigate={setPage} savedJobs={savedJobs} projects={projects} totalSessions={totalSessions} pomodoroLog={pomodoroLog} dailyCheck={dailyCheck} onToggleDaily={toggleDailyItem} reminders={reminders} onSetReminders={setReminders}/>}
          {page==='jobs'      && <Jobs uid={uid} area={profile?.area}/>}
          {page==='projects'  && <Projects uid={uid}/>}
          {page==='study'     && <Study uid={uid} userSubjects={profile?.subjects} onPomodoroComplete={onPomodoroComplete} totalSessions={totalSessions} pomodoroLog={pomodoroLog}/>}
          {page==='news'      && <News/>}
          {page==='moodboard' && features.includes('moodboard') && <Moodboard uid={uid} theme={theme}/>}
          {page==='financas'  && features.includes('financas')  && <Financas  uid={uid} theme={theme}/>}
          {page==='settings'  && <Settings user={user} profile={profile} onProfileUpdate={onProfileUpdate} logout={logout}/>}
        </div>
      </div>
      <nav className="bottom-nav">
        {[
          {id:'home',icon:HomeIcon,label:'INÍCIO'},
          {id:'jobs',icon:Briefcase,label:'VAGAS'},
          {id:'projects',icon:Server,label:'PROJETOS'},
          {id:'study',icon:BookOpen,label:'ESTUDOS'},
          {id:'news',icon:Newspaper,label:'NOTÍCIAS'},
        ].map(item=>(
          <button key={item.id} className={`bottom-nav-item ${page===item.id?'active':''}`} onClick={()=>setPage(item.id)}>
            <item.icon size={20}/>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{position:'fixed',inset:0,background:'#060810',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:24,color:'#C9A84C',letterSpacing:6}}>PENSEIRA</div>
      <div style={{width:32,height:32,border:'2px solid rgba(201,168,76,0.2)',borderTopColor:'#C9A84C',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function App() {
  const { user, loading, logout } = useAuth()
  const [showWelcome,    setShowWelcome]    = useState(false)
  const [welcomeProfile, setWelcomeProfile] = useState(null)
  const [localProfile,   setLocalProfile]   = useState(null)

  if (loading) return <LoadingScreen/>
  if (!user)   return <SplashLogin/>

  const profile = localProfile || user.profile

  if (!profile?.onboardingDone) {
    return (
      <Onboarding user={user} onComplete={(p)=>{
        setWelcomeProfile(p)
        setLocalProfile(p)
        setShowWelcome(true)
      }}/>
    )
  }

  const handleProfileUpdate = (updates) => {
    setLocalProfile(p=>({...(p||profile),...updates}))
  }

  if (showWelcome && welcomeProfile) {
    return (
      <>
        <Welcome profile={welcomeProfile} onDone={()=>setShowWelcome(false)}/>
        <AuthenticatedApp user={user} profile={{...profile,...welcomeProfile}} onProfileUpdate={handleProfileUpdate} logout={logout}/>
      </>
    )
  }

  return <AuthenticatedApp user={user} profile={profile} onProfileUpdate={handleProfileUpdate} logout={logout}/>
}
