import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, X, GitBranch, ArrowLeft, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const INITIAL_PROJECTS = [
  {id:1,name:'Servidor Pessoal',emoji:'🖥️',desc:'Servidor Linux em casa com Nextcloud, Jellyfin, Pi-hole e monitoramento com Grafana/Prometheus.',status:'ativo',tech:['Linux','Docker','Nginx','Grafana'],tasks:[{id:1,text:'Configurar backup automático para HD externo',done:true},{id:2,text:'Configurar acesso externo via Tailscale',done:false},{id:3,text:'Monitoramento de temperatura do servidor',done:false}],github:'',notes:'Uptime: 99.2%. Próxima manutenção no final do mês.'},
  {id:2,name:'Acqua Monitor',emoji:'🐟',desc:'Sistema IoT de monitoramento de aquário: temperatura, pH, amônia e alimentação automatizada via Arduino.',status:'desenvolvimento',tech:['Arduino','Python','MQTT','React'],tasks:[{id:1,text:'Finalizar circuito sensor de pH',done:true},{id:2,text:'Dashboard de visualização em tempo real',done:false},{id:3,text:'Alertas via Telegram',done:false},{id:4,text:'Alimentação automática por horário',done:false}],github:'',notes:'Hardware montado. Sensor de temperatura OK. pH calibrando.'},
]

const STATUS = {
  ativo:          {color:'var(--cyan)',       label:'● ATIVO'},
  desenvolvimento:{color:'var(--gold)',       label:'◐ EM DEV'},
  pausado:        {color:'var(--text-muted)', label:'○ PAUSADO'},
  concluido:      {color:'var(--info)',       label:'✓ CONCLUÍDO'},
}

function Modal({project, onClose, onSave}) {
  const [form,setForm]=useState(project||{name:'',emoji:'🛠️',desc:'',status:'desenvolvimento',tech:[],tasks:[],github:'',notes:''})
  const [ti,setTi]=useState('')
  const [tsk,setTsk]=useState('')
  const addT  =()=>{ if(ti.trim()) { setForm(f=>({...f,tech:[...f.tech,ti.trim()]})); setTi('') } }
  const addTsk=()=>{ if(tsk.trim()){ setForm(f=>({...f,tasks:[...f.tasks,{id:Date.now(),text:tsk.trim(),done:false}]})); setTsk('') } }
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:0}}>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px 12px 0 0',padding:24,width:'100%',maxWidth:600,maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontFamily:'var(--font-hud)',fontSize:11,letterSpacing:2,color:'var(--cyan)'}}>{project?'// EDITAR':'// NOVO PROJETO'}</span>
          <button className="btn-ghost" onClick={onClose}><X size={16}/></button>
        </div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">EMOJI</label><input className="input" value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} maxLength={2}/></div>
          <div className="form-group"><label className="form-label">STATUS</label>
            <select className="input select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">NOME</label><input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">DESCRIÇÃO</label><textarea className="textarea" style={{minHeight:72}} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/></div>
        <div className="form-group">
          <label className="form-label">TECNOLOGIAS</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}><input className="input" value={ti} onChange={e=>setTi(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addT()} placeholder="React, Docker..."/><button className="btn btn-outline" onClick={addT}>+</button></div>
          <div className="tags">{form.tech.map(t=><span key={t} className="tag" style={{cursor:'pointer'}} onClick={()=>setForm(f=>({...f,tech:f.tech.filter(x=>x!==t)}))}>{t} ×</span>)}</div>
        </div>
        <div className="form-group">
          <label className="form-label">TAREFAS</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}><input className="input" value={tsk} onChange={e=>setTsk(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTsk()} placeholder="Próxima tarefa..."/><button className="btn btn-outline" onClick={addTsk}>+</button></div>
          {form.tasks.map(t=>(
            <div key={t.id} style={{display:'flex',gap:8,alignItems:'center',padding:'4px 0',fontSize:12,color:'var(--text-secondary)'}}>
              <span style={{flex:1}}>• {t.text}</span>
              <button className="btn-ghost" style={{padding:2}} onClick={()=>setForm(f=>({...f,tasks:f.tasks.filter(x=>x.id!==t.id)}))}><X size={11}/></button>
            </div>
          ))}
        </div>
        <div className="form-group"><label className="form-label">GITHUB URL</label><input className="input" value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} placeholder="https://github.com/..."/></div>
        <div className="form-group"><label className="form-label">NOTAS</label><textarea className="textarea" style={{minHeight:56}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button className="btn btn-outline" onClick={onClose}>CANCELAR</button>
          <button className="btn btn-gold" onClick={()=>onSave(form)}><Check size={13}/> SALVAR</button>
        </div>
      </div>
    </div>
  )
}

