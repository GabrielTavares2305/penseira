import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Play, Pause, RotateCcw, X, Check, Dumbbell, Footprints, Clock, Edit2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DIAS = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
const DIAS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

function CardCorners() {
  return (<><div className="card-corner tl"/><div className="card-corner br"/></>)
}

// ── TIMER POR APARELHO (cronômetro + regressivo) ──────────────────────────
function AparelhoTimer() {
  const [mode, setMode]       = useState('cron') // cron | regressivo
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [target, setTarget]   = useState(60) // segundos para regressivo
  const iRef = useRef(null)

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => {
        setSeconds(s => {
          if (mode === 'regressivo' && s <= 1) {
            setRunning(false)
            clearInterval(iRef.current)
            // Notificação sonora simples via beep visual
            return 0
          }
          return mode === 'cron' ? s + 1 : s - 1
        })
      }, 1000)
    } else clearInterval(iRef.current)
    return () => clearInterval(iRef.current)
  }, [running, mode])

  const reset = () => { setRunning(false); setSeconds(mode === 'regressivo' ? target : 0) }
  const switchMode = (m) => { setRunning(false); setMode(m); setSeconds(m === 'regressivo' ? target : 0) }
  const setTargetTime = (t) => { setTarget(t); if (mode === 'regressivo' && !running) setSeconds(t) }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const isFinished = mode === 'regressivo' && seconds === 0 && !running

  return (
    <div className="card">
      <CardCorners />
      <div className="card-label">// TIMER POR APARELHO</div>

      <div style={{ display:'flex', gap:8, marginBottom:16, justifyContent:'center' }}>
        <button className={`btn ${mode==='cron'?'btn-gold':'btn-outline'}`} style={{fontSize:11}} onClick={()=>switchMode('cron')}>⏱️ CRONÔMETRO</button>
        <button className={`btn ${mode==='regressivo'?'btn-gold':'btn-outline'}`} style={{fontSize:11}} onClick={()=>switchMode('regressivo')}>⏳ REGRESSIVO</button>
      </div>

      {mode === 'regressivo' && (
        <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:16, flexWrap:'wrap' }}>
          {[30,45,60,90,120].map(t => (
            <button key={t} className={`btn ${target===t?'btn-cyan':'btn-outline'}`} style={{fontSize:10,padding:'5px 10px'}} onClick={()=>setTargetTime(t)}>
              {t}s
            </button>
          ))}
        </div>
      )}

      <div style={{ textAlign:'center', padding:'20px 0' }}>
        <div style={{
          fontFamily:'var(--font-title)', fontSize:48, fontWeight:700,
          color: isFinished ? 'var(--danger)' : 'var(--accent)',
          letterSpacing:2,
          textShadow: isFinished ? '0 0 20px var(--danger)' : 'none',
          animation: isFinished ? 'pulse 1s infinite' : 'none',
        }}>
          {mm}:{ss}
        </div>
        {isFinished && <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--danger)',letterSpacing:2,marginTop:8}}>⏰ TEMPO ESGOTADO!</div>}
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        <button className="btn btn-outline" onClick={reset}><RotateCcw size={14}/></button>
        <button className="btn btn-gold" style={{minWidth:120}} onClick={()=>setRunning(r=>!r)}>
          {running ? <><Pause size={14}/> PAUSAR</> : <><Play size={14}/> INICIAR</>}
        </button>
      </div>
    </div>
  )
}

