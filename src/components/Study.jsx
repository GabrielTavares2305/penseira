import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Plus, BookOpen, ExternalLink } from 'lucide-react'

const SUBJECTS = [
  { id:'calculo',      name:'Cálculo I',                 emoji:'📐', color:'#5BA8FF' },
  { id:'estruturas',   name:'Estrutura de Dados',        emoji:'🌲', color:'#00FFC8' },
  { id:'arquitetura',  name:'Arquitetura de Computadores',emoji:'⚙️', color:'#C9A84C' },
  { id:'bd',           name:'Banco de Dados',            emoji:'🗄️', color:'#C084FC' },
  { id:'so',           name:'Sistemas Operacionais',     emoji:'🐧', color:'#FF4C6A' },
  { id:'concurso',     name:'Concurso Público',          emoji:'📋', color:'#E3B341' },
]

const INIT_TASKS = {
  concurso:   [{id:1,text:'Direito Administrativo — módulo 3',done:false},{id:2,text:'Simulado Conhecimentos Gerais',done:false},{id:3,text:'Português — Concordância verbal',done:true}],
  estruturas: [{id:1,text:'Árvores AVL — implementação',done:true},{id:2,text:'Grafos — BFS e DFS',done:false},{id:3,text:'Hashing e tabelas hash',done:false}],
}

