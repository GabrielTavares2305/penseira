import { useState } from 'react'
import { Briefcase, Server, BookOpen, Star, Zap, Bell, BellOff, Check, Plus, Trash2 } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TIPS = [
  { icon:'🎯', title:'Revisão Ativa',      desc:'Teste a si mesmo antes de reler. Recuperação é mais eficaz que releitura passiva.' },
  { icon:'🔁', title:'Repetição Espaçada', desc:'Revise em intervalos: 1 dia → 3 dias → 1 semana → 1 mês.' },
  { icon:'📦', title:'Método Feynman',     desc:'Explique como se fosse ensinar. O que não dá para explicar, não foi aprendido.' },
  { icon:'🌐', title:'Portfolio GitHub',   desc:'README detalhado em cada projeto. Recrutadores olham o GitHub antes da entrevista.' },
  { icon:'🤝', title:'Networking',         desc:'Contribua com open-source e interaja com a comunidade TI.' },
  { icon:'⏱️', title:'Deep Work',          desc:'90min de foco total valem mais que 4h de multitarefa.' },
]

function CardCorners() {
  return (<><div className="card-corner tl"/><div className="card-corner tr"/><div className="card-corner bl"/><div className="card-corner br"/></>)
}

// Gera os últimos 7 dias para o gráfico
function getLast7Days(pomodoroLog) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.','')
    const entry = pomodoroLog.find(l => l.date === key)
    return { label, count: entry?.count || 0, isToday: i === 6 }
  })
}

