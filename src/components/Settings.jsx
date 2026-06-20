import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Check, Plus, X, Save, LogOut } from 'lucide-react'

const SUGGESTED_BY_AREA = {
  ti:           [{id:'calculo',name:'Cálculo I',emoji:'📐',color:'#5BA8FF'},{id:'estruturas',name:'Estrutura de Dados',emoji:'🌲',color:'#00FFC8'},{id:'bd',name:'Banco de Dados',emoji:'🗄️',color:'#C084FC'},{id:'so',name:'Sistemas Operacionais',emoji:'🐧',color:'#FF4C6A'},{id:'concurso',name:'Concurso Público',emoji:'📋',color:'#E3B341'}],
  publicidade:  [{id:'redacao',name:'Redação Publicitária',emoji:'✍️',color:'#C4553A'},{id:'design',name:'Design Gráfico',emoji:'🎨',color:'#C4553A'},{id:'marketing',name:'Marketing Digital',emoji:'📱',color:'#6B4F8A'},{id:'concurso',name:'Concurso Público',emoji:'📋',color:'#E3B341'}],
  outro:        [{id:'concurso',name:'Concurso Público',emoji:'📋',color:'#E3B341'}],
}

const THEMES = [
  { id:'stark-gold', name:'Stark Gold', desc:'Escuro · Futurista · HUD', accent:'#C9A84C', bg:'#060810' },
  { id:'studio',     name:'Studio',     desc:'Claro · Editorial · Pro',   accent:'#C4553A', bg:'#FAFAF8' },
  { id:'nebula',     name:'Nebula',     desc:'Escuro · Roxo · Criativo',  accent:'#C084FC', bg:'#0A0612' },
  { id:'arctic',     name:'Arctic',     desc:'Claro · Azul · Minimalista',accent:'#2563EB', bg:'#F0F4F8' },
  { id:'glass',      name:'Glass',      desc:'Glassmorphism · Moderno',   accent:'#1A1A2E', bg:'#C8CDD6' },
]

const OPTIONAL_FEATURES = [
  { id:'moodboard',    label:'Moodboard',             desc:'Painéis de referências visuais',     emoji:'🎨' },
  { id:'financas',     label:'Controle de Gastos',    desc:'Carteira, cartão e extrato',         emoji:'💰' },
  { id:'notificacoes', label:'Lembretes de Estudo',   desc:'Notificações de estudo no navegador',emoji:'🔔' },
  { id:'academia',     label:'Academia',              desc:'Treinos, timers e cardio',           emoji:'🏋️' },
]

const COLORS = ['#C9A84C','#00FFC8','#5BA8FF','#C4553A','#9B7FC0','#FF4C6A','#E3B341','#3FB950']

