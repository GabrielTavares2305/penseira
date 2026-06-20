import { Settings, Image, DollarSign, Dumbbell, X } from 'lucide-react'

export default function MoreMenu({ onNavigate, onClose, features = [] }) {
  const items = [
    { id:'settings',  icon:Settings,    label:'Configurações', always:true },
    { id:'moodboard', icon:Image,       label:'Moodboard',      feature:'moodboard' },
    { id:'financas',  icon:DollarSign,  label:'Controle de Gastos', feature:'financas' },
    { id:'academia',  icon:Dumbbell,    label:'Academia',       feature:'academia' },
  ].filter(i => i.always || features.includes(i.feature))

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
        zIndex:150, display:'flex', alignItems:'flex-end',
        backdropFilter:'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', background:'var(--bg-card)',
          borderRadius:'16px 16px 0 0',
          padding:'20px 16px calc(20px + env(safe-area-inset-bottom))',
          border:'1px solid var(--border-subtle)',
          borderBottom:'none',
        }}
      >
        <div style={{
          width:36, height:4, background:'var(--border-subtle)',
          borderRadius:2, margin:'0 auto 16px',
        }} />

        <div style={{
          fontFamily:'var(--font-hud)', fontSize:10, letterSpacing:2,
          color:'var(--text-muted)', marginBottom:14, textTransform:'uppercase',
        }}>
          Mais opções
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 12px', borderRadius:10,
                background:'var(--bg-hover)', border:'none',
                cursor:'pointer', width:'100%', textAlign:'left',
              }}
            >
              <div style={{
                width:36, height:36, borderRadius:8,
                background:'var(--accent-glow)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
              }}>
                <item.icon size={18} color="var(--accent)" />
              </div>
              <span style={{
                fontSize:14, fontWeight:500, color:'var(--text-primary)',
              }}>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width:'100%', marginTop:14, padding:12,
            background:'none', border:'1px solid var(--border-subtle)',
            borderRadius:10, color:'var(--text-secondary)',
            fontSize:13, cursor:'pointer',
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
