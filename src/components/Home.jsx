import { Briefcase, Server, BookOpen, Star, Zap } from 'lucide-react'

const TIPS = [
  { icon: '🎯', title: 'Revisão Ativa', desc: 'Teste a si mesmo antes de reler. Recuperação é mais eficaz que releitura passiva.' },
  { icon: '🔁', title: 'Repetição Espaçada', desc: 'Revise em intervalos crescentes: 1 dia → 3 dias → 1 semana → 1 mês.' },
  { icon: '📦', title: 'Método Feynman', desc: 'Explique o conceito como se fosse ensinar. O que não dá para explicar, não foi aprendido.' },
  { icon: '🌐', title: 'Portfolio GitHub', desc: 'README detalhado em cada projeto. Recrutadores olham o GitHub antes da entrevista.' },
  { icon: '🤝', title: 'Networking', desc: 'Contribua com open-source e interaja com a comunidade TI no LinkedIn e GitHub.' },
  { icon: '⏱️', title: 'Deep Work', desc: 'Blocos de 90min de foco total valem mais que 4h de multitarefa.' },
]

function CardCorners() {
  return (
    <>
      <div className="card-corner tl" />
      <div className="card-corner tr" />
      <div className="card-corner bl" />
      <div className="card-corner br" />
    </>
  )
}

export default function Home({ onNavigate, jobs, projects, studySessions }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'BOM DIA' : hour < 18 ? 'BOA TARDE' : 'BOA NOITE'

  return (
    <div>
      {/* Greeting */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #101422 0%, #0C0F1A 100%)' }}>
        <CardCorners />
        <div className="card-label">// CENTRAL DE COMANDO</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
            <polygon points="24,2 46,14 46,42 24,54 2,42 2,14"
              fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
            <polygon points="24,8 40,17 40,39 24,48 8,39 8,17"
              fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.5)" strokeWidth="1"/>
            <text x="24" y="34" textAnchor="middle" fontFamily="serif"
              fontSize="20" fill="#C9A84C" fontWeight="700">✦</text>
          </svg>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className="pulse-dot" />
              <span style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--gold)', letterSpacing: 3 }}>
                {greeting} · BEM-VINDO À PENSEIRA
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: 11, color: 'var(--cyan-dim)', letterSpacing: 2 }}>
              {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[
          { icon: Briefcase, val: jobs.length, label: 'VAGAS SALVAS', page: 'jobs', color: 'var(--gold)' },
          { icon: Server,    val: projects.length, label: 'PROJETOS ATIVOS', page: 'projects', color: 'var(--cyan)' },
          { icon: BookOpen,  val: studySessions, label: 'SESSÕES FOCO', page: 'study', color: 'var(--gold)' },
        ].map(s => (
          <div key={s.page} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate(s.page)}>
            <div className="stat-icon"><s.icon size={16} color={s.color} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="card" style={{ marginBottom: 20 }}>
        <CardCorners />
        <div className="card-label">
          // PROTOCOLOS DE PRODUTIVIDADE
          <span className="badge badge-gold"><Star size={9} style={{ marginRight: 3 }} />6 DICAS</span>
        </div>
        <div className="grid-2">
          {TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-hud)', fontSize: 11, color: 'var(--gold)', letterSpacing: 1, marginBottom: 3 }}>{tip.title.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick access */}
      <div className="card">
        <CardCorners />
        <div className="card-label">// ACESSO RÁPIDO</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'BUSCAR VAGAS',    page: 'jobs' },
            { label: 'INICIAR POMODORO', page: 'study' },
            { label: 'VER PROJETOS',    page: 'projects' },
            { label: 'NOTÍCIAS TI',     page: 'news' },
          ].map(b => (
            <button key={b.page} className="btn btn-outline" onClick={() => onNavigate(b.page)}>
              <Zap size={11} />{b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