// ── MODO PORTFOLIO ───────────────────────────────────────────────────────
function PortfolioMode({projects, onClose}) {
  return (
    <div style={{position:'fixed',inset:0,background:'#060810',zIndex:300,overflowY:'auto',padding:40}}>
      <button className="btn btn-outline" style={{position:'fixed',top:20,right:20,fontSize:11,zIndex:301}} onClick={onClose}>
        <Minimize2 size={13}/> FECHAR PORTFOLIO
      </button>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontFamily:'var(--font-hud)',fontSize:10,letterSpacing:4,color:'var(--cyan-dim)',marginBottom:8}}>// PORTFOLIO DE PROJETOS</div>
          <div style={{fontFamily:'var(--font-title)',fontSize:36,color:'var(--gold)',letterSpacing:6,textShadow:'0 0 30px rgba(201,168,76,0.4)'}}>PENSEIRA</div>
          <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-muted)',letterSpacing:2,marginTop:8}}>PROJETOS PESSOAIS & TÉCNICOS</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))',gap:24}}>
          {projects.map(p=>{
            const s=STATUS[p.status]
            const done=p.tasks.filter(t=>t.done).length
            const tot=p.tasks.length
            return (
              <div key={p.id} style={{background:'linear-gradient(135deg,#101422,#0C0F1A)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:12,padding:28,position:'relative',overflow:'hidden'}}>
                {/* Linha topo */}
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.color},transparent)`}}/>
                {/* Cantos */}
                <div style={{position:'absolute',top:8,left:8,width:12,height:12,borderTop:'1px solid var(--gold)',borderLeft:'1px solid var(--gold)',opacity:0.5}}/>
                <div style={{position:'absolute',bottom:8,right:8,width:12,height:12,borderBottom:'1px solid var(--gold)',borderRight:'1px solid var(--gold)',opacity:0.5}}/>

                <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:16}}>
                  <span style={{fontSize:40}}>{p.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--font-title)',fontSize:20,color:'var(--cream)',marginBottom:4}}>{p.name}</div>
                    <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:s.color,letterSpacing:2}}>{s.label}</div>
                  </div>
                </div>

                <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.7,marginBottom:16}}>{p.desc}</div>

                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                  {p.tech.map(t=>(
                    <span key={t} style={{background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:3,padding:'3px 8px',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--gold)'}}>
                      {t}
                    </span>
                  ))}
                </div>

                {tot>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',marginBottom:4}}>
                      <span>PROGRESSO</span><span>{done}/{tot} TAREFAS</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${tot?(done/tot)*100:0}%`}}/></div>
                  </div>
                )}

                {p.notes&&(
                  <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-muted)',borderTop:'1px solid var(--border-subtle)',paddingTop:12,lineHeight:1.6}}>
                    {p.notes}
                  </div>
                )}

                {p.github&&(
                  <a href={p.github} target="_blank" rel="noopener" className="btn btn-outline" style={{fontSize:11,marginTop:12,display:'inline-flex'}}>
                    <GitBranch size={12}/> VER NO GITHUB
                  </a>
                )}
              </div>
            )
          })}
        </div>
        <div style={{textAlign:'center',marginTop:48,fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:2}}>
          GABRIELTAVARES2305.GITHUB.IO/PENSEIRA
        </div>
      </div>
    </div>
  )
}

