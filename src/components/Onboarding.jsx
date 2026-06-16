import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Check, Plus, X, Palette, BookOpen, Image, DollarSign, Bell } from 'lucide-react'

const SUGGESTED_SUBJECTS = {
  ti: [
    { id:'calculo',      name:'Cálculo I',                   emoji:'📐', color:'#5BA8FF' },
    { id:'estruturas',   name:'Estrutura de Dados',          emoji:'🌲', color:'#00FFC8' },
    { id:'arquitetura',  name:'Arquitetura de Computadores', emoji:'⚙️', color:'#C9A84C' },
    { id:'bd',           name:'Banco de Dados',              emoji:'🗄️', color:'#C084FC' },
    { id:'so',           name:'Sistemas Operacionais',       emoji:'🐧', color:'#FF4C6A' },
    { id:'redes',        name:'Redes de Computadores',       emoji:'🌐', color:'#58A6FF' },
    { id:'concurso',     name:'Concurso Público',            emoji:'📋', color:'#E3B341' },
  ],
  publicidade: [
    { id:'redacao',      name:'Redação Publicitária',        emoji:'✍️', color:'#C4553A' },
    { id:'fotografia',   name:'Fotografia',                  emoji:'📷', color:'#9B8B6E' },
    { id:'design',       name:'Design Gráfico',              emoji:'🎨', color:'#C4553A' },
    { id:'marketing',    name:'Marketing Digital',           emoji:'📱', color:'#6B4F8A' },
    { id:'psicologia',   name:'Psicologia do Consumidor',    emoji:'🧠', color:'#9B3828' },
    { id:'midia',        name:'Mídia e Planejamento',        emoji:'📺', color:'#C9A84C' },
    { id:'concurso',     name:'Concurso Público',            emoji:'📋', color:'#E3B341' },
  ],
  direito: [
    { id:'constitucional', name:'Direito Constitucional',   emoji:'⚖️', color:'#C9A84C' },
    { id:'civil',          name:'Direito Civil',            emoji:'📜', color:'#5BA8FF' },
    { id:'penal',          name:'Direito Penal',            emoji:'🔨', color:'#FF4C6A' },
    { id:'administrativo', name:'Direito Administrativo',   emoji:'🏛️', color:'#00FFC8' },
    { id:'trabalho',       name:'Direito do Trabalho',      emoji:'👷', color:'#C084FC' },
    { id:'concurso',       name:'Concurso Público',         emoji:'📋', color:'#E3B341' },
  ],
  saude: [
    { id:'anatomia',     name:'Anatomia',                   emoji:'🫀', color:'#FF4C6A' },
    { id:'fisiologia',   name:'Fisiologia',                 emoji:'🧬', color:'#00FFC8' },
    { id:'farmacologia', name:'Farmacologia',               emoji:'💊', color:'#C084FC' },
    { id:'bioquimica',   name:'Bioquímica',                 emoji:'🔬', color:'#5BA8FF' },
    { id:'clinica',      name:'Clínica Médica',             emoji:'🩺', color:'#C9A84C' },
    { id:'concurso',     name:'Concurso Público',           emoji:'📋', color:'#E3B341' },
  ],
  administracao: [
    { id:'financas',     name:'Finanças Empresariais',      emoji:'💰', color:'#C9A84C' },
    { id:'marketing',    name:'Marketing',                  emoji:'📈', color:'#C4553A' },
    { id:'rh',           name:'Gestão de Pessoas',          emoji:'👥', color:'#5BA8FF' },
    { id:'logistica',    name:'Logística',                  emoji:'📦', color:'#00FFC8' },
    { id:'contabil',     name:'Contabilidade',              emoji:'📊', color:'#C084FC' },
    { id:'concurso',     name:'Concurso Público',           emoji:'📋', color:'#E3B341' },
  ],
  outro: [
    { id:'materia1', name:'Matéria 1', emoji:'📚', color:'#C9A84C' },
    { id:'concurso', name:'Concurso Público', emoji:'📋', color:'#E3B341' },
  ],
}

