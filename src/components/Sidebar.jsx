import { Home, Briefcase, Server, BookOpen, Newspaper, Image, DollarSign, Settings } from 'lucide-react'

export default function Sidebar({ active, onNavigate, features = [] }) {
  const NAV = [
    { id:'home',     icon:Home,       label:'INÍCIO',   always:true },
    { id:'jobs',     icon:Briefcase,  label:'VAGAS',    always:true },
    { id:'projects', icon:Server,     label:'PROJETOS', always:true },
    { id:'study',    icon:BookOpen,   label:'ESTUDOS',  always:true },
    { id:'news',     icon:Newspaper,  label:'NOTÍCIAS', always:true },
    { id:'moodboard',icon:Image,      label:'MOODBOARD',feature:'moodboard' },
    { id:'financas', icon:DollarSign, label:'GASTOS',   feature:'financas' },
  ].filter(item => item.always || features.includes(item.feature))

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,1 31,9 31,27 16,35 1,27 1,9" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1"/>
          <polygon points="16,5 27,11 27,25 16,31 5,25 5,11" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.6)" strokeWidth="1"/>
          <text x="16" y="22" textAnchor="middle" fontFamily="serif" fontSize="14" fill="#C9A84C" fontWeight="700">P</text>
        </svg>
      </div>
      <div className="sidebar-divider"/>
      {NAV.map(item => (
        <div key={item.id} className={`nav-item ${active===item.id?'active':''}`} data-label={item.label} onClick={()=>onNavigate(item.id)}>
          <item.icon size={17}/>
        </div>
      ))}
      <div className="sidebar-footer">
        <div className="sidebar-divider"/>
        <div className={`nav-item ${active==='settings'?'active':''}`} data-label="CONFIGURAÇÕES" onClick={()=>onNavigate('settings')} style={{marginTop:4}}>
          <Settings size={17}/>
        </div>
        <div style={{fontFamily:'var(--font-hud)',fontSize:8,letterSpacing:1,color:'var(--text-muted)',textAlign:'center',paddingTop:6,lineHeight:1.8}}>
          <div>v1.0</div>
          <div style={{color:'var(--cyan)',opacity:0.6}}>●</div>
        </div>
      </div>
    </aside>
  )
}