// ── TIMER TOTAL DE ACADEMIA (sessão completa) ─────────────────────────────
function SessaoTimer({ onFinish }) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const iRef = useRef(null)

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => setSeconds(s => s+1), 1000)
    } else clearInterval(iRef.current)
    return () => clearInterval(iRef.current)
  }, [running])

  const hh = String(Math.floor(seconds/3600)).padStart(2,'0')
  const mm = String(Math.floor((seconds%3600)/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  const finish = () => {
    setRunning(false)
    if (seconds > 0) onFinish(seconds)
    setSeconds(0)
  }

  return (
    <div className="card" style={{ borderColor: running ? 'var(--accent-border)' : undefined }}>
      <CardCorners />
      <div className="card-label">// TEMPO TOTAL NA ACADEMIA {running && <span className="pulse-dot" style={{marginLeft:6}}/>}</div>
      <div style={{ textAlign:'center', padding:'12px 0' }}>
        <div style={{ fontFamily:'var(--font-hud)', fontSize:36, fontWeight:700, color:'var(--cyan)', letterSpacing:2 }}>
          {hh}:{mm}:{ss}
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        {!running && seconds === 0 && (
          <button className="btn btn-gold" onClick={()=>setRunning(true)}><Play size={14}/> CHEGUEI NA ACADEMIA</button>
        )}
        {running && (
          <button className="btn btn-outline" onClick={()=>setRunning(false)}><Pause size={14}/> PAUSAR</button>
        )}
        {!running && seconds > 0 && (
          <>
            <button className="btn btn-outline" onClick={()=>setRunning(true)}><Play size={14}/> CONTINUAR</button>
            <button className="btn btn-gold" onClick={finish}><Check size={14}/> FINALIZAR TREINO</button>
          </>
        )}
      </div>
    </div>
  )
}

// ── MODAL DE EXERCÍCIO ─────────────────────────────────────────────────────
function ExercicioModal({ exercicio, onClose, onSave }) {
  const [nome,  setNome]  = useState(exercicio?.nome || '')
  const [series,setSeries]= useState(exercicio?.series?.length ? exercicio.series : [{reps:'',carga:''}])

  const addSerie = () => setSeries(s => [...s, {reps:'',carga:''}])
  const removeSerie = (i) => setSeries(s => s.filter((_,idx)=>idx!==i))
  const updateSerie = (i, field, val) => setSeries(s => s.map((serie,idx)=>idx===i?{...serie,[field]:val}:serie))

  const handleSave = () => {
    if (!nome.trim()) return
    onSave({ id: exercicio?.id || Date.now(), nome: nome.trim(), series: series.filter(s=>s.reps||s.carga), done: exercicio?.done || false })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px 12px 0 0', padding:24, width:'100%', maxWidth:500, maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ fontFamily:'var(--font-hud)', fontSize:11, letterSpacing:2, color:'var(--accent)' }}>{exercicio?'EDITAR EXERCÍCIO':'NOVO EXERCÍCIO'}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={16}/></button>
        </div>

        <div className="form-group">
          <label className="form-label">NOME DO EXERCÍCIO</label>
          <input className="input" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: Supino reto, Leg press..." autoFocus/>
        </div>

        <label className="form-label">SÉRIES</label>
        {series.map((s, i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
            <span style={{ fontFamily:'var(--font-hud)', fontSize:11, color:'var(--text-muted)', width:20 }}>{i+1}ª</span>
            <input className="input" style={{flex:1}} type="number" placeholder="Reps" value={s.reps} onChange={e=>updateSerie(i,'reps',e.target.value)}/>
            <span style={{color:'var(--text-muted)',fontSize:11}}>×</span>
            <input className="input" style={{flex:1}} type="number" placeholder="Carga (kg)" value={s.carga} onChange={e=>updateSerie(i,'carga',e.target.value)}/>
            <button onClick={()=>removeSerie(i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--danger)',flexShrink:0}}><X size={14}/></button>
          </div>
        ))}
        <button className="btn btn-outline" style={{fontSize:11, marginTop:4, marginBottom:16}} onClick={addSerie}><Plus size={12}/> ADICIONAR SÉRIE</button>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline">CANCELAR</button>
          <button onClick={handleSave} className="btn btn-gold"><Check size={13}/> SALVAR</button>
        </div>
      </div>
    </div>
  )
}

// ── ABA TREINO POR DIA DA SEMANA ──────────────────────────────────────────
function TreinoTab({ uid }) {
  const [treinos, setTreinos] = useLocalStorage(`${uid}_treinos`, Object.fromEntries(DIAS.map(d=>[d,{nome:'',exercicios:[]}])))
  const [diaAtivo, setDiaAtivo] = useState(DIAS[new Date().getDay()])
  const [modal, setModal] = useState(null) // null | 'new' | exercicio
  const [sessionLog, setSessionLog] = useLocalStorage(`${uid}_sessoes_academia`, [])

  const treino = treinos[diaAtivo] || { nome:'', exercicios:[] }

  const updateNomeTreino = (nome) => setTreinos(t => ({...t, [diaAtivo]: {...t[diaAtivo], nome}}))

  const saveExercicio = (ex) => {
    setTreinos(t => {
      const exs = t[diaAtivo].exercicios
      const exists = exs.find(e=>e.id===ex.id)
      const newExs = exists ? exs.map(e=>e.id===ex.id?ex:e) : [...exs, ex]
      return {...t, [diaAtivo]: {...t[diaAtivo], exercicios:newExs}}
    })
    setModal(null)
  }

  const deleteExercicio = (id) => {
    setTreinos(t => ({...t, [diaAtivo]: {...t[diaAtivo], exercicios:t[diaAtivo].exercicios.filter(e=>e.id!==id)}}))
  }

  const toggleDone = (id) => {
    setTreinos(t => ({...t, [diaAtivo]: {...t[diaAtivo], exercicios:t[diaAtivo].exercicios.map(e=>e.id===id?{...e,done:!e.done}:e)}}))
  }

  const onSessionFinish = (seconds) => {
    setSessionLog(log => [...log, { date: new Date().toISOString().slice(0,10), dia: diaAtivo, seconds, exerciciosFeitos: treino.exercicios.filter(e=>e.done).length }])
    // Reset dos checkmarks para o próximo treino
    setTreinos(t => ({...t, [diaAtivo]: {...t[diaAtivo], exercicios:t[diaAtivo].exercicios.map(e=>({...e,done:false}))}}))
  }

  const totalSemana = Object.values(treinos).reduce((a,t)=>a+t.exercicios.length,0)
  const doneCount = treino.exercicios.filter(e=>e.done).length

  // Estatísticas
  const totalSessoes = sessionLog.length
  const tempoTotalSegundos = sessionLog.reduce((a,s)=>a+s.seconds,0)
  const horasTotais = Math.floor(tempoTotalSegundos/3600)
  const minutosTotais = Math.floor((tempoTotalSegundos%3600)/60)

  return (
    <div>
      {/* Stats */}
      <div className="grid-3" style={{ marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-value">{totalSessoes}</div>
          <div className="stat-label">TREINOS FEITOS</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color:'var(--cyan)'}}>{horasTotais}h{minutosTotais}m</div>
          <div className="stat-label">TEMPO TOTAL</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalSemana}</div>
          <div className="stat-label">EXERCÍCIOS NA SEMANA</div>
        </div>
      </div>

      {/* Seletor de dia */}
      <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {DIAS.map((d,i) => {
          const hasContent = treinos[d]?.exercicios?.length > 0
          return (
            <button key={d}
              className={`btn ${diaAtivo===d?'btn-gold':'btn-outline'}`}
              style={{ fontSize:11, flexShrink:0, position:'relative' }}
              onClick={()=>setDiaAtivo(d)}>
              {d}
              {hasContent && <span style={{position:'absolute',top:-3,right:-3,width:6,height:6,borderRadius:'50%',background:diaAtivo===d?'var(--accent-text)':'var(--accent)'}}/>}
            </button>
          )
        })}
      </div>

      <div className="grid-2">
        {/* Lista de exercícios */}
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <CardCorners />
            <div className="card-label">
              // TREINO DE {DIAS_FULL[DIAS.indexOf(diaAtivo)].toUpperCase()}
              <span className="card-label-right">{doneCount}/{treino.exercicios.length}</span>
            </div>
            <input
              className="input"
              style={{ marginBottom:14, fontFamily:'var(--font-title)', fontSize:14 }}
              placeholder="Nome do treino (ex: Peito e Tríceps)"
              value={treino.nome}
              onChange={e=>updateNomeTreino(e.target.value)}
            />

            {treino.exercicios.length === 0 ? (
              <div className="empty-state" style={{ padding:'24px 0' }}>
                <div className="empty-icon"><Dumbbell size={32} opacity={0.3}/></div>
                <div className="empty-title">Nenhum exercício</div>
                <div className="empty-desc">ADICIONE O PRIMEIRO EXERCÍCIO</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {treino.exercicios.map(ex => (
                  <div key={ex.id} style={{
                    display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px',
                    background:'var(--bg-hover)', borderRadius:6, border:'1px solid var(--border-subtle)',
                  }}>
                    <input type="checkbox" checked={ex.done} onChange={()=>toggleDone(ex.id)} style={{marginTop:3,accentColor:'var(--accent)'}}/>
                    <div style={{flex:1}}>
                      <div style={{ fontSize:13, fontWeight:600, color: ex.done?'var(--text-muted)':'var(--text-primary)', textDecoration: ex.done?'line-through':'none' }}>
                        {ex.nome}
                      </div>
                      {ex.series?.length > 0 && (
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:4 }}>
                          {ex.series.map((s,i)=>(
                            <span key={i} className="tag">{s.reps||'-'}x{s.carga?`${s.carga}kg`:'-'}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                      <button onClick={()=>setModal(ex)} className="btn-ghost" style={{padding:4}}><Edit2 size={13}/></button>
                      <button onClick={()=>deleteExercicio(ex.id)} className="btn-ghost" style={{padding:4,color:'var(--danger)'}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-gold" style={{ marginTop:14, width:'100%', justifyContent:'center' }} onClick={()=>setModal('new')}>
              <Plus size={13}/> ADICIONAR EXERCÍCIO
            </button>
          </div>
        </div>

        {/* Timers */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <SessaoTimer onFinish={onSessionFinish} />
          <AparelhoTimer />
        </div>
      </div>

      {modal && (
        <ExercicioModal
          exercicio={modal==='new'?null:modal}
          onClose={()=>setModal(null)}
          onSave={saveExercicio}
        />
      )}
    </div>
  )
}

// ── ABA CARDIO (CAMINHADA / PEDALADA) ─────────────────────────────────────
function CardioTab({ uid }) {
  const [registros, setRegistros] = useLocalStorage(`${uid}_cardio`, [])
  const [tipo,    setTipo]    = useState('caminhada')
  const [distancia,setDistancia] = useState('')
  const [tempo,   setTempo]   = useState('')
  const [data,    setData]    = useState(new Date().toISOString().slice(0,10))

  // Timer ao vivo para cardio
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const iRef = useRef(null)

  useEffect(() => {
    if (running) iRef.current = setInterval(()=>setSeconds(s=>s+1), 1000)
    else clearInterval(iRef.current)
    return () => clearInterval(iRef.current)
  }, [running])

  const addRegistro = () => {
    if (!distancia && !tempo) return
    setRegistros(r => [{
      id: Date.now(), tipo, distancia: parseFloat(distancia)||0,
      tempo: tempo || Math.round(seconds/60), data,
    }, ...r])
    setDistancia(''); setTempo(''); setSeconds(0); setRunning(false)
  }

  const useTimerAsTime = () => setTempo(String(Math.round(seconds/60)))

  const delRegistro = (id) => setRegistros(r => r.filter(x=>x.id!==id))

  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  const totalKm = registros.reduce((a,r)=>a+r.distancia,0)
  const totalMin = registros.reduce((a,r)=>a+Number(r.tempo||0),0)

  return (
    <div>
      <div className="grid-3" style={{ marginBottom:20 }}>
        <div className="stat-card">
          <div className="stat-value">{registros.length}</div>
          <div className="stat-label">ATIVIDADES</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color:'var(--cyan)'}}>{totalKm.toFixed(1)}km</div>
          <div className="stat-label">DISTÂNCIA TOTAL</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.floor(totalMin/60)}h{totalMin%60}m</div>
          <div className="stat-label">TEMPO TOTAL</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Timer + form */}
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <CardCorners />
            <div className="card-label">// CRONÔMETRO DA ATIVIDADE</div>
            <div style={{ textAlign:'center', padding:'16px 0' }}>
              <div style={{ fontFamily:'var(--font-hud)', fontSize:36, color:'var(--cyan)', fontWeight:700 }}>{mm}:{ss}</div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:8 }}>
              <button className="btn btn-outline" onClick={()=>{setRunning(false);setSeconds(0)}}><RotateCcw size={13}/></button>
              <button className="btn btn-gold" onClick={()=>setRunning(r=>!r)}>
                {running ? <><Pause size={13}/> PAUSAR</> : <><Play size={13}/> INICIAR</>}
              </button>
            </div>
            {seconds > 0 && (
              <button className="btn btn-cyan" style={{width:'100%',justifyContent:'center',fontSize:11}} onClick={useTimerAsTime}>
                <Clock size={12}/> USAR {mm}min COMO TEMPO ABAIXO
              </button>
            )}
          </div>

          <div className="card">
            <CardCorners />
            <div className="card-label">// REGISTRAR ATIVIDADE</div>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              <button className={`btn ${tipo==='caminhada'?'btn-gold':'btn-outline'}`} style={{flex:1,fontSize:11}} onClick={()=>setTipo('caminhada')}>
                <Footprints size={12}/> CAMINHADA
              </button>
              <button className={`btn ${tipo==='pedalada'?'btn-gold':'btn-outline'}`} style={{flex:1,fontSize:11}} onClick={()=>setTipo('pedalada')}>
                🚴 PEDALADA
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">DISTÂNCIA (KM)</label>
              <input className="input" type="number" step="0.1" placeholder="Ex: 5.2" value={distancia} onChange={e=>setDistancia(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">TEMPO (MINUTOS)</label>
              <input className="input" type="number" placeholder="Ex: 30" value={tempo} onChange={e=>setTempo(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">DATA</label>
              <input className="input" type="date" value={data} onChange={e=>setData(e.target.value)}/>
            </div>
            <button className="btn btn-gold" style={{width:'100%',justifyContent:'center'}} onClick={addRegistro}>
              <Plus size={13}/> SALVAR ATIVIDADE
            </button>
          </div>
        </div>

        {/* Histórico */}
        <div className="card">
          <CardCorners />
          <div className="card-label">// HISTÓRICO <span className="card-label-right">{registros.length} registros</span></div>
          {registros.length === 0 ? (
            <div className="empty-state" style={{ padding:'32px 0' }}>
              <div className="empty-icon"><Footprints size={32} opacity={0.3}/></div>
              <div className="empty-title">Nenhuma atividade ainda</div>
              <div className="empty-desc">REGISTRE SUA PRIMEIRA CAMINHADA OU PEDALADA</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:2, maxHeight:480, overflowY:'auto' }}>
              {registros.map(r => (
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderBottom:'1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{r.tipo==='caminhada'?'🚶':'🚴'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'var(--text-primary)', fontWeight:500 }}>
                      {r.distancia>0 ? `${r.distancia}km` : ''} {r.tempo ? `· ${r.tempo}min` : ''}
                    </div>
                    <div style={{ fontFamily:'var(--font-hud)', fontSize:10, color:'var(--text-muted)', letterSpacing:1 }}>
                      {new Date(r.data+'T12:00:00').toLocaleDateString('pt-BR')} · {r.tipo.toUpperCase()}
                    </div>
                  </div>
                  <button onClick={()=>delRegistro(r.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', flexShrink:0 }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Academia({ uid }) {
  const [tab, setTab] = useState('treino')

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab==='treino'?'active':''}`} onClick={()=>setTab('treino')}>
          <Dumbbell size={12} style={{display:'inline',marginRight:6,verticalAlign:'middle'}}/> TREINO
        </div>
        <div className={`tab ${tab==='cardio'?'active':''}`} onClick={()=>setTab('cardio')}>
          <Footprints size={12} style={{display:'inline',marginRight:6,verticalAlign:'middle'}}/> CAMINHADA / PEDALADA
        </div>
      </div>

      {tab === 'treino' && <TreinoTab uid={uid} />}
      {tab === 'cardio' && <CardioTab uid={uid} />}
    </div>
  )
}