export default function Home({ onNavigate, savedJobs, projects, totalSessions, pomodoroLog, dailyCheck, onToggleDaily, reminders, onSetReminders }) {
  const now    = new Date()
  const hour   = now.getHours()
  const greeting = hour < 12 ? 'BOM DIA' : hour < 18 ? 'BOA TARDE' : 'BOA NOITE'
  const chartData = getLast7Days(pomodoroLog)
  const todayCount = chartData[6].count
  const weekTotal  = chartData.reduce((a,d) => a + d.count, 0)
  const doneToday  = dailyCheck.items?.filter(i => i.done).length || 0
  const totalItems = dailyCheck.items?.length || 0

  const { permission, requestPermission } = useNotifications()
  const [showReminders, setShowReminders] = useState(false)
  const [newTime,   setNewTime]   = useState('08:00')
  const [newMsg,    setNewMsg]    = useState('')

  const addReminder = () => {
    if (!newTime) return
    onSetReminders(r => [...r, { id: Date.now(), time: newTime, message: newMsg || 'Hora de estudar!', active: true }])
    setNewMsg('')
  }
  const toggleReminder = id => onSetReminders(r => r.map(x => x.id===id ? {...x,active:!x.active} : x))
  const deleteReminder = id => onSetReminders(r => r.filter(x => x.id!==id))

  return (
    <div>
      {/* Greeting */}
      <div className="card" style={{marginBottom:16,background:'linear-gradient(135deg,#101422 0%,#0C0F1A 100%)'}}>
        <CardCorners/>
        <div className="card-label">// CENTRAL DE COMANDO</div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <svg width="44" height="50" viewBox="0 0 48 56" fill="none" style={{flexShrink:0}}>
            <polygon points="24,2 46,14 46,42 24,54 2,42 2,14" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
            <polygon points="24,8 40,17 40,39 24,48 8,39 8,17" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.5)" strokeWidth="1"/>
            <text x="24" y="34" textAnchor="middle" fontFamily="serif" fontSize="20" fill="#C9A84C" fontWeight="700">✦</text>
          </svg>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
              <span className="pulse-dot"/>
              <span style={{fontFamily:'var(--font-title)',fontSize:'clamp(14px,4vw,20px)',color:'var(--gold)',letterSpacing:2}}>
                {greeting} · PENSEIRA
              </span>
            </div>
            <div style={{fontFamily:'var(--font-hud)',fontSize:'clamp(9px,2.5vw,11px)',color:'var(--cyan-dim)',letterSpacing:1}}>
              {now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
        {[
          {icon:Briefcase, val:savedJobs.length,  label:'VAGAS',    page:'jobs',     color:'var(--gold)'},
          {icon:Server,    val:projects.length,    label:'PROJETOS', page:'projects', color:'var(--cyan)'},
          {icon:BookOpen,  val:totalSessions,      label:'FOCO',     page:'study',    color:'var(--gold)'},
        ].map(s=>(
          <div key={s.page} className="stat-card" style={{cursor:'pointer',padding:'12px 6px'}} onClick={()=>onNavigate(s.page)}>
            <div style={{marginBottom:4}}><s.icon size={15} color={s.color}/></div>
            <div className="stat-value" style={{color:s.color,fontSize:'clamp(18px,5vw,28px)'}}>{s.val}</div>
            <div className="stat-label" style={{fontSize:'clamp(7px,2vw,9px)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        {/* Checklist diário */}
        <div className="card">
          <CardCorners/>
          <div className="card-label">
            // CHECKLIST DO DIA
            <span className="badge badge-gold">{doneToday}/{totalItems}</span>
          </div>
          <div className="progress-bar" style={{marginBottom:12}}>
            <div className="progress-fill" style={{width:`${totalItems?(doneToday/totalItems)*100:0}%`}}/>
          </div>
          {dailyCheck.items?.map(item=>(
            <div key={item.id} className={`checkbox-item ${item.done?'done':''}`}>
              <input type="checkbox" checked={item.done} id={`daily-${item.id}`} onChange={()=>onToggleDaily(item.id)}/>
              <label htmlFor={`daily-${item.id}`}>{item.text}</label>
            </div>
          ))}
          {doneToday===totalItems && totalItems>0 && (
            <div style={{marginTop:12,textAlign:'center',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--cyan)',letterSpacing:2}}>
              ✓ DIA COMPLETO — EXCELENTE!
            </div>
          )}
        </div>

        {/* Histórico Pomodoro */}
        <div className="card">
          <CardCorners/>
          <div className="card-label">
            // HISTÓRICO DE FOCO — 7 DIAS
            <span className="badge badge-cyan">{weekTotal} TOTAL</span>
          </div>
          <div style={{height:110,marginBottom:8}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={18}>
                <XAxis dataKey="label" tick={{fontSize:9,fill:'var(--text-muted)',fontFamily:'Share Tech Mono'}} axisLine={false} tickLine={false}/>
                <Tooltip
                  contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:4,fontFamily:'Share Tech Mono',fontSize:11}}
                  labelStyle={{color:'var(--gold)'}}
                  itemStyle={{color:'var(--cyan)'}}
                  formatter={v=>[`${v} sessões`,'']}
                />
                <Bar dataKey="count" radius={[3,3,0,0]}>
                  {chartData.map((entry,i)=>(
                    <Cell key={i} fill={entry.isToday ? 'var(--gold)' : entry.count>0 ? 'var(--cyan)' : 'var(--bg-hover)'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)'}}>
            <span>HOJE <span style={{color:'var(--gold)'}}>{todayCount} sessões</span></span>
            <span>SEMANA <span style={{color:'var(--cyan)'}}>{weekTotal} sessões</span></span>
          </div>
        </div>
      </div>

      {/* Lembretes de estudo */}
      <div className="card" style={{marginBottom:16}}>
        <CardCorners/>
        <div className="card-label" style={{cursor:'pointer'}} onClick={()=>setShowReminders(s=>!s)}>
          // LEMBRETES DE ESTUDO
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span className="badge badge-gold">{reminders.filter(r=>r.active).length} ATIVOS</span>
            <span style={{color:'var(--text-muted)',fontSize:11}}>{showReminders?'▲':'▼'}</span>
          </div>
        </div>

        {showReminders && (
          <div>
            {permission !== 'granted' && (
              <div style={{background:'var(--bg-hover)',border:'1px solid var(--border)',borderRadius:4,padding:12,marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--gold)',letterSpacing:1}}>
                  ⚠ ATIVE AS NOTIFICAÇÕES DO NAVEGADOR
                </div>
                <button className="btn btn-gold" style={{fontSize:10}} onClick={requestPermission}>
                  <Bell size={11}/> ATIVAR
                </button>
              </div>
            )}

            {/* Adicionar lembrete */}
            <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
              <input type="time" className="input" style={{width:120,flexShrink:0}} value={newTime} onChange={e=>setNewTime(e.target.value)}/>
              <input className="input" style={{flex:1,minWidth:140}} placeholder="Mensagem do lembrete..." value={newMsg} onChange={e=>setNewMsg(e.target.value)}/>
              <button className="btn btn-gold" style={{fontSize:11}} onClick={addReminder}>
                <Plus size={11}/> ADD
              </button>
            </div>

            {/* Lista de lembretes */}
            {reminders.length === 0 && (
              <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1,textAlign:'center',padding:'12px 0'}}>
                NENHUM LEMBRETE CONFIGURADO
              </div>
            )}
            {reminders.map(r=>(
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid var(--border-subtle)'}}>
                <button onClick={()=>toggleReminder(r.id)} style={{flexShrink:0,color:r.active?'var(--cyan)':'var(--text-muted)'}}>
                  {r.active ? <Bell size={14}/> : <BellOff size={14}/>}
                </button>
                <span style={{fontFamily:'var(--font-hud)',fontSize:12,color:'var(--gold)',width:44,flexShrink:0}}>{r.time}</span>
                <span style={{flex:1,fontSize:12,color:r.active?'var(--cream)':'var(--text-muted)'}}>{r.message}</span>
                <button onClick={()=>deleteReminder(r.id)} style={{color:'var(--danger)',flexShrink:0}}><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dicas */}
      <div className="card" style={{marginBottom:16}}>
        <CardCorners/>
        <div className="card-label">
          // PROTOCOLOS DE PRODUTIVIDADE
          <span className="badge badge-gold"><Star size={9} style={{marginRight:3}}/>6</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {TIPS.map((tip,i)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'10px',background:'var(--bg-hover)',borderRadius:4,border:'1px solid var(--border-subtle)'}}>
              <span style={{fontSize:18,flexShrink:0}}>{tip.icon}</span>
              <div>
                <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--gold)',letterSpacing:1,marginBottom:2}}>{tip.title.toUpperCase()}</div>
                <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atalhos */}
      <div className="card">
        <CardCorners/>
        <div className="card-label">// ACESSO RÁPIDO</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            {label:'🔍 VAGAS',     page:'jobs'},
            {label:'⏱️ POMODORO',  page:'study'},
            {label:'🖥️ PROJETOS',  page:'projects'},
            {label:'📰 NOTÍCIAS',  page:'news'},
          ].map(b=>(
            <button key={b.page} className="btn btn-outline" onClick={()=>onNavigate(b.page)} style={{justifyContent:'center',fontSize:11,padding:'10px'}}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
