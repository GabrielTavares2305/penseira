import { useState } from 'react'
import { Search, Bookmark, ExternalLink, MapPin, Clock, Building, Filter } from 'lucide-react'

const JOBS = [
  { id:1, title:'Estágio Desenvolvimento Web', company:'Totvs', location:'São Paulo / Remoto', type:'ESTÁGIO', salary:'R$ 1.500–2.000', tags:['React','Node.js','SQL'], desc:'Desenvolvimento de aplicações web modernas com React e integração de APIs RESTful em ambiente ágil.', posted:'2 dias', link:'https://www.gupy.io/vagas/estagio-ti' },
  { id:2, title:'Desenvolvedor Junior Full Stack', company:'iFood', location:'Remoto', type:'CLT', salary:'R$ 4.000–5.500', tags:['Python','React','AWS'], desc:'Time de crescimento focado em performance e escalabilidade para o maior app de delivery do Brasil.', posted:'1 dia', link:'https://www.gupy.io/vagas/ti' },
  { id:3, title:'Estágio Backend Python', company:'Nubank', location:'São Paulo', type:'ESTÁGIO', salary:'R$ 2.000–2.800', tags:['Python','Kafka','Microsserviços'], desc:'Imersão em sistemas distribuídos de alta disponibilidade no banco digital mais inovador do país.', posted:'3 dias', link:'https://boards.greenhouse.io/nubank' },
  { id:4, title:'Analista de Infraestrutura Jr', company:'Embratel', location:'Rio de Janeiro', type:'CLT', salary:'R$ 3.500–4.800', tags:['Linux','Docker','Ansible'], desc:'Gerenciamento de infraestrutura on-premise e cloud. Monitoramento e automação de ambientes críticos.', posted:'5 dias', link:'https://www.linkedin.com/jobs/ti-infrastructure' },
]

// Links de busca pré-configurados (100% gratuito, sem API)
const SEARCH_LINKS = [
  { label: 'Gupy — Estágio TI', url: 'https://portal.gupy.io/job-search/term=estagio%20tecnologia' },
  { label: 'LinkedIn — Dev Jr', url: 'https://www.linkedin.com/jobs/search/?keywords=desenvolvedor+junior+ti' },
  { label: 'Indeed — TI Brasil', url: 'https://br.indeed.com/jobs?q=tecnologia+da+informação+junior' },
  { label: 'CIEE — Estágio TI', url: 'https://portal.ciee.org.br/estagio/ti' },
]

function CardCorners() {
  return (<><div className="card-corner tl"/><div className="card-corner br"/></>)
}

function JobCard({ job, saved, onSave }) {
  return (
    <div className="job-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div className="job-title">{job.title}</div>
          <div className="job-company"><Building size={10} style={{ display:'inline', marginRight:4 }} />{job.company}</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <span className={`badge ${job.type === 'ESTÁGIO' ? 'badge-purple' : 'badge-info'}`}>{job.type}</span>
          <button className="btn-ghost" style={{ padding:'3px 6px', color: saved ? 'var(--gold)' : 'var(--text-muted)' }} onClick={() => onSave(job.id)}>
            <Bookmark size={13} fill={saved ? 'var(--gold)' : 'none'} />
          </button>
        </div>
      </div>
      <div className="job-meta">
        <span><MapPin size={10} style={{ display:'inline', marginRight:3 }} />{job.location}</span>
        <span>💰 {job.salary}</span>
        <span><Clock size={10} style={{ display:'inline', marginRight:3 }} />{job.posted}</span>
      </div>
      <div className="job-description">{job.desc}</div>
      <div className="tags" style={{ marginBottom:12 }}>
        {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <a href={job.link} target="_blank" rel="noopener" className="btn btn-gold" style={{ fontSize:11 }}>
        <ExternalLink size={11} /> CANDIDATAR
      </a>
    </div>
  )
}

export default function Jobs() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('TODOS')
  const [saved,  setSaved]    = useState([])

  const toggleSave = id => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const filtered = JOBS.filter(j => {
    const q = search.toLowerCase()
    const matchQ = !q || j.title.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q)) || j.company.toLowerCase().includes(q)
    const matchF = filter === 'TODOS' || filter === j.type || (filter === 'REMOTO' && j.location.toLowerCase().includes('remoto')) || (filter === 'SALVO' && saved.includes(j.id))
    return matchQ && matchF
  })

  return (
    <div>
      {/* Buscas externas gratuitas */}
      <div className="card" style={{ marginBottom:20 }}>
        <CardCorners />
        <div className="card-label">// PORTAIS DE VAGAS <span className="card-label-right badge badge-cyan">GRATUITO</span></div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {SEARCH_LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener" className="btn btn-cyan">
              <ExternalLink size={11} />{l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft:32 }} placeholder="BUSCAR VAGAS OU TECNOLOGIA..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['TODOS','ESTÁGIO','CLT','REMOTO','SALVO'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-gold' : 'btn-outline'}`} style={{ fontSize:10, padding:'6px 10px' }} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid-auto">
        {filtered.map(j => <JobCard key={j.id} job={j} saved={saved.includes(j.id)} onSave={toggleSave} />)}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Nenhuma vaga encontrada</div>
          <div className="empty-desc">TENTE OUTROS FILTROS</div>
        </div>
      )}
    </div>
  )
}
