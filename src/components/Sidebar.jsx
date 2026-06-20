import { Home, Briefcase, Server, BookOpen, Newspaper, Image, DollarSign, Dumbbell, Settings, ChevronRight } from 'lucide-react'

export default function Sidebar({ active, onNavigate, features = [], profile }) {
  const theme = profile?.theme || 'stark-gold'

  const NAV = [
    { id:'home',      icon:Home,       label:'Visão Geral', section:'Principal', always:true },
    { id:'jobs',      icon:Briefcase,  label:'Vagas',       section:null,        always:true, count:true },
    { id:'projects',  icon:Server,     label:'Projetos',    section:null,        always:true },
    { id:'study',     icon:BookOpen,   label:'Estudos',     section:'Conhecimento', always:true },
    { id:'news',      icon:Newspaper,  label:'Notícias',    section:null,        always:true },
    { id:'moodboard', icon:Image,      label:'Moodboard',   section:'Extras',    feature:'moodboard' },
    { id:'financas',  icon:DollarSign, label:'Gastos',      section:null,        feature:'financas' },
    { id:'academia',  icon:Dumbbell,   label:'Academia',    section:null,        feature:'academia' },
  ].filter(item => item.always || features.includes(item.feature))

  // Agrupa por seção
  let lastSection = null

  const displayName = profile?.name?.split(' ')[0] || 'Usuário'
  const displayRole = profile?.course || 'Penseira'

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-mark">
          {theme === 'stark-gold' ? 'P' : theme === 'nebula' ? '✦' : 'P'}
        </div>
        <div className="sidebar-logo-name">Penseira</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection
          if (item.section) lastSection = item.section

          return (
            <div key={item.id}>
              {showSection && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <div
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon size={16} />
                <span style={{flex:1}}>{item.label}</span>
                {item.count && (
                  <span className="nav-item-count">4</span>
                )}
              </div>
            </div>
          )
        })}

        <div className="sidebar-divider" />
        <div
          className={`nav-item ${active === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <Settings size={16} />
          <span style={{flex:1}}>Config.</span>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => onNavigate('settings')}>
          <div className="sidebar-avatar">
            {displayName[0]?.toUpperCase()}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-role" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{displayRole}</div>
          </div>
          <ChevronRight size={13} style={{color:'var(--text-muted)',flexShrink:0}} />
        </div>
      </div>
    </aside>
  )
}
