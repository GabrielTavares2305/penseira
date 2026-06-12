import { useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, Check, X, GitBranch } from 'lucide-react'

const INITIAL = [
  { id:1, name:'Servidor Pessoal', emoji:'🖥️', desc:'Servidor Linux em casa com Nextcloud, Jellyfin, Pi-hole e monitoramento com Grafana/Prometheus.', status:'ativo', tech:['Linux','Docker','Nginx','Grafana'], tasks:[{id:1,text:'Configurar backup automático para HD externo',done:true},{id:2,text:'Configurar acesso externo via Tailscale',done:false},{id:3,text:'Monitoramento de temperatura do servidor',done:false}], github:'', notes:'Uptime: 99.2%. Próxima manutenção no final do mês.' },
  { id:2, name:'Acqua Monitor', emoji:'🐟', desc:'Sistema IoT de monitoramento de aquário: temperatura, pH, amônia e alimentação automatizada via Arduino.', status:'desenvolvimento', tech:['Arduino','Python','MQTT','React'], tasks:[{id:1,text:'Finalizar circuito sensor de pH',done:true},{id:2,text:'Dashboard de visualização em tempo real',done:false},{id:3,text:'Alertas via Telegram',done:false},{id:4,text:'Alimentação automática por horário',done:false}], github:'', notes:'Hardware montado. Sensor de temperatura OK. pH calibrando.' },
]

const STATUS = {
  ativo:         { color:'var(--cyan)',   label:'● ATIVO' },
  desenvolvimento:{ color:'var(--gold)',  label:'◐ EM DEV' },
  pausado:       { color:'var(--text-muted)', label:'○ PAUSADO' },
  concluido:     { color:'var(--info)',   label:'✓ CONCLUÍDO' },
}

function CardCorners() {
  return (<><div className="card-corner tl"/><div className="card-corner br"/></>)
}

