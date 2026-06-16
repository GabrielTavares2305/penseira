import { useState, useEffect } from 'react'
import { Plus, X, ExternalLink, Trash2, Edit2, Check, Image, Info } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Tutorial pop-up — aparece na primeira vez
function Tutorial({ onClose, themeClass, accentColor }) {
  const steps = [
    { icon:'📋', title:'Crie um Board', desc:'Um board é um painel temático. Ex: "Campanha de Verão", "Identidade Visual do TCC", "Referências de Tipografia".' },
    { icon:'🔗', title:'Cole links de imagens', desc:'Abra qualquer imagem no Pinterest, Behance ou Instagram, copie o link e cole aqui. A imagem aparece sem ocupar espaço no seu celular.' },
    { icon:'🎨', title:'Adicione cores e notas', desc:'Salve paletas de cores em hex (#FF5733) e anote referências de fontes, tom de voz ou qualquer ideia para o projeto.' },
    { icon:'✨', title:'Organize por projeto', desc:'Cada board é independente. Você pode ter um para cada campanha, disciplina ou cliente.' },
  ]
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:20}}>
      <div style={{
        background:'var(--bg-card)',border:'1px solid var(--border)',
        borderRadius:12,padding:28,width:'100%',maxWidth:480,
        position:'relative',maxHeight:'90vh',overflowY:'auto'
      }}>
        {/* Linha topo */}
        <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:2,background:`linear-gradient(90deg,transparent,${accentColor},transparent)`}}/>

        <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)'}}><X size={16}/></button>

        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:36,marginBottom:8}}>🎨</div>
          <div style={{fontFamily:'var(--font-title)',fontSize:18,color:accentColor,letterSpacing:2,marginBottom:6}}>BEM-VINDO AO MOODBOARD</div>
          <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-secondary)',letterSpacing:1}}>Seu painel de referências visuais pessoal</div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:'flex',gap:14,padding:14,background:'var(--bg-hover)',borderRadius:8,border:'1px solid var(--border-subtle)'}}>
              <span style={{fontSize:24,flexShrink:0}}>{s.icon}</span>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:'var(--cream)',marginBottom:3}}>{s.title}</div>
                <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:`${accentColor}12`,border:`1px solid ${accentColor}30`,borderRadius:8,padding:12,marginBottom:20,fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
          💡 <strong style={{color:accentColor}}>Dica:</strong> Para pegar o link de uma imagem no Pinterest, toque e segure a imagem → "Copiar link da imagem". No Behance, clique com o botão direito → "Copiar endereço da imagem".
        </div>

        <button onClick={onClose} style={{
          width:'100%',padding:12,background:accentColor,
          color: accentColor==='#C4553A'?'#fff':'#060810',
          border:'none',borderRadius:6,fontSize:13,fontWeight:600,cursor:'pointer',
          fontFamily:'var(--font-hud)',letterSpacing:2
        }}>
          ENTENDIDO · VAMOS LÁ!
        </button>
      </div>
    </div>
  )
}