export default function Study({ onPomodoroComplete, totalSessions }) {
  const [mode, setMode]         = useState('work')
  const [timeLeft, setTimeLeft] = useState(25*60)
  const [running, setRunning]   = useState(false)
  const [cycles, setCycles]     = useState(0)
  const [data, setData]         = useState(Object.fromEntries(SUBJECTS.map(s=>[s.id,{tasks: INIT_TASKS[s.id]||[]}])))
  const [notes, setNotes]       = useState({})
  const [activeNote, setNote]   = useState('calculo')
  const iRef = useRef(null)
  const DURATIONS = { work:25*60, break:5*60 }

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(iRef.current); setRunning(false)
            if (mode==='work') { setCycles(c=>c+1); onPomodoroComplete&&onPomodoroComplete() }
            const next = mode==='work'?'break':'work'
            setMode(next); return DURATIONS[next]
          }
          return t-1
        })
      }, 1000)
    } else clearInterval(iRef.current)
    return () => clearInterval(iRef.current)
  }, [running, mode])

  const reset = () => { setRunning(false); setTimeLeft(DURATIONS[mode]) }
  const switchMode = m => { setRunning(false); setMode(m); setTimeLeft(DURATIONS[m]) }

  const mm = String(Math.floor(timeLeft/60)).padStart(2,'0')
  const ss = String(timeLeft%60).padStart(2,'0')
  const total = DURATIONS[mode]
  const prog  = ((total-timeLeft)/total)*100
  const r = 68; const circ = 2*Math.PI*r

  const toggleTask = (sid, tid) => setData(d=>({...d,[sid]:{...d[sid],tasks:d[sid].tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}}))
  const addTask    = (sid, text) => setData(d=>({...d,[sid]:{...d[sid],tasks:[...d[sid].tasks,{id:Date.now(),text,done:false}]}}))

  const totalDone  = Object.values(data).reduce((a,d)=>a+d.tasks.filter(t=>t.done).length,0)
  const totalTasks = Object.values(data).reduce((a,d)=>a+d.tasks.length,0)

  return (
    <div>
      <div className="grid-3" style={{ marginBottom:20 }}>
        {[
          {val:totalSessions, label:'SESSÕES POMODORO', color:'var(--gold)'},
          {val:totalDone,     label:'REVISÕES FEITAS',  color:'var(--cyan)'},
          {val:totalTasks-totalDone, label:'PENDENTES',  color:'var(--text-secondary)'},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-value" style={{color:s.color}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div>
          {/* Pomodoro */}
          <div className="card" style={{ marginBottom:16 }}>
            <div className="card-corner tl"/><div className="card-corner br"/>
            <div className="card-label">// POMODORO TIMER <span className="card-label-right">{cycles} CICLOS</span></div>
            <div style={{ display:'flex', gap:8, marginBottom:20, justifyContent:'center' }}>
              {[['work','🧠 FOCO 25MIN'],['break','☕ PAUSA 5MIN']].map(([m,l])=>(
                <button key={m} className={`btn ${mode===m?'btn-gold':'btn-outline'}`} style={{fontSize:10}} onClick={()=>switchMode(m)}>{l}</button>
              ))}
            </div>
            <div className="pomodoro-ring">
              <svg width="160" height="160" viewBox="0 0 160 160" style={{transform:'rotate(-90deg)'}}>
                <circle cx="80" cy="80" r={r} fill="none" stroke="var(--bg-hover)" strokeWidth="6"/>
                <circle cx="80" cy="80" r={r} fill="none"
                  stroke={mode==='work'?'var(--gold)':'var(--cyan)'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ*(1-prog/100)}
                  style={{transition:'stroke-dashoffset 1s linear', filter:`drop-shadow(0 0 6px ${mode==='work'?'var(--gold)':'var(--cyan)'})`}}/>
                {/* anel externo decorativo */}
                <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth="1"/>
              </svg>
              <div className="pomodoro-time">
                <div className="pomodoro-digits">{mm}:{ss}</div>
                <div className="pomodoro-label">{mode==='work'?'FOCO':'PAUSA'}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:20 }}>
              <button className="btn btn-outline" onClick={reset}><RotateCcw size={13}/></button>
              <button className="btn btn-gold" style={{minWidth:110}} onClick={()=>setRunning(r=>!r)}>
                {running?<><Pause size={13}/> PAUSAR</>:<><Play size={13}/> {timeLeft===DURATIONS[mode]?'INICIAR':'CONTINUAR'}</>}
              </button>
            </div>
          </div>

          {/* Matérias */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {SUBJECTS.map(s => {
              const d = data[s.id]
              const done = d.tasks.filter(t=>t.done).length
              const tot  = d.tasks.length
              const [open, setOpen] = useState(false)
              const [inp, setInp]   = useState('')
              return (
                <div key={s.id} className="card" style={{ borderLeft:`2px solid ${s.color}`, padding:12 }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setOpen(o=>!o)}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:18}}>{s.emoji}</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,color:'var(--cream)'}}>{s.name}</div>
                        <div style={{fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',letterSpacing:1}}>{done}/{tot} REVISÕES</div>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      {tot>0&&<div style={{width:60}}><div className="progress-bar"><div className="progress-fill" style={{width:`${tot?(done/tot)*100:0}%`,background:s.color}}/></div></div>}
                      <span style={{color:'var(--text-muted)',fontSize:11}}>{open?'▲':'▼'}</span>
                    </div>
                  </div>
                  {open && (
                    <div style={{marginTop:12}}>
                      {d.tasks.map(t=>(
                        <div key={t.id} className={`checkbox-item ${t.done?'done':''}`}>
                          <input type="checkbox" checked={t.done} id={`${s.id}-${t.id}`} onChange={()=>toggleTask(s.id,t.id)}/>
                          <label htmlFor={`${s.id}-${t.id}`}>{t.text}</label>
                        </div>
                      ))}
                      <div style={{display:'flex',gap:8,marginTop:8}}>
                        <input className="input" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&inp.trim()&&(addTask(s.id,inp.trim()),setInp(''))} placeholder="ADICIONAR REVISÃO..." style={{fontSize:11}}/>
                        <button className="btn btn-outline" onClick={()=>inp.trim()&&(addTask(s.id,inp.trim()),setInp(''))}><Plus size={12}/></button>
                      </div>
                      {s.id==='concurso'&&(
                        <a href="https://www.grancursosonline.com.br" target="_blank" rel="noopener" className="btn btn-cyan" style={{fontSize:10,marginTop:10,display:'inline-flex'}}>
                          <ExternalLink size={11}/> GRAN CONCURSOS
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Anotações */}
        <div className="card" style={{display:'flex',flexDirection:'column',height:'fit-content'}}>
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// ANOTAÇÕES POR MATÉRIA</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:14}}>
            {SUBJECTS.map(s=>(
              <button key={s.id} className={`btn ${activeNote===s.id?'btn-gold':'btn-outline'}`} style={{fontSize:10,padding:'4px 8px'}} onClick={()=>setNote(s.id)}>
                {s.emoji} {s.name.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
          <textarea
            className="textarea"
            style={{minHeight:400,background:'var(--bg-deep)',fontFamily:'var(--font-hud)',fontSize:12,lineHeight:1.8,letterSpacing:0.5}}
            placeholder={`// ANOTAÇÕES · ${SUBJECTS.find(s=>s.id===activeNote)?.name.toUpperCase()}\n\n> tópico\n- ponto importante\n- outro ponto\n\n> fórmula ou definição`}
            value={notes[activeNote]||''}
            onChange={e=>setNotes(n=>({...n,[activeNote]:e.target.value}))}
          />
          <div style={{fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',marginTop:8,letterSpacing:1}}>
            {(notes[activeNote]||'').length} CHARS · LOCAL
          </div>
        </div>
      </div>
    </div>
  )
}