export default function Projects({ uid = 'local' }) {
  const [projects, setProjects] = useLocalStorage(`${uid}_projects`, INITIAL_PROJECTS)
  const [modal,    setModal]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [portfolio,setPortfolio]= useState(false)

  const save = form => {
    if (modal==='new') setProjects(p=>[...p,{...form,id:Date.now()}])
    else setProjects(p=>p.map(x=>x.id===form.id?form:x))
    setModal(null)
  }
  const del = id => { setProjects(p=>p.filter(x=>x.id!==id)); setSelected(null) }
  const toggleTask=(pid,tid)=>setProjects(p=>p.map(proj=>proj.id!==pid?proj:{...proj,tasks:proj.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}))
  const active = selected!=null ? projects.find(p=>p.id===selected) : null

  return (
    <div>
      {portfolio && <PortfolioMode projects={projects} onClose={()=>setPortfolio(false)}/>}

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16,gap:8}}>
        <button className="btn btn-cyan" style={{fontSize:11}} onClick={()=>setPortfolio(true)}>
          <Maximize2 size={12}/> MODO PORTFOLIO
        </button>
        <button className="btn btn-gold" style={{fontSize:11}} onClick={()=>setModal('new')}>
          <Plus size={12}/> NOVO PROJETO
        </button>
      </div>

      <div style={{display:'flex',gap:20}} className="projects-layout">
        {/* Lista */}
        <div style={{width:280,flexShrink:0}} className={`projects-list ${selected!=null?'mobile-hidden':''}`}>
          <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:2,marginBottom:14}}>{projects.length} PROJETOS</div>
          {projects.map(p=>{
            const s=STATUS[p.status]
            const done=p.tasks.filter(t=>t.done).length
            const tot=p.tasks.length
            return (
              <div key={p.id} className="project-card" style={{marginBottom:10,borderColor:selected===p.id?'var(--gold-dim)':undefined}} onClick={()=>setSelected(p.id)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <span style={{fontSize:22}}>{p.emoji}</span>
                    <div>
                      <div className="project-name">{p.name}</div>
                      <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:s.color,letterSpacing:1}}>{s.label}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:4}}>
                    <button className="btn-ghost" style={{padding:3}} onClick={e=>{e.stopPropagation();setModal(p)}}><Edit2 size={12}/></button>
                    <button className="btn-ghost" style={{padding:3,color:'var(--danger)'}} onClick={e=>{e.stopPropagation();del(p.id)}}><Trash2 size={12}/></button>
                  </div>
                </div>
                {tot>0&&(
                  <div style={{marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',marginBottom:4}}>
                      <span>TAREFAS</span><span>{done}/{tot}</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${tot?(done/tot)*100:0}%`}}/></div>
                  </div>
                )}
                <div className="tags">{p.tech.slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}{p.tech.length>3&&<span className="tag">+{p.tech.length-3}</span>}</div>
              </div>
            )
          })}
        </div>

        {/* Detalhe */}
        <div style={{flex:1,overflowY:'auto'}} className={`projects-detail ${selected!=null?'visible':''}`}>
          {active?(
            <div>
              <button className="btn btn-outline mobile-back" style={{marginBottom:14,fontSize:11}} onClick={()=>setSelected(null)}>
                <ArrowLeft size={13}/> VOLTAR
              </button>
              <div className="card" style={{marginBottom:16}}>
                <div className="card-corner tl"/><div className="card-corner tr"/><div className="card-corner bl"/><div className="card-corner br"/>
                <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                  <span style={{fontSize:40}}>{active.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--font-title)',fontSize:'clamp(16px,4vw,20px)',color:'var(--cream)',marginBottom:4}}>{active.name}</div>
                    <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:STATUS[active.status].color,letterSpacing:2,marginBottom:8}}>{STATUS[active.status].label}</div>
                    <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>{active.desc}</div>
                    <div className="tags" style={{marginTop:8}}>{active.tech.map(t=><span key={t} className="badge badge-purple" style={{marginRight:4}}>{t}</span>)}</div>
                  </div>
                </div>
                {active.github&&<a href={active.github} target="_blank" rel="noopener" className="btn btn-outline" style={{fontSize:11,marginTop:12}}><GitBranch size={12}/> GITHUB</a>}
              </div>
              <div className="card" style={{marginBottom:16}}>
                <div className="card-label">// TAREFAS <span className="card-label-right">{active.tasks.filter(t=>t.done).length}/{active.tasks.length}</span></div>
                <div className="progress-bar" style={{marginBottom:12}}><div className="progress-fill" style={{width:`${active.tasks.length?(active.tasks.filter(t=>t.done).length/active.tasks.length)*100:0}%`}}/></div>
                {active.tasks.map(t=>(
                  <div key={t.id} className={`checkbox-item ${t.done?'done':''}`}>
                    <input type="checkbox" checked={t.done} id={`t${t.id}`} onChange={()=>toggleTask(active.id,t.id)}/>
                    <label htmlFor={`t${t.id}`}>{t.text}</label>
                  </div>
                ))}
              </div>
              {active.notes&&(
                <div className="card">
                  <div className="card-label">// NOTAS</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.8,whiteSpace:'pre-wrap',fontFamily:'var(--font-hud)'}}>{active.notes}</div>
                </div>
              )}
            </div>
          ):(
            <div className="empty-state desktop-only" style={{marginTop:40}}>
              <div className="empty-icon">👆</div>
              <div className="empty-title">Selecione um projeto</div>
              <div className="empty-desc">CLIQUE PARA VER DETALHES</div>
            </div>
          )}
        </div>
      </div>
      {modal&&<Modal project={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save}/>}
    </div>
  )
}