const AREAS = [
  { id:'ti',            label:'Tecnologia da Informação', emoji:'💻' },
  { id:'publicidade',   label:'Publicidade & Propaganda', emoji:'🎨' },
  { id:'direito',       label:'Direito',                  emoji:'⚖️' },
  { id:'saude',         label:'Saúde',                    emoji:'🏥' },
  { id:'administracao', label:'Administração',            emoji:'📊' },
  { id:'outro',         label:'Outro curso',              emoji:'📚' },
]

const THEMES = [
  { id:'stark-gold', name:'Stark Gold', desc:'Escuro · Futurista · HUD',         preview:{ bg:'#060810', accent:'#C9A84C', text:'#E8DFC8' }, recommended:['ti'] },
  { id:'studio',     name:'Studio',     desc:'Claro · Editorial · Profissional',  preview:{ bg:'#FAFAF8', accent:'#C4553A', text:'#2D2926' }, recommended:['publicidade','administracao'] },
  { id:'nebula',     name:'Nebula',     desc:'Escuro · Roxo · Criativo',          preview:{ bg:'#0A0612', accent:'#C084FC', text:'#F0E6FF' }, recommended:['publicidade','direito'] },
  { id:'arctic',     name:'Arctic',     desc:'Claro · Azul · Minimalista',        preview:{ bg:'#F0F4F8', accent:'#2563EB', text:'#1E293B' }, recommended:['saude','administracao'] },
]

const COLORS = ['#C9A84C','#00FFC8','#5BA8FF','#C4553A','#9B7FC0','#FF4C6A','#E3B341','#3FB950']

