import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Plus, ExternalLink, Maximize2, Minimize2, Bell, BellOff } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Matérias extraídas para componente filho — resolve o useState dentro de map()
function SubjectCard({ subject, data, onToggleTask, onAddTask }) {
  const [open, setOpen] = useState(false)
  const [inp,  setInp]  = useState('')
  const done = data.tasks.filter(t=>t.done).length
  const tot  = data.tasks.length

  const handleAdd = () => {
    if (inp.trim()) { onAddTask(subject.id, inp.trim()); setInp('') }
  }

  return (
    <div className="card" style={{borderLeft:`2px solid ${subject.color}`,padding:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setOpen(o=>!o)}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:18}}>{subject.emoji}</span>
          <div>
            <div style={{fontWeight:600,fontSize:13,color:'var(--cream)'}}>{subject.name}</div>
            <div style={{fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',letterSpacing:1}}>{done}/{tot} REVISÕES</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {tot>0&&<div style={{width:60}}><div className="progress-bar"><div className="progress-fill" style={{width:`${tot?(done/tot)*100:0}%`,background:subject.color}}/></div></div>}
          <span style={{color:'var(--text-muted)',fontSize:11}}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open&&(
        <div style={{marginTop:12}}>
          {data.tasks.map(t=>(
            <div key={t.id} className={`checkbox-item ${t.done?'done':''}`}>
              <input type="checkbox" checked={t.done} id={`${subject.id}-${t.id}`} onChange={()=>onToggleTask(subject.id,t.id)}/>
              <label htmlFor={`${subject.id}-${t.id}`}>{t.text}</label>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <input className="input" value={inp} onChange={e=>setInp(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleAdd()} placeholder="ADICIONAR REVISÃO..." style={{fontSize:11}}/>
            <button className="btn btn-outline" onClick={handleAdd}><Plus size={12}/></button>
          </div>
          {subject.id==='concurso'&&(
            <a href="https://www.grancursosonline.com.br/identificacao" target="_blank" rel="noopener"
              className="btn btn-cyan" style={{fontSize:10,marginTop:10,display:'inline-flex'}}>
              <ExternalLink size={11}/> GRAN CONCURSOS
            </a>
          )}
        </div>
      )}
    </div>
  )
}

const DEFAULT_SUBJECTS = [
  {id:'calculo',     name:'Cálculo I',                  emoji:'📐', color:'#5BA8FF'},
  {id:'estruturas',  name:'Estrutura de Dados',         emoji:'🌲', color:'#00FFC8'},
  {id:'arquitetura', name:'Arquitetura de Computadores',emoji:'⚙️', color:'#C9A84C'},
  {id:'bd',          name:'Banco de Dados',             emoji:'🗄️', color:'#C084FC'},
  {id:'so',          name:'Sistemas Operacionais',      emoji:'🐧', color:'#FF4C6A'},
  {id:'concurso',    name:'Concurso Público',           emoji:'📋', color:'#E3B341'},
]

const DEFAULT_DATA = Object.fromEntries(DEFAULT_SUBJECTS.map(s => [s.id, {
  tasks: s.id==='concurso'
    ? [{id:1,text:'Direito Administrativo — módulo 3',done:false},{id:2,text:'Simulado Conhecimentos Gerais',done:false},{id:3,text:'Português — Concordância verbal',done:true}]
    : s.id==='estruturas'
    ? [{id:1,text:'Árvores AVL — implementação',done:true},{id:2,text:'Grafos — BFS e DFS',done:false},{id:3,text:'Hashing e tabelas hash',done:false}]
    : []
}]))

export default function Study({ uid = 'local', onPomodoroComplete, totalSessions, pomodoroLog }) {
  // Modo foco total
  const [focusMode, setFocusMode] = useState(false)
  const [focusSubject, setFocusSubject] = useState('calculo')

  // Pomodoro
  const [mode,     setMode]     = useState('work')
  const [timeLeft, setTimeLeft] = useState(25*60)
  const [running,  setRunning]  = useState(false)
  const [cycles,   setCycles]   = useState(0)
  const iRef = useRef(null)
  const DURATIONS = {work:25*60, break:5*60}

  // Dados persistidos
  const [data,      setData]      = useLocalStorage(`${uid}_study_data`,  DEFAULT_DATA)
  const [notes,     setNotes]     = useLocalStorage(`${uid}_study_notes`, {})
  const [activeNote,setNote]      = useState('calculo')

  const { sendNotification } = useNotifications()

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(()=>{
        setTimeLeft(t=>{
          if (t<=1) {
            clearInterval(iRef.current); setRunning(false)
            if (mode==='work') {
              setCycles(c=>c+1)
              onPomodoroComplete&&onPomodoroComplete()
              sendNotification('✅ Sessão concluída!','Você completou uma sessão de foco. Hora de uma pausa merecida!')
            } else {
              sendNotification('🧠 Pausa encerrada!','Hora de voltar ao foco. Você consegue!')
            }
            const next = mode==='work'?'break':'work'
            setMode(next); return DURATIONS[next]
          }
          return t-1
        })
      },1000)
    } else clearInterval(iRef.current)
    return ()=>clearInterval(iRef.current)
  },[running,mode])

  const reset      = ()=>{ setRunning(false); setTimeLeft(DURATIONS[mode]) }
  const switchMode = m =>{ setRunning(false); setMode(m); setTimeLeft(DURATIONS[m]) }

  const mm   = String(Math.floor(timeLeft/60)).padStart(2,'0')
  const ss   = String(timeLeft%60).padStart(2,'0')
  const prog = ((DURATIONS[mode]-timeLeft)/DURATIONS[mode])*100
  const r    = 68; const circ = 2*Math.PI*r

  const toggleTask = (sid,tid) => setData(d=>({...d,[sid]:{...d[sid],tasks:d[sid].tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}}))
  const addTask    = (sid,text)=> setData(d=>({...d,[sid]:{...d[sid],tasks:[...d[sid].tasks,{id:Date.now(),text,done:false}]}}))

  const totalDone  = Object.values(data).reduce((a,d)=>a+d.tasks.filter(t=>t.done).length,0)
  const totalTasks = Object.values(data).reduce((a,d)=>a+d.tasks.length,0)

  const activeSubjectData = data[focusSubject] || {tasks:[]}
  const activeSubjectObj  = DEFAULT_SUBJECTS.find(s=>s.id===focusSubject)

  // ── MODO FOCO TOTAL ──────────────────────────────────────────────────
  if (focusMode) {
    return (
      <div style={{position:'fixed',inset:0,background:'var(--bg-deep)',zIndex:200,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
        <button className="btn btn-outline" style={{position:'absolute',top:20,right:20,fontSize:11}} onClick={()=>setFocusMode(false)}>
          <Minimize2 size={13}/> SAIR DO FOCO
        </button>
        <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:3,color:'var(--cyan-dim)',marginBottom:8}}>// MODO FOCO TOTAL</div>
        <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--gold)',letterSpacing:3,marginBottom:32}}>
          {activeSubjectObj?.emoji} {activeSubjectObj?.name.toUpperCase()}
        </div>

        {/* Timer grande */}
        <div style={{position:'relative',width:200,height:200,marginBottom:32}}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{transform:'rotate(-90deg)'}}>
            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--bg-hover)" strokeWidth="8"/>
            <circle cx="100" cy="100" r="88" fill="none"
              stroke={mode==='work'?'var(--gold)':'var(--cyan)'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2*Math.PI*88}
              strokeDashoffset={2*Math.PI*88*(1-prog/100)}
              style={{transition:'stroke-dashoffset 1s linear',filter:`drop-shadow(0 0 10px ${mode==='work'?'var(--gold)':'var(--cyan)'})`}}/>
          </svg>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontFamily:'var(--font-title)',fontSize:48,color:'var(--cream)',letterSpacing:4,lineHeight:1}}>{mm}:{ss}</div>
            <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:3,marginTop:6}}>{mode==='work'?'FOCO':'PAUSA'}</div>
          </div>
        </div>

        <div style={{display:'flex',gap:12,marginBottom:40}}>
          <button className="btn btn-outline" onClick={reset}><RotateCcw size={14}/></button>
          <button className="btn btn-gold" style={{minWidth:140,fontSize:13}} onClick={()=>setRunning(r=>!r)}>
            {running?<><Pause size={14}/> PAUSAR</>:<><Play size={14}/> {timeLeft===DURATIONS[mode]?'INICIAR':'CONTINUAR'}</>}
          </button>
        </div>

        {/* Tarefas da matéria ativa */}
        <div style={{width:'100%',maxWidth:480,background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:20}}>
          <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:2,color:'var(--cyan-dim)',marginBottom:12}}>// TAREFAS DA SESSÃO</div>
          {activeSubjectData.tasks.slice(0,5).map(t=>(
            <div key={t.id} className={`checkbox-item ${t.done?'done':''}`}>
              <input type="checkbox" checked={t.done} id={`focus-${t.id}`} onChange={()=>toggleTask(focusSubject,t.id)}/>
              <label htmlFor={`focus-${t.id}`}>{t.text}</label>
            </div>
          ))}
          {activeSubjectData.tasks.length===0&&(
            <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',textAlign:'center',padding:'12px 0',letterSpacing:1}}>
              NENHUMA TAREFA — ADICIONE NA TELA DE ESTUDOS
            </div>
          )}
        </div>

        <div style={{marginTop:24,fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:2}}>
          {cycles} CICLOS · {totalSessions} TOTAL
        </div>
      </div>
    )
  }

  // ── TELA NORMAL ──────────────────────────────────────────────────────
  return (
    <div>
      <div className="grid-3" style={{marginBottom:20}}>
        {[
          {val:totalSessions,        label:'SESSÕES POMODORO', color:'var(--gold)'},
          {val:totalDone,            label:'REVISÕES FEITAS',  color:'var(--cyan)'},
          {val:totalTasks-totalDone, label:'PENDENTES',        color:'var(--text-secondary)'},
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
          <div className="card" style={{marginBottom:16}}>
            <div className="card-corner tl"/><div className="card-corner br"/>
            <div className="card-label">
              // POMODORO TIMER
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className="card-label-right">{cycles} CICLOS</span>
                <button className="btn btn-outline" style={{fontSize:10,padding:'3px 8px'}} onClick={()=>setFocusMode(true)}>
                  <Maximize2 size={11}/> FOCO TOTAL
                </button>
              </div>
            </div>

            {/* Seletor de matéria para o modo foco */}
            <div style={{marginBottom:12}}>
              <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:2,color:'var(--cyan-dim)',marginBottom:6}}>MATÉRIA ATIVA</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {DEFAULT_SUBJECTS.map(s=>(
                  <button key={s.id} onClick={()=>setFocusSubject(s.id)}
                    style={{fontSize:10,padding:'3px 8px',borderRadius:4,border:`1px solid ${focusSubject===s.id?s.color:'var(--border-subtle)'}`,background:focusSubject===s.id?`${s.color}22`:'transparent',color:focusSubject===s.id?s.color:'var(--text-muted)',cursor:'pointer'}}>
                    {s.emoji} {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:16,justifyContent:'center'}}>
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
                  style={{transition:'stroke-dashoffset 1s linear',filter:`drop-shadow(0 0 6px ${mode==='work'?'var(--gold)':'var(--cyan)'})`}}/>
                <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth="1"/>
              </svg>
              <div className="pomodoro-time">
                <div className="pomodoro-digits">{mm}:{ss}</div>
                <div className="pomodoro-label">{mode==='work'?'FOCO':'PAUSA'}</div>
              </div>
            </div>

            <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:20}}>
              <button className="btn btn-outline" onClick={reset}><RotateCcw size={13}/></button>
              <button className="btn btn-gold" style={{minWidth:110}} onClick={()=>setRunning(r=>!r)}>
                {running?<><Pause size={13}/> PAUSAR</>:<><Play size={13}/> {timeLeft===DURATIONS[mode]?'INICIAR':'CONTINUAR'}</>}
              </button>
            </div>
          </div>

          {/* Matérias */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {DEFAULT_SUBJECTS.map(s=>(
              <SubjectCard key={s.id} subject={s} data={data[s.id]||{tasks:[]}} onToggleTask={toggleTask} onAddTask={addTask}/>
            ))}
          </div>
        </div>

        {/* Anotações */}
        <div className="card" style={{display:'flex',flexDirection:'column'}}>
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// ANOTAÇÕES POR MATÉRIA</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:14}}>
            {DEFAULT_SUBJECTS.map(s=>(
              <button key={s.id} className={`btn ${activeNote===s.id?'btn-gold':'btn-outline'}`}
                style={{fontSize:10,padding:'4px 8px'}} onClick={()=>setNote(s.id)}>
                {s.emoji} {s.name.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
          <textarea
            className="textarea"
            style={{flex:1,minHeight:400,background:'var(--bg-deep)',fontFamily:'var(--font-hud)',fontSize:12,lineHeight:1.8,letterSpacing:0.5}}
            placeholder={`// ANOTAÇÕES · ${DEFAULT_SUBJECTS.find(s=>s.id===activeNote)?.name.toUpperCase()}\n\n> tópico\n- ponto importante\n- outro ponto`}
            value={notes[activeNote]||''}
            onChange={e=>setNotes(n=>({...n,[activeNote]:e.target.value}))}
          />
          <div style={{fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',marginTop:8,letterSpacing:1}}>
            {(notes[activeNote]||'').length} CHARS · SALVO LOCALMENTE
          </div>
        </div>
      </div>
    </div>
  )
}