// Modal para criar/editar board
function BoardModal({ board, onClose, onSave, themeClass, accentColor }) {
  const [name,  setName]  = useState(board?.name  || '')
  const [emoji, setEmoji] = useState(board?.emoji || '🎨')
  const [desc,  setDesc]  = useState(board?.desc  || '')
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:0}}>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px 12px 0 0',padding:24,width:'100%',maxWidth:500}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontFamily:'var(--font-hud)',fontSize:11,letterSpacing:2,color:accentColor}}>{board?'EDITAR BOARD':'NOVO BOARD'}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)'}}><X size={16}/></button>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          <input value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2}
            style={{width:48,textAlign:'center',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:10,color:'var(--text-primary)',fontSize:18,outline:'none'}}/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do board..."
            style={{flex:1,background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-body)',fontSize:14,outline:'none'}}/>
        </div>
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descrição opcional..."
          style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-body)',fontSize:13,outline:'none',marginBottom:16}}/>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'8px 16px',borderRadius:6,border:'1px solid var(--border)',background:'transparent',color:'var(--text-secondary)',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)'}}>CANCELAR</button>
          <button onClick={()=>name.trim()&&onSave({...board,name:name.trim(),emoji,desc})}
            style={{padding:'8px 20px',borderRadius:6,background:accentColor,color:accentColor==='#C4553A'?'#fff':'#060810',border:'none',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)',fontWeight:600,letterSpacing:1}}>
            <Check size={13} style={{display:'inline',marginRight:6}}/>SALVAR
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal para adicionar item ao board
function ItemModal({ onClose, onSave, accentColor }) {
  const [url,   setUrl]   = useState('')
  const [title, setTitle] = useState('')
  const [note,  setNote]  = useState('')
  const [type,  setType]  = useState('image') // image | color | note
  const [color, setColor] = useState('#C9A84C')

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:0}}>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'12px 12px 0 0',padding:24,width:'100%',maxWidth:500,maxHeight:'80vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <span style={{fontFamily:'var(--font-hud)',fontSize:11,letterSpacing:2,color:accentColor}}>ADICIONAR REFERÊNCIA</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)'}}><X size={16}/></button>
        </div>

        {/* Tipo */}
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {[['image','🖼️ Imagem'],['color','🎨 Cor'],['note','📝 Nota']].map(([t,l])=>(
            <button key={t} onClick={()=>setType(t)} style={{
              flex:1,padding:'8px 4px',borderRadius:6,fontSize:12,cursor:'pointer',fontFamily:'var(--font-hud)',
              background:type===t?accentColor:'var(--bg-hover)',
              color:type===t?(accentColor==='#C4553A'?'#fff':'#060810'):'var(--text-secondary)',
              border:`1px solid ${type===t?accentColor:'var(--border-subtle)'}`,
            }}>{l}</button>
          ))}
        </div>

        {type==='image' && (
          <>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link da imagem aqui..."
              style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-hud)',fontSize:12,outline:'none',marginBottom:12}}/>
            {url && <div style={{marginBottom:12,borderRadius:6,overflow:'hidden',maxHeight:160}}>
              <img src={url} alt="preview" style={{width:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
            </div>}
          </>
        )}

        {type==='color' && (
          <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)}
              style={{width:52,height:52,border:'none',borderRadius:8,cursor:'pointer',background:'none'}}/>
            <input value={color} onChange={e=>setColor(e.target.value)} placeholder="#C9A84C"
              style={{flex:1,background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-hud)',fontSize:13,outline:'none'}}/>
            <div style={{width:52,height:52,borderRadius:8,background:color,flexShrink:0}}/>
          </div>
        )}

        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={type==='color'?'Nome da cor (ex: Dourado Principal)':'Título ou descrição...'}
          style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-body)',fontSize:13,outline:'none',marginBottom:12}}/>

        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Notas adicionais (opcional)..."
          style={{width:'100%',background:'var(--bg-deep)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:'10px 14px',color:'var(--text-primary)',fontFamily:'var(--font-body)',fontSize:13,outline:'none',minHeight:72,resize:'vertical',marginBottom:16}}/>

        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'8px 16px',borderRadius:6,border:'1px solid var(--border)',background:'transparent',color:'var(--text-secondary)',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)'}}>CANCELAR</button>
          <button onClick={()=>{
            const item={id:Date.now(),type,url:type==='image'?url:'',color:type==='color'?color:'',title:title||'Sem título',note,createdAt:new Date().toISOString()}
            onSave(item)
          }} style={{padding:'8px 20px',borderRadius:6,background:accentColor,color:accentColor==='#C4553A'?'#fff':'#060810',border:'none',cursor:'pointer',fontSize:12,fontFamily:'var(--font-hud)',fontWeight:600}}>
            ADICIONAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Moodboard({ uid, theme }) {
  const accentColor = (theme==='studio'||theme==='arctic')
    ? (theme==='studio'?'#C4553A':'#2563EB')
    : (theme==='nebula'?'#C084FC':'#C9A84C')

  const [boards,      setBoards]      = useLocalStorage(`${uid}_moodboard_boards`, [])
  const [showTutorial,setShowTutorial]= useLocalStorage(`${uid}_moodboard_seen`,   false)
  const [activeBoard, setActiveBoard] = useState(null)
  const [boardModal,  setBoardModal]  = useState(null) // null | 'new' | board
  const [itemModal,   setItemModal]   = useState(false)

  // Mostra tutorial na primeira vez
  const tutorialVisible = !showTutorial

  const saveBoard = (form) => {
    if (boardModal==='new') {
      const newBoard = {...form, id:Date.now(), items:[] }
      setBoards(b=>[...b, newBoard])
      setActiveBoard(newBoard.id)
    } else {
      setBoards(b=>b.map(x=>x.id===form.id?{...x,...form}:x))
    }
    setBoardModal(null)
  }

  const deleteBoard = (id) => {
    setBoards(b=>b.filter(x=>x.id!==id))
    if(activeBoard===id) setActiveBoard(null)
  }

  const addItem = (item) => {
    setBoards(b=>b.map(x=>x.id===activeBoard?{...x,items:[...(x.items||[]),item]}:x))
    setItemModal(false)
  }

  const removeItem = (boardId, itemId) => {
    setBoards(b=>b.map(x=>x.id===boardId?{...x,items:x.items.filter(i=>i.id!==itemId)}:x))
  }

  const currentBoard = boards.find(b=>b.id===activeBoard)

  return (
    <div>
      {/* Tutorial pop-up */}
      {tutorialVisible && (
        <Tutorial
          onClose={()=>setShowTutorial(true)}
          themeClass=""
          accentColor={accentColor}
        />
      )}

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <div style={{fontFamily:'var(--font-hud)',fontSize:9,letterSpacing:3,color:'var(--cyan-dim)',marginBottom:4}}>// MOODBOARD</div>
          <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--cream)'}}>Seus Painéis de Referência</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowTutorial(false)} className="btn btn-outline" style={{fontSize:11}}>
            <Info size={12}/> COMO USAR
          </button>
          <button onClick={()=>setBoardModal('new')} className="btn btn-gold" style={{fontSize:11}}>
            <Plus size={12}/> NOVO BOARD
          </button>
        </div>
      </div>

      {boards.length===0 ? (
        /* Estado vazio */
        <div style={{textAlign:'center',padding:'60px 24px'}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.5}}>🎨</div>
          <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--text-secondary)',marginBottom:8}}>Nenhum board ainda</div>
          <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-muted)',letterSpacing:1,marginBottom:24,lineHeight:1.8}}>
            Crie seu primeiro painel de referências.<br/>Organize imagens, cores e ideias por projeto.
          </div>
          <button onClick={()=>setBoardModal('new')} className="btn btn-gold">
            <Plus size={13}/> Criar primeiro board
          </button>
        </div>
      ) : (
        <div>
          {/* Lista de boards */}
          {!activeBoard && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
              {boards.map(b=>(
                <div key={b.id} className="card" style={{cursor:'pointer',transition:'all 0.2s'}}
                  onClick={()=>setActiveBoard(b.id)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{display:'flex',gap:10,alignItems:'center'}}>
                      <span style={{fontSize:28}}>{b.emoji}</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:14,color:'var(--cream)'}}>{b.name}</div>
                        {b.desc&&<div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{b.desc}</div>}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:4}}>
                      <button onClick={e=>{e.stopPropagation();setBoardModal(b)}} className="btn-ghost" style={{padding:4}}><Edit2 size={13}/></button>
                      <button onClick={e=>{e.stopPropagation();deleteBoard(b.id)}} className="btn-ghost" style={{padding:4,color:'var(--danger)'}}><Trash2 size={13}/></button>
                    </div>
                  </div>

                  {/* Preview das imagens */}
                  {b.items?.length>0 ? (
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,borderRadius:6,overflow:'hidden',marginBottom:8}}>
                      {b.items.slice(0,6).map((item,i)=>(
                        <div key={i} style={{aspectRatio:'1',background:item.type==='color'?item.color:'var(--bg-hover)',borderRadius:4,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {item.type==='image'&&item.url
                            ? <img src={item.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                            : item.type==='note'
                            ? <span style={{fontSize:16}}>📝</span>
                            : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{height:60,background:'var(--bg-hover)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>
                      <span style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1}}>BOARD VAZIO</span>
                    </div>
                  )}

                  <div style={{fontFamily:'var(--font-hud)',fontSize:10,color:'var(--text-muted)',letterSpacing:1}}>
                    {b.items?.length||0} REFERÊNCIA{b.items?.length!==1?'S':''}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Board aberto */}
          {currentBoard && (
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
                <button onClick={()=>setActiveBoard(null)} className="btn btn-outline" style={{fontSize:11}}>← BOARDS</button>
                <span style={{fontSize:24}}>{currentBoard.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:18,color:'var(--cream)'}}>{currentBoard.name}</div>
                  {currentBoard.desc&&<div style={{fontSize:12,color:'var(--text-secondary)'}}>{currentBoard.desc}</div>}
                </div>
                <button onClick={()=>setItemModal(true)} className="btn btn-gold" style={{fontSize:11}}>
                  <Plus size={12}/> ADICIONAR
                </button>
              </div>

              {/* Grid de itens */}
              {currentBoard.items?.length===0 ? (
                <div style={{textAlign:'center',padding:'40px 24px'}}>
                  <div style={{fontSize:36,marginBottom:12,opacity:0.4}}>🖼️</div>
                  <div style={{fontFamily:'var(--font-title)',fontSize:16,color:'var(--text-secondary)',marginBottom:8}}>Board vazio</div>
                  <div style={{fontFamily:'var(--font-hud)',fontSize:11,color:'var(--text-muted)',letterSpacing:1,marginBottom:20,lineHeight:1.8}}>
                    Adicione imagens, cores e notas<br/>para construir seu painel de referências.
                  </div>
                  <button onClick={()=>setItemModal(true)} className="btn btn-gold"><Plus size={13}/> Adicionar referência</button>
                </div>
              ) : (
                <div style={{columns:'2 240px',gap:12}}>
                  {currentBoard.items.map(item=>(
                    <div key={item.id} style={{breakInside:'avoid',marginBottom:12,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:8,overflow:'hidden',position:'relative'}}>
                      <button onClick={()=>removeItem(currentBoard.id,item.id)}
                        style={{position:'absolute',top:6,right:6,background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',zIndex:2}}>
                        <X size={12}/>
                      </button>

                      {item.type==='image'&&item.url&&(
                        <img src={item.url} alt={item.title} style={{width:'100%',display:'block'}}
                          onError={e=>{e.target.style.display='none'}}/>
                      )}
                      {item.type==='color'&&(
                        <div style={{height:80,background:item.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <span style={{fontFamily:'var(--font-hud)',fontSize:13,color:'#fff',textShadow:'0 1px 3px rgba(0,0,0,0.5)',letterSpacing:2}}>{item.color}</span>
                        </div>
                      )}
                      {item.type==='note'&&(
                        <div style={{padding:16,minHeight:80,display:'flex',alignItems:'center'}}>
                          <span style={{fontSize:28,marginRight:12}}>📝</span>
                        </div>
                      )}

                      <div style={{padding:10}}>
                        {item.title&&<div style={{fontSize:12,fontWeight:600,color:'var(--cream)',marginBottom:3}}>{item.title}</div>}
                        {item.note &&<div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.5}}>{item.note}</div>}
                        {item.type==='image'&&item.url&&(
                          <a href={item.url} target="_blank" rel="noopener"
                            style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color:'var(--text-muted)',marginTop:4,fontFamily:'var(--font-hud)'}}>
                            <ExternalLink size={10}/> VER ORIGINAL
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {boardModal && <BoardModal board={boardModal==='new'?null:boardModal} onClose={()=>setBoardModal(null)} onSave={saveBoard} accentColor={accentColor}/>}
      {itemModal  && <ItemModal  onClose={()=>setItemModal(false)} onSave={addItem} accentColor={accentColor}/>}
    </div>
  )
}
