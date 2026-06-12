import { useState, useEffect } from 'react'
import { RefreshCw, ExternalLink, Rss } from 'lucide-react'

// RSS via rss2json.com (plano gratuito: 500 req/dia)
const FEEDS = [
  { name: 'Olhar Digital',  url: 'https://olhardigital.com.br/feed/', color: '#C9A84C' },
  { name: 'TechTudo',       url: 'https://www.techtudo.com.br/rss/all.xml', color: '#00FFC8' },
  { name: 'Canaltech',      url: 'https://canaltech.com.br/rss/', color: '#5BA8FF' },
  { name: 'Dev.to',         url: 'https://dev.to/feed', color: '#C084FC' },
]

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url='

// Links curados de TI para leitura
const CURATED = [
  { source:'Hacker News',   headline:'Melhores discussões de tecnologia da semana — link para o ranking ao vivo', time:'Ao vivo', url:'https://news.ycombinator.com', tag:'COMUNIDADE' },
  { source:'Dev.to',        headline:'Artigos da comunidade dev: tutoriais, carreira e novidades em programação', time:'Diário', url:'https://dev.to/t/brazil', tag:'DEV' },
  { source:'GitHub Blog',   headline:'Novidades do GitHub: features, segurança e open source', time:'Semanal', url:'https://github.blog', tag:'FERRAMENTAS' },
  { source:'InfoQ Brasil',  headline:'Arquitetura de software, microsserviços e práticas de engenharia', time:'Semanal', url:'https://www.infoq.com/br', tag:'ARQUITETURA' },
  { source:'Olhar Digital', headline:'Notícias de tecnologia, gadgets e internet em português', time:'Diário', url:'https://olhardigital.com.br', tag:'BRASIL' },
  { source:'Canaltech',     headline:'Tecnologia e inovação: reviews, tutoriais e notícias nacionais', time:'Diário', url:'https://canaltech.com.br', tag:'BRASIL' },
]

// Links X/Twitter embed gratuito
const X_LISTS = [
  { name: 'Tech Brasil',    url: 'https://x.com/i/lists/1234567890', desc: 'Comunidade dev BR' },
  { name: 'Open Source',   url: 'https://x.com/github',             desc: '@github — novidades' },
  { name: 'Linux',         url: 'https://x.com/Linux',              desc: '@Linux — kernel e distros' },
  { name: 'TechCrunch',    url: 'https://x.com/TechCrunch',         desc: '@TechCrunch — big tech' },
]

function CardCorners() {
  return (<><div className="card-corner tl"/><div className="card-corner br"/></>)
}

export default function News() {
  const [tab, setTab]     = useState('curado')
  const [feed, setFeed]   = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFeed, setActiveFeed] = useState(FEEDS[0])

  const loadRSS = async (source) => {
    setLoading(true)
    setFeed([])
    try {
      const r = await fetch(`${RSS2JSON}${encodeURIComponent(source.url)}&count=10`)
      const d = await r.json()
      if (d.status === 'ok') setFeed(d.items)
    } catch { setFeed([]) }
    setLoading(false)
  }

  useEffect(() => { if (tab === 'rss') loadRSS(activeFeed) }, [tab, activeFeed])

  const timeAgo = dateStr => {
    const diff = (Date.now() - new Date(dateStr)) / 60000
    if (diff < 60) return `${Math.round(diff)}min atrás`
    if (diff < 1440) return `${Math.round(diff/60)}h atrás`
    return `${Math.round(diff/1440)} dias atrás`
  }

  return (
    <div>
      <div className="tabs">
        {[['curado','// PORTAIS CURADOS'],['rss','// RSS AO VIVO'],['x','// TWITTER / X']].map(([id,label]) => (
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</div>
        ))}
      </div>

      {tab === 'curado' && (
        <div className="card">
          <CardCorners />
          <div className="card-label">// FONTES RECOMENDADAS DE TI <span className="card-label-right">SEM CADASTRO</span></div>
          {CURATED.map((item,i) => (
            <div key={i} className="news-item">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span className="news-source">{item.source}</span>
                    <span className="badge badge-gold">{item.tag}</span>
                    <span className="news-time">{item.time}</span>
                  </div>
                  <div className="news-headline">{item.headline}</div>
                </div>
                <a href={item.url} target="_blank" rel="noopener" className="btn-ghost" style={{ padding:'4px 6px', flexShrink:0 }}>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rss' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {FEEDS.map(f => (
              <button key={f.name}
                className={`btn ${activeFeed.name === f.name ? 'btn-gold' : 'btn-outline'}`}
                style={{ fontSize:11 }}
                onClick={() => setActiveFeed(f)}>
                <Rss size={11} /> {f.name}
              </button>
            ))}
            <button className="btn btn-ghost" style={{ marginLeft:'auto' }} onClick={() => loadRSS(activeFeed)}>
              <RefreshCw size={13} />
            </button>
          </div>
          <div className="card">
            <CardCorners />
            <div className="card-label">// {activeFeed.name.toUpperCase()} · RSS AO VIVO</div>
            {loading && (
              <div style={{ display:'flex', gap:10, alignItems:'center', padding:'24px 0', color:'var(--text-muted)', fontFamily:'var(--font-hud)', fontSize:11 }}>
                <span className="spinner" /> CARREGANDO FEED...
              </div>
            )}
            {!loading && feed.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon"><Rss size={32} opacity={0.3} /></div>
                <div className="empty-title">Feed não carregado</div>
                <div className="empty-desc">CLIQUE EM ATUALIZAR</div>
              </div>
            )}
            {feed.map((item, i) => (
              <div key={i} className="news-item">
                <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                  <div>
                    <div className="news-source">{activeFeed.name.toUpperCase()}</div>
                    <div className="news-headline">{item.title}</div>
                    <div className="news-time">{timeAgo(item.pubDate)}</div>
                  </div>
                  <a href={item.link} target="_blank" rel="noopener" className="btn-ghost" style={{ padding:'4px 6px', flexShrink:0 }}>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'x' && (
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <CardCorners />
            <div className="card-label">// WIDGET OFICIAL DO X/TWITTER <span className="card-label-right badge badge-cyan">GRATUITO</span></div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:16 }}>
              O widget oficial do X é gratuito e não precisa de API key. Para ativar no seu deploy,
              copie o embed de qualquer perfil público em <strong style={{ color:'var(--gold)' }}>publish.twitter.com</strong> e cole no componente.
              Abaixo os perfis recomendados para TI:
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {X_LISTS.map(x => (
                <div key={x.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'var(--bg-hover)', borderRadius:4, border:'1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-hud)', fontSize:12, color:'var(--cream)', letterSpacing:1 }}>{x.name}</div>
                    <div style={{ fontFamily:'var(--font-hud)', fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{x.desc}</div>
                  </div>
                  <a href={x.url} target="_blank" rel="noopener" className="btn btn-outline" style={{ fontSize:11 }}>
                    <ExternalLink size={11} /> VER
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Embed oficial do X — descomentar e colar seu widget aqui */}
          <div className="card" style={{ textAlign:'center', padding:32 }}>
            <div style={{ fontFamily:'var(--font-hud)', fontSize:10, color:'var(--text-muted)', letterSpacing:2, marginBottom:12 }}>// WIDGET X AQUI</div>
            <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.8 }}>
              Vá em <a href="https://publish.twitter.com" target="_blank" rel="noopener">publish.twitter.com</a>, cole a URL do perfil e copie o código gerado para este componente.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