const OPTIONAL_FEATURES = [
  {
    id: 'moodboard',
    icon: Image,
    title: 'Moodboard',
    desc: 'Painel de referências visuais — cole links de imagens do Pinterest, Behance e qualquer site para criar painéis de inspiração por projeto. Ideal para organizar ideias visuais sem ocupar espaço no celular.',
    color: '#C084FC',
  },
  {
    id: 'financas',
    icon: DollarSign,
    title: 'Controle de Gastos',
    desc: 'Registre seus gastos no cartão e débito, acompanhe sua carteira e veja um extrato completo de onde seu dinheiro foi. Simples e rápido de usar.',
    color: '#3FB950',
  },
  {
    id: 'notificacoes',
    icon: Bell,
    title: 'Lembretes de Estudo',
    desc: 'Receba notificações do navegador nos horários que você definir para lembrar de estudar ou fazer revisões.',
    color: '#58A6FF',
  },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');

  .ob-root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Inter',sans-serif}
  .ob-root.dark {background:#060810;color:#E8DFC8}
  .ob-root.light{background:#FAFAF8;color:#2D2926}

  .ob-card{width:100%;max-width:580px;border-radius:12px;padding:clamp(24px,5vw,40px);position:relative}
  .ob-card.dark {background:#101422;border:1px solid rgba(201,168,76,0.2)}
  .ob-card.light{background:#fff;border:1px solid #E8E4DF;box-shadow:0 4px 24px rgba(0,0,0,0.08)}

  .ob-progress{height:3px;border-radius:2px;margin-bottom:28px;overflow:hidden}
  .ob-progress.dark {background:rgba(201,168,76,0.1)}
  .ob-progress.light{background:#F0EDE9}
  .ob-progress-fill{height:100%;border-radius:2px;transition:width 0.4s ease}

  .ob-steps{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:24px;flex-wrap:wrap}
  .ob-step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;transition:all 0.3s;flex-shrink:0}

  .ob-title{font-size:clamp(17px,4vw,23px);font-weight:700;margin-bottom:6px}
  .ob-title.dark {font-family:'Cinzel',serif;letter-spacing:2px}
  .ob-title.light{font-family:'Playfair Display',serif}
  .ob-sub{font-size:13px;margin-bottom:20px;line-height:1.6}
  .ob-sub.dark {color:rgba(168,152,128,0.8);font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:1px}
  .ob-sub.light{color:#9B8B6E}

  .ob-label{display:block;font-size:11px;font-weight:500;margin-bottom:6px;letter-spacing:0.5px}
  .ob-label.dark {color:rgba(0,255,200,0.6);font-family:'Share Tech Mono',monospace;letter-spacing:2px}
  .ob-label.light{color:#6B6560}

  .ob-input{width:100%;border-radius:6px;padding:10px 14px;font-size:13px;outline:none;transition:border-color 0.2s;margin-bottom:14px}
  .ob-input.dark {background:rgba(6,8,16,0.6);border:1px solid rgba(255,255,255,0.07);color:#E8DFC8;font-family:'Share Tech Mono',monospace}
  .ob-input.dark:focus {border-color:rgba(201,168,76,0.5)}
  .ob-input.light{background:#fff;border:1px solid #DDD8D2;color:#2D2926;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
  .ob-input.light:focus{border-color:#C4553A}

  .ob-areas{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px}
  .ob-area-btn{padding:14px 12px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px;font-size:13px;transition:all 0.2s;border:2px solid transparent;text-align:left;width:100%}
  .ob-area-btn.dark      {background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.06);color:#A89880}
  .ob-area-btn.dark.sel  {border-color:rgba(201,168,76,0.6);background:rgba(201,168,76,0.08);color:#C9A84C}
  .ob-area-btn.light     {background:#FAFAF8;border-color:#E8E4DF;color:#6B6560}
  .ob-area-btn.light.sel {border-color:#C4553A;background:#FDF1EE;color:#C4553A}

  .ob-subjects{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
  .ob-subject-chip{padding:7px 12px;border-radius:20px;cursor:pointer;font-size:12px;transition:all 0.2s;display:flex;align-items:center;gap:6px}
  .ob-subject-chip.dark     {background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#A89880}
  .ob-subject-chip.dark.sel {color:#060810;font-weight:600}
  .ob-subject-chip.light    {background:#F5F2EF;border:1px solid #E8E4DF;color:#6B6560}
  .ob-subject-chip.light.sel{color:#fff;font-weight:600}

  .ob-add-row{display:flex;gap:8px;margin-bottom:8px}

  /* Temas */
  .ob-themes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
  .ob-theme-card{border-radius:8px;padding:14px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;position:relative}
  .ob-theme-preview{height:36px;border-radius:4px;margin-bottom:8px;display:flex;gap:4px;padding:8px}
  .ob-theme-dot{width:12px;height:12px;border-radius:50%}
  .ob-theme-name{font-size:13px;font-weight:600;margin-bottom:2px}
  .ob-theme-desc{font-size:11px;opacity:0.6}

  /* Funções opcionais */
  .ob-features{display:flex;flex-direction:column;gap:12px;margin-bottom:8px}
  .ob-feature{border-radius:10px;padding:16px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;display:flex;gap:14px;align-items:flex-start}
  .ob-feature.dark      {background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.06)}
  .ob-feature.dark.sel  {background:rgba(201,168,76,0.06)}
  .ob-feature.light     {background:#FAFAF8;border-color:#E8E4DF}
  .ob-feature.light.sel {background:#F9F6F3}
  .ob-feature-icon{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ob-feature-title{font-size:14px;font-weight:600;margin-bottom:4px}
  .ob-feature-desc{font-size:12px;line-height:1.6}
  .ob-feature-desc.dark {color:rgba(168,152,128,0.8)}
  .ob-feature-desc.light{color:#9B8B6E}
  .ob-feature-check{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:auto;margin-top:2px;transition:all 0.2s}

  /* Navegação */
  .ob-nav{display:flex;justify-content:space-between;align-items:center;margin-top:24px}
  .ob-back{font-size:12px;cursor:pointer;padding:8px 0;background:none;border:none}
  .ob-next{padding:11px 28px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;border:none}
  .ob-next.dark  {background:#C9A84C;color:#060810}
  .ob-next.dark:hover  {background:#DFB94D;box-shadow:0 0 16px rgba(201,168,76,0.3)}
  .ob-next.light {background:#C4553A;color:#fff}
  .ob-next.light:hover {background:#A8432A}
  .ob-next:disabled{opacity:0.4;cursor:not-allowed}
  .ob-back.dark  {color:rgba(201,168,76,0.5)}
  .ob-back.dark:hover  {color:#C9A84C}
  .ob-back.light {color:#9B8B6E}
  .ob-back.light:hover {color:#C4553A}

  .ob-section-title{font-size:11px;font-weight:600;letter-spacing:2px;margin-bottom:12px;margin-top:20px}
  .ob-section-title.dark {color:rgba(0,255,200,0.5);font-family:'Share Tech Mono',monospace}
  .ob-section-title.light{color:#9B8B6E}

  @media(max-width:480px){
    .ob-areas {grid-template-columns:1fr}
    .ob-themes{grid-template-columns:1fr}
  }
`

export default function Onboarding({ user, onComplete }) {
  const [step,     setStep]     = useState(1)
  const [name,     setName]     = useState(user.displayName || '')
  const [course,   setCourse]   = useState('')
  const [area,     setArea]     = useState('')
  const [subjects, setSubjects] = useState([])
  const [newSub,   setNewSub]   = useState('')
  const [newEmoji, setNewEmoji] = useState('📚')
  const [theme,    setTheme]    = useState('')
  const [features, setFeatures] = useState([])
  const [saving,   setSaving]   = useState(false)

  const TOTAL = 4
  const progress = (step / TOTAL) * 100

  const handleArea = (aId) => {
    setArea(aId)
    setSubjects(SUGGESTED_SUBJECTS[aId] || [])
  }

  const toggleSubject = (sub) => {
    setSubjects(s => s.find(x=>x.id===sub.id) ? s.filter(x=>x.id!==sub.id) : [...s, sub])
  }

  const addCustomSubject = () => {
    if (!newSub.trim()) return
    const color = COLORS[subjects.length % COLORS.length]
    setSubjects(s => [...s, { id:`custom_${Date.now()}`, name:newSub.trim(), emoji:newEmoji, color }])
    setNewSub(''); setNewEmoji('📚')
  }

  const toggleFeature = (id) => {
    setFeatures(f => f.includes(id) ? f.filter(x=>x!==id) : [...f, id])
  }

  const isLight     = theme==='studio' || theme==='arctic'
  const themeClass  = isLight ? 'light' : 'dark'
  const accentColor = isLight ? '#C4553A' : '#C9A84C'

  const canNext = () => {
    if (step===1) return name.trim().length > 0
    if (step===2) return area !== ''
    if (step===3) return subjects.length > 0
    if (step===4) return theme !== ''
    return true
  }

  const save = async () => {
    setSaving(true)
    try {
      const ref = doc(db, 'users', user.uid)
      await updateDoc(ref, {
        name, course, area, subjects,
        theme: theme || 'stark-gold',
        features, // funções ativas
        onboardingDone: true,
      })
      onComplete({ name, course, area, subjects, theme: theme||'stark-gold', features })
    } catch(e) { console.error(e) }
    setSaving(false)
  }

  const next = () => step < TOTAL ? setStep(s=>s+1) : save()
  const back = () => step > 1 && setStep(s=>s-1)

  return (
    <>
      <style>{styles}</style>
      <div className={`ob-root ${themeClass}`}>
        <div className={`ob-card ${themeClass}`}>

          {/* Progresso */}
          <div className={`ob-progress ${themeClass}`}>
            <div className="ob-progress-fill" style={{width:`${progress}%`,background:accentColor}}/>
          </div>

          {/* Steps */}
          <div className="ob-steps">
            {Array.from({length:TOTAL},(_,i)=>{
              const n=i+1; const done=step>n; const active=step===n
              return (
                <div key={n} style={{display:'flex',alignItems:'center',gap:6}}>
                  <div className="ob-step-dot" style={{
                    background: done?accentColor:'transparent',
                    border:`2px solid ${done||active?accentColor:isLight?'#DDD8D2':'rgba(255,255,255,0.1)'}`,
                    color: done?(isLight?'#fff':'#060810'):active?accentColor:isLight?'#B8B0A8':'rgba(255,255,255,0.2)',
                  }}>
                    {done?<Check size={12}/>:n}
                  </div>
                  {i<TOTAL-1&&<div style={{width:24,height:1,background:done?accentColor:isLight?'#E8E4DF':'rgba(255,255,255,0.08)'}}/>}
                </div>
              )
            })}
          </div>

          {/* PASSO 1 — Perfil */}
          {step===1 && (
            <div>
              <div className={`ob-title ${themeClass}`}>Olá! Vamos personalizar sua Penseira</div>
              <div className={`ob-sub ${themeClass}`}>{isLight?'Conte um pouco sobre você':'// CONFIGURAÇÃO INICIAL DO SISTEMA'}</div>
              <label className={`ob-label ${themeClass}`}>SEU NOME</label>
              <input className={`ob-input ${themeClass}`} value={name} onChange={e=>setName(e.target.value)} placeholder="Como você quer ser chamado(a)?" autoFocus/>
              <label className={`ob-label ${themeClass}`}>SEU CURSO</label>
              <input className={`ob-input ${themeClass}`} value={course} onChange={e=>setCourse(e.target.value)} placeholder="Ex: Publicidade e Propaganda, Ciência da Computação..."/>
            </div>
          )}

          {/* PASSO 2 — Área */}
          {step===2 && (
            <div>
              <div className={`ob-title ${themeClass}`}>Qual é a sua área?</div>
              <div className={`ob-sub ${themeClass}`}>{isLight?'Isso vai personalizar suas vagas e dicas':'// SELEÇÃO DE ÁREA PARA PERSONALIZAÇÃO'}</div>
              <div className="ob-areas">
                {AREAS.map(a=>(
                  <button key={a.id} className={`ob-area-btn ${themeClass} ${area===a.id?'sel':''}`} onClick={()=>handleArea(a.id)}>
                    <span style={{fontSize:22}}>{a.emoji}</span><span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 3 — Matérias */}
          {step===3 && (
            <div>
              <div className={`ob-title ${themeClass}`}>Suas matérias</div>
              <div className={`ob-sub ${themeClass}`}>{isLight?'Selecione as que está cursando ou adicione novas':'// CONFIGURE SUAS MATÉRIAS E REVISÕES'}</div>
              <div className="ob-subjects">
                {(SUGGESTED_SUBJECTS[area]||[]).map(sub=>{
                  const sel=subjects.find(x=>x.id===sub.id)
                  return (
                    <div key={sub.id}
                      className={`ob-subject-chip ${themeClass} ${sel?'sel':''}`}
                      style={sel?{background:sub.color,borderColor:sub.color}:{}}
                      onClick={()=>toggleSubject(sub)}>
                      {sub.emoji} {sub.name}{sel&&<X size={11}/>}
                    </div>
                  )
                })}
              </div>
              <div className="ob-add-row">
                <input className={`ob-input ${themeClass}`} style={{marginBottom:0,width:48,textAlign:'center'}} value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} maxLength={2}/>
                <input className={`ob-input ${themeClass}`} style={{marginBottom:0,flex:1}} value={newSub} onChange={e=>setNewSub(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomSubject()} placeholder="Adicionar matéria personalizada..."/>
                <button className={`ob-next ${themeClass}`} style={{padding:'10px 14px'}} onClick={addCustomSubject}><Plus size={14}/></button>
              </div>
              <div style={{fontSize:11,color:isLight?'#9B8B6E':'rgba(168,152,128,0.6)',marginTop:6}}>
                {subjects.length} matéria{subjects.length!==1?'s':''} selecionada{subjects.length!==1?'s':''}
              </div>
            </div>
          )}

          {/* PASSO 4 — Tema + Funções opcionais */}
          {step===4 && (
            <div>
              <div className={`ob-title ${themeClass}`}>Personalize sua experiência</div>
              <div className={`ob-sub ${themeClass}`}>{isLight?'Escolha seu tema e ative as funções que quiser':'// TEMA VISUAL E FUNÇÕES OPCIONAIS'}</div>

              {/* Temas */}
              <div className={`ob-section-title ${themeClass}`}>TEMA VISUAL</div>
              <div className="ob-themes">
                {THEMES.map(t=>{
                  const sel=theme===t.id
                  const isLightT=t.id==='studio'||t.id==='arctic'
                  const rec=t.recommended.includes(area)
                  return (
                    <div key={t.id} className="ob-theme-card"
                      style={{background:t.preview.bg,border:`2px solid ${sel?t.preview.accent:'transparent'}`,boxShadow:sel?`0 0 16px ${t.preview.accent}40`:''}}
                      onClick={()=>setTheme(t.id)}>
                      {rec&&!sel&&<div style={{position:'absolute',top:6,right:6,background:`${t.preview.accent}22`,color:t.preview.accent,fontSize:9,padding:'1px 6px',borderRadius:3,fontWeight:600}}>★ REC.</div>}
                      {sel&&<div style={{position:'absolute',top:6,right:6,background:t.preview.accent,width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={11} color={isLightT?'#fff':'#060810'}/></div>}
                      <div className="ob-theme-preview" style={{background:`${t.preview.accent}18`}}>
                        <div className="ob-theme-dot" style={{background:t.preview.accent}}/>
                        <div className="ob-theme-dot" style={{background:t.preview.text,opacity:0.4}}/>
                      </div>
                      <div className="ob-theme-name" style={{color:t.preview.text,fontFamily:isLightT?'Playfair Display,serif':'Cinzel,serif',fontSize:12}}>{t.name}</div>
                      <div className="ob-theme-desc" style={{color:t.preview.text}}>{t.desc}</div>
                    </div>
                  )
                })}
              </div>

              {/* Funções opcionais */}
              <div className={`ob-section-title ${themeClass}`}>FUNÇÕES OPCIONAIS — ATIVE O QUE QUISER</div>
              <div className="ob-features">
                {OPTIONAL_FEATURES.map(f=>{
                  const sel=features.includes(f.id)
                  return (
                    <div key={f.id} className={`ob-feature ${themeClass} ${sel?'sel':''}`}
                      style={{borderColor:sel?`${f.color}60`:'',background:sel?(isLight?`${f.color}08`:`${f.color}08`):''}}
                      onClick={()=>toggleFeature(f.id)}>
                      <div className="ob-feature-icon" style={{background:`${f.color}18`,border:`1px solid ${f.color}30`}}>
                        <f.icon size={18} color={f.color}/>
                      </div>
                      <div style={{flex:1}}>
                        <div className="ob-feature-title" style={{color:sel?f.color:(isLight?'#2D2926':'#E8DFC8')}}>{f.title}</div>
                        <div className={`ob-feature-desc ${themeClass}`}>{f.desc}</div>
                      </div>
                      <div className="ob-feature-check" style={{background:sel?f.color:(isLight?'#E8E4DF':'rgba(255,255,255,0.08)'),border:sel?'none':`1px solid ${isLight?'#DDD8D2':'rgba(255,255,255,0.12)'}`}}>
                        {sel&&<Check size={12} color="#fff"/>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="ob-nav">
            <button className={`ob-back ${themeClass}`} onClick={back} style={{visibility:step===1?'hidden':'visible'}}>← Voltar</button>
            <button className={`ob-next ${themeClass}`} onClick={next} disabled={!canNext()||saving}>
              {saving?'Salvando...':step===TOTAL?'✓ Entrar na Penseira':'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
