import { useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, CreditCard, X, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CATEGORIAS = [
  { id:'alimentacao', label:'Alimentação',   emoji:'🍔', color:'#FF6B35' },
  { id:'transporte',  label:'Transporte',    emoji:'🚌', color:'#58A6FF' },
  { id:'lazer',       label:'Lazer',         emoji:'🎮', color:'#C084FC' },
  { id:'saude',       label:'Saúde',         emoji:'💊', color:'#3FB950' },
  { id:'educacao',    label:'Educação',      emoji:'📚', color:'#C9A84C' },
  { id:'roupas',      label:'Roupas',        emoji:'👕', color:'#FF4C6A' },
  { id:'moradia',     label:'Moradia',       emoji:'🏠', color:'#00FFC8' },
  { id:'outros',      label:'Outros',        emoji:'💸', color:'#8A8FA8' },
]

const TIPOS = [
  { id:'debito',   label:'Débito',      icon:CreditCard,    color:'#FF4C6A' },
  { id:'credito',  label:'Crédito',     icon:CreditCard,    color:'#C084FC' },
  { id:'entrada',  label:'Entrada $$',  icon:TrendingUp,    color:'#3FB950' },
]

function TransacaoModal({ onClose, onSave, accentColor }) {
  const [tipo,       setTipo]       = useState('debito')
  const [valor,      setValor]      = useState('')
  const [descricao,  setDescricao]  = useState('')
  const [categoria,  setCategoria]  = useState('outros')
  const [data,       setData]       = useState(new Date().toISOString().slice(0,10))

  const t = TIPOS.find(x=>x.id===tipo)

  const handleSave = () => {
    if(!valor||!descricao) return
    onSave({
      id: Date.now(),
      tipo, valor: parseFloat(valor.replace(',','.')),
      descricao, categoria, data,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200}}>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px 12px 0 0',padding:24,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontFamily:'var(--font-hud)',fontSize:11,letterSpacing:2,color:accentColor}}>NOVA TRANSAÇÃO</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)'}}><X size={16}/></button>
        </div>

        {/* Tipo */}
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {TIPOS.map(tp=>(
            <button key={tp.id} onClick={()=>setTipo(tp.id)} style={{
              flex:1,padding:'10px 6px',borderRadius:6,fontSize:11,cursor:'pointer',
              fontFamily:'var(--font-hud)',letterSpacing:1,border:`1px solid ${tipo===tp.id?tp.color:'var(--border-subtle)'}`,
              background:tipo===tp.id?`${tp.color}18`:'var(--bg-hover)',
              color:tipo===tp.id?tp.color:'var(--text-secondary)',
            }}>{tp.label}</button>
          ))}
        </div>

        {/* Valor */}
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--cyan-dim)',letterSpacing:2,marginBottom:6}}>VALOR (R$)</label>
          <input value={valor} onChange={e=>setValor(e.target.value)} placeholder="0,00" type="number" step="0.01"
            style={{width:'100%',background:'var(--bg-deep)',border:`1px solid ${t.color}40`,borderRadius:6,padding:'12px 14px',color:t.color,fontFamily:'var(--font-title)',fontSize:24,outline:'none',textAlign:'center'}}/>
        </div>

        {/* Descrição */}
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--cyan-dim)',letterSpacing:2,marginBottom:6}}>DESCRIÇÃO</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Ex: Almoço, Uber, Netflix..."
            style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontSize:13,outline:'none'}}/>
        </div>

        {/* Data */}
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--cyan-dim)',letterSpacing:2,marginBottom:6}}>DATA</label>
          <input type="date" value={data} onChange={e=>setData(e.target.value)}
            style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontSize:13,outline:'none'}}/>
        </div>

        {/* Categoria */}
        {tipo!=='entrada' && (
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontFamily:'var(--font-hud)',fontSize:10,color:'var(--cyan-dim)',letterSpacing:2,marginBottom:8}}>CATEGORIA</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {CATEGORIAS.map(c=>(
                <button key={c.id} onClick={()=>setCategoria(c.id)} style={{
                  padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer',
                  background:categoria===c.id?`${c.color}20`:'var(--bg-hover)',
                  border:`1px solid ${categoria===c.id?c.color:'var(--border-subtle)'}`,
                  color:categoria===c.id?c.color:'var(--text-secondary)',
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'8px 16px',borderRadius:6,border:'1px solid var(--border)',background:'transparent',color:'var(--text-secondary)',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)'}}>CANCELAR</button>
          <button onClick={handleSave} disabled={!valor||!descricao}
            style={{padding:'8px 24px',borderRadius:6,background:t.color,color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)',fontWeight:600,opacity:(!valor||!descricao)?0.4:1}}>
            <Check size={13} style={{display:'inline',marginRight:6}}/>SALVAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Financas({ uid, theme }) {
  const accentColor = theme==='studio'?'#C4553A':theme==='arctic'?'#2563EB':theme==='nebula'?'#C084FC':'#C9A84C'
  const [transacoes, setTransacoes] = useLocalStorage(`${uid}_transacoes`, [])
  const [modal,      setModal]      = useState(false)
  const [filtro,     setFiltro]     = useState('todos') // todos | debito | credito | entrada
  const [mesFiltro,  setMesFiltro]  = useState(new Date().toISOString().slice(0,7))

  const addTransacao = (t) => { setTransacoes(ts=>[t,...ts]); setModal(false) }
  const delTransacao = (id) => setTransacoes(ts=>ts.filter(t=>t.id!==id))

  const filtradas = transacoes.filter(t=>{
    const matchTipo = filtro==='todos' || t.tipo===filtro
    const matchMes  = t.data?.startsWith(mesFiltro)
    return matchTipo && matchMes
  })

  const entradas  = filtradas.filter(t=>t.tipo==='entrada').reduce((a,t)=>a+t.valor,0)
  const saidas    = filtradas.filter(t=>t.tipo!=='entrada').reduce((a,t)=>a+t.valor,0)
  const saldo     = entradas - saidas

  const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

  // Gastos por categoria
  const porCategoria = CATEGORIAS.map(c=>({
    ...c,
    total: filtradas.filter(t=>t.categoria===c.id&&t.tipo!=='entrada').reduce((a,t)=>a+t.valor,0)
  })).filter(c=>c.total>0).sort((a,b)=>b.total-a.total)

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:3,color:'var(--cyan-dim)',marginBottom:4}}>// CONTROLE DE GASTOS</div>
          <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--cream)'}}>Sua Carteira</div>
        </div>
        <button onClick={()=>setModal(true)} className="btn btn-gold" style={{fontSize:11}}>
          <Plus size={12}/> NOVA TRANSAÇÃO
        </button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
        {[
          {label:'ENTRADAS',  val:entradas, color:'#3FB950', icon:TrendingUp},
          {label:'SAÍDAS',    val:saidas,   color:'#FF4C6A', icon:TrendingDown},
          {label:'SALDO',     val:saldo,    color:saldo>=0?'#3FB950':'#FF4C6A', icon:Wallet},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{marginBottom:4}}><s.icon size={16} color={s.color}/></div>
            <div style={{fontFamily:'var(--font-title)',fontSize:'clamp(14px,3vw,20px)',fontWeight:700,color:s.color,lineHeight:1}}>
              {fmt(s.val)}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <input type="month" value={mesFiltro} onChange={e=>setMesFiltro(e.target.value)}
          style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:6,padding:'6px 10px',color:'var(--text-primary)',fontFamily:'var(--font-hud)',fontSize:11,outline:'none'}}/>
        {['todos','debito','credito','entrada'].map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} className={`btn ${filtro===f?'btn-gold':'btn-outline'}`} style={{fontSize:10,padding:'5px 10px'}}>
            {f==='todos'?'TODOS':f==='debito'?'DÉBITO':f==='credito'?'CRÉDITO':'ENTRADAS'}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Extrato */}
        <div className="card">
          <div className="card-label">// EXTRATO <span className="card-label-right">{filtradas.length} transações</span></div>
          {filtradas.length===0 ? (
            <div className="empty-state" style={{padding:'32px 0'}}>
              <div className="empty-icon">💳</div>
              <div className="empty-title">Nenhuma transação</div>
              <div className="empty-desc">ADICIONE SUA PRIMEIRA TRANSAÇÃO</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:2,maxHeight:420,overflowY:'auto'}}>
              {filtradas.map(t=>{
                const cat = CATEGORIAS.find(c=>c.id===t.categoria)
                const isEntrada = t.tipo==='entrada'
                return (
                  <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 8px',borderBottom:'1px solid var(--border-subtle)',borderRadius:4}}>
                    <span style={{fontSize:20,flexShrink:0}}>{isEntrada?'💰':cat?.emoji||'💸'}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:'var(--cream)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.descricao}</div>
                      <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1}}>
                        {new Date(t.data+'T12:00:00').toLocaleDateString('pt-BR')} · {t.tipo==='credito'?'CRÉDITO':t.tipo==='debito'?'DÉBITO':'ENTRADA'}
                      </div>
                    </div>
                    <div style={{fontWeight:700,fontSize:14,color:isEntrada?'#3FB950':'#FF4C6A',flexShrink:0}}>
                      {isEntrada?'+':'-'}{fmt(t.valor)}
                    </div>
                    <button onClick={()=>delTransacao(t.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',padding:4,flexShrink:0}}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Gastos por categoria */}
        <div className="card">
          <div className="card-label">// GASTOS POR CATEGORIA</div>
          {porCategoria.length===0 ? (
            <div className="empty-state" style={{padding:'32px 0'}}>
              <div className="empty-icon">📊</div>
              <div className="empty-title">Sem dados ainda</div>
              <div className="empty-desc">ADICIONE GASTOS PARA VER O GRÁFICO</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {porCategoria.map(c=>(
                <div key={c.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:13,color:'var(--cream)'}}>{c.emoji} {c.label}</span>
                    <span style={{fontFamily:'var(--font-hud)',fontSize:12,color:c.color,fontWeight:600}}>{fmt(c.total)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${(c.total/saidas)*100}%`,background:c.color}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && <TransacaoModal onClose={()=>setModal(false)} onSave={addTransacao} accentColor={accentColor}/>}
    </div>
  )
}