export default function Settings({ user, profile, onProfileUpdate, logout }) {
  const accentColor = profile?.theme==='studio'?'#C4553A':profile?.theme==='arctic'?'#2563EB':profile?.theme==='nebula'?'#C084FC':'#C9A84C'

  const [tab,       setTab]       = useState('perfil')
  const [name,      setName]      = useState(profile?.name      || '')
  const [course,    setCourse]    = useState(profile?.course     || '')
  const [subjects,  setSubjects]  = useState(profile?.subjects   || [])
  const [theme,     setTheme]     = useState(profile?.theme      || 'stark-gold')
  const [features,  setFeatures]  = useState(profile?.features   || [])
  const [newSub,    setNewSub]    = useState('')
  const [newEmoji,  setNewEmoji]  = useState('📚')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const toggleSubject = (sub) => setSubjects(s => s.find(x=>x.id===sub.id) ? s.filter(x=>x.id!==sub.id) : [...s,sub])
  const toggleFeature = (id)  => setFeatures(f => f.includes(id) ? f.filter(x=>x!==id) : [...f,id])

  const addCustomSubject = () => {
    if (!newSub.trim()) return
    const color = COLORS[subjects.length % COLORS.length]
    setSubjects(s => [...s, {id:`custom_${Date.now()}`,name:newSub.trim(),emoji:newEmoji,color}])
    setNewSub(''); setNewEmoji('📚')
  }

  const save = async () => {
    setSaving(true)
    try {
      const ref = doc(db,'users',user.uid)
      const data = { name, course, subjects, theme, features }
      await updateDoc(ref, data)
      onProfileUpdate(data)
      setSaved(true)
      setTimeout(()=>setSaved(false), 2000)
    } catch(e){ console.error(e) }
    setSaving(false)
  }

  const suggested = SUGGESTED_BY_AREA[profile?.area] || SUGGESTED_BY_AREA.outro

  return (
    <div>
      <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:3,color:'var(--cyan-dim)',marginBottom:4}}>// CONFIGURAÇÕES</div>
      <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--cream)',marginBottom:20}}>Personalize sua Penseira</div>

      {/* Tabs */}
      <div className="tabs" style={{marginBottom:24}}>
        {[['perfil','👤 Perfil'],['materias','📚 Matérias'],['tema','🎨 Tema'],['funcoes','⚙️ Funções']].map(([id,label])=>(
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {/* PERFIL */}
      {tab==='perfil' && (
        <div className="card">
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// INFORMAÇÕES PESSOAIS</div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,padding:16,background:'var(--bg-hover)',borderRadius:8}}>
            <div style={{width:52,height:52,borderRadius:'50%',background:`${accentColor}20`,border:`2px solid ${accentColor}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
              {profile?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{fontFamily:'var(--font-title)',fontSize:16,color:'var(--cream)'}}>{profile?.name}</div>
              <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1,marginTop:2}}>{user?.email}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">NOME</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome"/>
          </div>
          <div className="form-group">
            <label className="form-label">CURSO</label>
            <input className="input" value={course} onChange={e=>setCourse(e.target.value)} placeholder="Seu curso"/>
          </div>
          <div style={{marginTop:8,padding:12,background:'var(--bg-hover)',borderRadius:6,fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1}}>
            EMAIL: <span style={{color:'var(--text-secondary)'}}>{user?.email}</span> · Não é possível alterar o email aqui.
          </div>
        </div>
      )}

      {/* MATÉRIAS */}
      {tab==='materias' && (
        <div className="card">
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// SUAS MATÉRIAS <span className="card-label-right">{subjects.length} ATIVAS</span></div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
            {subjects.map(sub=>(
              <div key={sub.id} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:20,background:`${sub.color}18`,border:`1px solid ${sub.color}40`,color:sub.color,fontSize:12}}>
                {sub.emoji} {sub.name}
                <button onClick={()=>toggleSubject(sub)} style={{background:'none',border:'none',cursor:'pointer',color:sub.color,padding:0,display:'flex'}}><X size={12}/></button>
              </div>
            ))}
          </div>
          {subjects.length===0 && <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-muted)',marginBottom:16,letterSpacing:1}}>NENHUMA MATÉRIA ADICIONADA</div>}

          <div className="card-label" style={{marginBottom:10}}>SUGESTÕES</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
            {suggested.filter(s=>!subjects.find(x=>x.id===s.id)).map(sub=>(
              <button key={sub.id} onClick={()=>toggleSubject(sub)} style={{padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer',background:'var(--bg-hover)',border:'1px solid var(--border-subtle)',color:'var(--text-secondary)'}}>
                + {sub.emoji} {sub.name}
              </button>
            ))}
          </div>

          <div className="card-label" style={{marginBottom:8}}>ADICIONAR PERSONALIZADA</div>
          <div style={{display:'flex',gap:8}}>
            <input className="input" style={{width:48,textAlign:'center'}} value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} maxLength={2}/>
            <input className="input" style={{flex:1}} value={newSub} onChange={e=>setNewSub(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomSubject()} placeholder="Nome da matéria..."/>
            <button className="btn btn-gold" onClick={addCustomSubject}><Plus size={13}/></button>
          </div>
        </div>
      )}

      {/* TEMA */}
      {tab==='tema' && (
        <div className="card">
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// TEMA VISUAL</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {THEMES.map(t=>{
              const sel = theme===t.id
              const isLight = t.id==='studio'||t.id==='arctic'
              return (
                <div key={t.id} onClick={()=>setTheme(t.id)} style={{
                  background:t.bg,border:`2px solid ${sel?t.accent:'transparent'}`,
                  borderRadius:8,padding:14,cursor:'pointer',transition:'all 0.2s',
                  boxShadow:sel?`0 0 16px ${t.accent}40`:'',position:'relative'
                }}>
                  {sel&&<div style={{position:'absolute',top:8,right:8,background:t.accent,width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={11} color={isLight?'#fff':'#060810'}/></div>}
                  <div style={{display:'flex',gap:6,marginBottom:8}}>
                    <div style={{width:12,height:12,borderRadius:'50%',background:t.accent}}/>
                    <div style={{width:12,height:12,borderRadius:'50%',background:t.accent,opacity:0.4}}/>
                  </div>
                  <div style={{fontSize:13,fontWeight:600,color:t.accent,marginBottom:2,fontFamily:isLight?'serif':'monospace'}}>{t.name}</div>
                  <div style={{fontSize:11,color:isLight?'#6B6560':'rgba(232,223,200,0.5)'}}>{t.desc}</div>
                </div>
              )
            })}
          </div>
          <div style={{marginTop:16,fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1}}>
            ⚡ A mudança de tema é aplicada imediatamente após salvar.
          </div>
        </div>
      )}

      {/* FUNÇÕES */}
      {tab==='funcoes' && (
        <div className="card">
          <div className="card-corner tl"/><div className="card-corner br"/>
          <div className="card-label">// FUNÇÕES OPCIONAIS</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {OPTIONAL_FEATURES.map(f=>{
              const active = features.includes(f.id)
              return (
                <div key={f.id} onClick={()=>toggleFeature(f.id)} style={{
                  display:'flex',alignItems:'center',gap:14,padding:14,
                  background:'var(--bg-hover)',borderRadius:8,cursor:'pointer',
                  border:`1px solid ${active?accentColor:'var(--border-subtle)'}`,
                  transition:'all 0.2s',
                }}>
                  <span style={{fontSize:24}}>{f.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14,color:active?accentColor:'var(--cream)',marginBottom:2}}>{f.label}</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)'}}>{f.desc}</div>
                  </div>
                  <div style={{width:24,height:24,borderRadius:'50%',background:active?accentColor:'var(--bg-card)',border:`1px solid ${active?accentColor:'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {active&&<Check size={13} color="#fff"/>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Botão salvar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20}}>
        <button onClick={logout} style={{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--font-hud)',fontSize:11,color:'var(--danger)',background:'none',border:'1px solid rgba(255,76,106,0.3)',borderRadius:6,padding:'8px 14px',cursor:'pointer',letterSpacing:1}}>
          <LogOut size={13}/> SAIR DA CONTA
        </button>
        <button onClick={save} disabled={saving} className="btn btn-gold">
          {saved ? <><Check size={13}/> SALVO!</> : saving ? 'SALVANDO...' : <><Save size={13}/> SALVAR ALTERAÇÕES</>}
        </button>
      </div>
    </div>
  )
}
