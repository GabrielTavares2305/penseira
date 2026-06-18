import { useState, useEffect } from 'react'

// Tela de boas-vindas personalizada após o onboarding
// Aparece uma vez, dura ~4 segundos e dá lugar ao dashboard

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:wght@400;700&family=Share+Tech+Mono&family=Inter:wght@400;500&display=swap');

  .wl-root {
    position:fixed; inset:0; z-index:500;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:0; overflow:hidden;
    transition:opacity 1s ease;
  }
  .wl-root.fade-out { opacity:0; pointer-events:none; }

  .wl-particles {
    position:absolute; inset:0; pointer-events:none;
    overflow:hidden;
  }

  .wl-particle {
    position:absolute;
    border-radius:50%;
    animation:wl-float linear infinite;
    opacity:0;
  }

  @keyframes wl-float {
    0%   { transform:translateY(100vh) scale(0); opacity:0; }
    10%  { opacity:0.6; }
    90%  { opacity:0.3; }
    100% { transform:translateY(-20vh) scale(1); opacity:0; }
  }

  .wl-content {
    position:relative; z-index:1;
    text-align:center; padding:24px;
    animation:wl-appear 1s ease forwards;
  }

  @keyframes wl-appear {
    from { opacity:0; transform:translateY(24px) scale(0.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .wl-emoji { font-size:56px; margin-bottom:16px; display:block; }

  .wl-title { margin-bottom:8px; }

  .wl-sub {
    font-size:13px; margin-bottom:32px; letter-spacing:0.5px;
  }

  .wl-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:32px; }
  .wl-tag {
    padding:6px 14px; border-radius:20px;
    font-size:12px; font-weight:500;
  }

  .wl-bar-wrap { width:200px; height:3px; border-radius:2px; overflow:hidden; margin:0 auto; }
  .wl-bar      { height:100%; border-radius:2px; animation:wl-load 3.5s linear forwards; }
  @keyframes wl-load { from{width:0} to{width:100%} }

  .wl-hint { font-size:11px; margin-top:10px; opacity:0.5; letter-spacing:1px; }
`

// Gera partículas aleatórias com a cor do tema
function Particles({ color }) {
  const particles = Array.from({length:16}, (_,i) => ({
    id: i,
    left:  `${Math.random()*100}%`,
    size:  `${4 + Math.random()*8}px`,
    delay: `${Math.random()*3}s`,
    dur:   `${3 + Math.random()*3}s`,
  }))
  return (
    <div className="wl-particles">
      {particles.map(p => (
        <div key={p.id} className="wl-particle" style={{
          left:p.left, width:p.size, height:p.size,
          background:color, animationDelay:p.delay, animationDuration:p.dur,
          boxShadow:`0 0 6px ${color}`,
        }}/>
      ))}
    </div>
  )
}

const THEME_STYLES = {
  'stark-gold': {
    bg:      'linear-gradient(135deg,#060810 0%,#0C0F1A 100%)',
    accent:  '#C9A84C',
    text:    '#E8DFC8',
    sub:     'rgba(0,255,200,0.7)',
    tag:     { bg:'rgba(201,168,76,0.12)', border:'rgba(201,168,76,0.3)', color:'#C9A84C' },
    bar:     '#C9A84C',
    hint:    'rgba(201,168,76,0.4)',
    font:    'Cinzel',
    mono:    'Share Tech Mono',
  },
  'studio': {
    bg:      'linear-gradient(135deg,#FAFAF8 0%,#F2EDE8 100%)',
    accent:  '#C4553A',
    text:    '#2D2926',
    sub:     '#9B8B6E',
    tag:     { bg:'#FDF1EE', border:'#F0C4B8', color:'#C4553A' },
    bar:     '#C4553A',
    hint:    '#B8B0A8',
    font:    'Playfair Display',
    mono:    'Inter',
  },
  'nebula': {
    bg:      'linear-gradient(135deg,#0A0612 0%,#120D1E 100%)',
    accent:  '#9B7FC0',
    text:    '#E8DFC8',
    sub:     'rgba(155,127,192,0.7)',
    tag:     { bg:'rgba(155,127,192,0.12)', border:'rgba(155,127,192,0.3)', color:'#C084FC' },
    bar:     '#9B7FC0',
    hint:    'rgba(155,127,192,0.4)',
    font:    'Cinzel',
    mono:    'Share Tech Mono',
  },
  'arctic': {
    bg:      'linear-gradient(135deg,#F0F4F8 0%,#E8EEF4 100%)',
    accent:  '#2563EB',
    text:    '#1E293B',
    sub:     '#64748B',
    tag:     { bg:'rgba(37,99,235,0.08)', border:'rgba(37,99,235,0.2)', color:'#2563EB' },
    bar:     '#2563EB',
    hint:    '#94A3B8',
    font:    'Inter',
    mono:    'Inter',
  },
  'glass': {
    bg:      'linear-gradient(135deg,#C8CDD6 0%,#D4DCE8 100%)',
    accent:  '#1A1A2E',
    text:    '#1A1A2E',
    sub:     '#5A5A7A',
    tag:     { bg:'rgba(26,26,46,0.08)', border:'rgba(26,26,46,0.2)', color:'#1A1A2E' },
    bar:     '#1A1A2E',
    hint:    '#9999AA',
    font:    'Syne',
    mono:    'Inter',
  },
}

export default function Welcome({ profile, onDone }) {
  const [fadeOut, setFadeOut] = useState(false)
  const theme = THEME_STYLES[profile.theme] || THEME_STYLES['stark-gold']
  const name  = profile.name?.split(' ')[0] || 'bem-vindo'
  const isLight = profile.theme==='studio'||profile.theme==='arctic'||profile.theme==='glass'

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 3800)
    const t2 = setTimeout(() => onDone(), 4800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      <style>{styles}</style>
      <div className={`wl-root ${fadeOut?'fade-out':''}`} style={{background:theme.bg}}>
        <Particles color={theme.accent}/>
        <div className="wl-content">
          <span className="wl-emoji">✨</span>
          <div className="wl-title" style={{
            fontFamily:`'${theme.font}',serif`,
            fontSize:'clamp(22px,5vw,32px)',
            fontWeight:700, color:theme.accent,
            letterSpacing: isLight ? 1 : 4,
            marginBottom:8,
          }}>
            {isLight ? `Olá, ${name}!` : `BEM-VINDO(A), ${name.toUpperCase()}`}
          </div>
          <div className="wl-sub" style={{color:theme.sub, fontFamily:`'${theme.mono}',monospace`}}>
            {isLight
              ? 'Sua Penseira está pronta. Vamos organizar seus planos!'
              : '// SISTEMA INICIALIZADO · PENSEIRA PRONTA'}
          </div>

          {/* Tags das matérias */}
          {profile.subjects?.length > 0 && (
            <div className="wl-tags">
              {profile.subjects.slice(0,6).map(s => (
                <div key={s.id} className="wl-tag" style={{
                  background: theme.tag.bg,
                  border: `1px solid ${s.color || theme.tag.border}`,
                  color: s.color || theme.tag.color,
                }}>
                  {s.emoji} {s.name}
                </div>
              ))}
            </div>
          )}

          {/* Barra de carregamento */}
          <div className="wl-bar-wrap" style={{background:isLight?'#E8E4DF':'rgba(255,255,255,0.08)'}}>
            <div className="wl-bar" style={{background:theme.accent}}/>
          </div>
          <div className="wl-hint" style={{color:theme.hint,fontFamily:`'${theme.mono}',monospace`}}>
            {isLight ? 'Carregando seu dashboard...' : 'CARREGANDO SISTEMA...'}
          </div>
        </div>
      </div>
    </>
  )
}