function Modal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project || { name:'', emoji:'🛠️', desc:'', status:'desenvolvimento', tech:[], tasks:[], github:'', notes:'' })
  const [ti, setTi] = useState('')
  const [tsk, setTsk] = useState('')
  const addT  = () => { if(ti.trim())  { setForm(f=>({...f,tech:[...f.tech,ti.trim()]})); setTi('') } }
  const addTsk= () => { if(tsk.trim()) { setForm(f=>({...f,tasks:[...f.tasks,{id:Date.now(),text:tsk.trim(),done:false}]})); setTsk('') } }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20 }}>
      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:28,width:'100%',maxWidth:540,maxHeight:'90vh',overflowY:'auto' }}>
        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:20 }}>
          <span style={{ fontFamily:'var(--font-hud)',fontSize:11,letterSpacing:2,color:'var(--cyan)' }}>{project?'// EDITAR PROJETO':'// NOVO PROJETO'}</span>
          <button className="btn-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">EMOJI</label><input className="input" value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} maxLength={2} /></div>
          <div className="form-group"><label className="form-label">STATUS</label>
            <select className="input select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">NOME</label><input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
        <div className="form-group"><label className="form-label">DESCRIÇÃO</label><textarea className="textarea" style={{minHeight:72}} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} /></div>
        <div className="form-group">
          <label className="form-label">TECNOLOGIAS</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}><input className="input" value={ti} onChange={e=>setTi(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addT()} placeholder="React, Docker..." /><button className="btn btn-outline" onClick={addT}>+</button></div>
          <div className="tags">{form.tech.map(t=><span key={t} className="tag" style={{cursor:'pointer'}} onClick={()=>setForm(f=>({...f,tech:f.tech.filter(x=>x!==t)}))}>{t} ×</span>)}</div>
        </div>
        <div className="form-group">
          <label className="form-label">TAREFAS</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}><input className="input" value={tsk} onChange={e=>setTsk(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTsk()} placeholder="Próxima tarefa..." /><button className="btn btn-outline" onClick={addTsk}>+</button></div>
          {form.tasks.map(t=>(
            <div key={t.id} style={{display:'flex',gap:8,alignItems:'center',padding:'4px 0',fontSize:12,color:'var(--text-secondary)'}}>
              <span style={{flex:1}}>• {t.text}</span>
              <button className="btn-ghost" style={{padding:2}} onClick={()=>setForm(f=>({...f,tasks:f.tasks.filter(x=>x.id!==t.id)}))}><X size={11}/></button>
            </div>
          ))}
        </div>
        <div className="form-group"><label className="form-label">GITHUB URL</label><input className="input" value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} placeholder="https://github.com/..." /></div>
        <div className="form-group"><label className="form-label">NOTAS</label><textarea className="textarea" style={{minHeight:56}} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} /></div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button className="btn btn-outline" onClick={onClose}>CANCELAR</button>
          <button className="btn btn-gold" onClick={()=>onSave(form)}><Check size={13} /> SALVAR</button>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL)
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)

  const save = form => {
    if (modal==='new') setProjects(p=>[...p,{...form,id:Date.now()}])
    else setProjects(p=>p.map(x=>x.id===form.id?form:x))
    setModal(null)
  }

  const del = id => { setProjects(p=>p.filter(x=>x.id!==id)); if(selected?.id===id) setSelected(null) }

  const toggleTask = (pid, tid) => {
    setProjects(p=>p.map(proj=>proj.id!==pid?proj:{...proj,tasks:proj.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}))
    if(selected?.id===pid) setSelected(prev=>({...prev,tasks:prev.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}))
  }

  const active = selected ? projects.find(p=>p.id===selected.id) : null

  return (
    <div style={{ display:'flex', gap:20, height:'calc(100vh - 130px)' }}>
      {/* Lista */}
      <div style={{ width:280, flexShrink:0, overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <span style={{ fontFamily:'var(--font-hud)', fontSize:10, color:'var(--text-muted)', letterSpacing:2 }}>{projects.length} PROJETOS</span>
          <button className="btn btn-gold" style={{ fontSize:10 }} onClick={()=>setModal('new')}><Plus size={12} /> NOVO</button>
        </div>
        {projects.map(p=>{
          const s = STATUS[p.status]
          const done = p.tasks.filter(t=>t.done).length
          const total = p.tasks.length
          return (
            <div key={p.id} className="project-card" style={{ marginBottom:10, borderColor: selected?.id===p.id ? 'var(--gold-dim)' : undefined }} onClick={()=>setSelected(p)}>
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
              {total > 0 && (
                <div style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-hud)',fontSize:9,color:'var(--text-muted)',marginBottom:4}}>
                    <span>TAREFAS</span><span>{done}/{total}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${total?(done/total)*100:0}%`}}/></div>
                </div>
              )}
              <div className="tags">{p.tech.slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}{p.tech.length>3&&<span className="tag">+{p.tech.length-3}</span>}</div>
            </div>
          )
        })}
      </div>

      {/* Detalhe */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {active ? (
          <div>
            <div className="card" style={{ marginBottom:16 }}>
              <div className="card-corner tl"/><div className="card-corner tr"/><div className="card-corner bl"/><div className="card-corner br"/>
              <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
                <span style={{fontSize:44}}>{active.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:20,color:'var(--cream)',marginBottom:4}}>{active.name}</div>
                  <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:STATUS[active.status].color,letterSpacing:2,marginBottom:10}}>{STATUS[active.status].label}</div>
                  <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>{active.desc}</div>
                  <div className="tags" style={{marginTop:10}}>{active.tech.map(t=><span key={t} className="badge badge-purple" style={{marginRight:4}}>{t}</span>)}</div>
                </div>
                {active.github && (
                  <a href={active.github} target="_blank" rel="noopener" className="btn btn-outline" style={{fontSize:11}}><GitBranch size={12}/> GITHUB</a>
                )}
              </div>
            </div>
            <div className="card" style={{marginBottom:16}}>
              <div className="card-label">// TAREFAS <span className="card-label-right">{active.tasks.filter(t=>t.done).length}/{active.tasks.length} CONCLUÍDAS</span></div>
              <div className="progress-bar" style={{marginBottom:14}}><div className="progress-fill" style={{width:`${active.tasks.length?(active.tasks.filter(t=>t.done).length/active.tasks.length)*100:0}%`}}/></div>
              {active.tasks.map(t=>(
                <div key={t.id} className={`checkbox-item ${t.done?'done':''}`}>
                  <input type="checkbox" checked={t.done} id={`t${t.id}`} onChange={()=>toggleTask(active.id,t.id)} />
                  <label htmlFor={`t${t.id}`}>{t.text}</label>
                </div>
              ))}
            </div>
            {active.notes && (
              <div className="card">
                <div className="card-label">// NOTAS</div>
                <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.8,whiteSpace:'pre-wrap',fontFamily:'var(--font-hud)',fontSize:12}}>{active.notes}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{marginTop:60}}>
            <div className="empty-icon">👆</div>
            <div className="empty-title">Selecione um projeto</div>
            <div className="empty-desc">CLIQUE PARA VER DETALHES E TAREFAS</div>
          </div>
        )}
      </div>

      {modal && <Modal project={modal==='new'?null:modal} onClose={()=>setModal(null)} onSave={save} />}
    </div>
  )
}
