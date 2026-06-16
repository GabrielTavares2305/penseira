import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Share+Tech+Mono&display=swap');

  .sl-root *, .sl-root *::before, .sl-root *::after { box-sizing:border-box; margin:0; padding:0; }

  .sl-root {
    position:fixed; inset:0; z-index:9999;
    background:#060810; overflow:hidden;
    font-family:'Share Tech Mono',monospace;
  }

  .sl-bg {
    position:absolute; inset:0;
    background-image:var(--penseira-bg);
    background-size:cover; background-position:center;
    transition:transform 1.6s cubic-bezier(0.4,0,0.2,1),
               filter 1.6s cubic-bezier(0.4,0,0.2,1),
               opacity 1.6s ease;
  }
  .sl-bg.idle   { transform:scale(1); filter:brightness(0.75) saturate(1.1); opacity:1; }
  .sl-bg.portal { transform:scale(3.5) translateY(-8%); filter:brightness(2.5) saturate(2) blur(6px); opacity:0; }

  .sl-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(6,8,16,0.25) 0%,rgba(6,8,16,0.15) 40%,rgba(6,8,16,0.7) 100%);
  }

  .sl-glow {
    position:absolute; left:50%; top:52%;
    transform:translate(-50%,-50%);
    width:180px; height:180px; border-radius:50%;
    background:radial-gradient(circle,rgba(0,220,255,0.35) 0%,transparent 70%);
    animation:sl-pulse 2.4s ease-in-out infinite; pointer-events:none;
  }
  @keyframes sl-pulse {
    0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1)}
    50%    {opacity:1;  transform:translate(-50%,-50%) scale(1.18)}
  }

  .sl-splash {
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    align-items:center; justify-content:flex-end;
    padding-bottom:clamp(48px,10vh,96px);
    transition:opacity 0.5s ease;
  }
  .sl-splash.hidden{opacity:0;pointer-events:none}

  .sl-title {
    font-family:'Cinzel',serif;
    font-size:clamp(28px,7vw,52px);
    font-weight:700; letter-spacing:10px; color:#C9A84C;
    text-shadow:0 0 30px rgba(201,168,76,0.6),0 0 80px rgba(201,168,76,0.2);
    margin-bottom:8px; animation:sl-fadein 1.2s ease forwards;
  }
  .sl-subtitle {
    font-size:clamp(9px,2vw,11px); letter-spacing:4px;
    color:rgba(0,255,200,0.6);
    margin-bottom:clamp(28px,5vh,48px);
    animation:sl-fadein 1.6s ease forwards;
  }
  .sl-btn {
    position:relative; padding:14px 40px;
    background:transparent; border:1px solid rgba(201,168,76,0.5);
    border-radius:4px; color:#C9A84C;
    font-family:'Share Tech Mono',monospace;
    font-size:12px; letter-spacing:4px; cursor:pointer;
    overflow:hidden; transition:all 0.3s;
    animation:sl-fadein 2s ease forwards;
  }
  .sl-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,0.08),transparent);
    transform:translateX(-100%); transition:transform 0.5s;
  }
  .sl-btn:hover{border-color:#C9A84C;box-shadow:0 0 24px rgba(201,168,76,0.25)}
  .sl-btn:hover::before{transform:translateX(100%)}
  .sl-btn:active{transform:scale(0.97)}

  @keyframes sl-fadein {
    from{opacity:0;transform:translateY(16px)}
    to  {opacity:1;transform:translateY(0)}
  }

  /* ── PAINEL DE LOGIN/CADASTRO ── */
  .sl-login {
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    padding:24px; opacity:0; pointer-events:none;
    transition:opacity 0.8s ease 0.4s;
  }
  .sl-login.visible{opacity:1;pointer-events:all}

  .sl-login-bg {
    position:absolute; inset:0;
    background-image:var(--penseira-bg);
    background-size:cover; background-position:center;
    filter:blur(18px) brightness(0.4) saturate(0.8);
    transform:scale(1.06);
  }

  .sl-card {
    position:relative; width:100%; max-width:400px;
    background:rgba(12,15,26,0.88);
    border:1px solid rgba(201,168,76,0.25); border-radius:8px;
    padding:clamp(24px,5vw,40px);
    backdrop-filter:blur(2px);
    box-shadow:0 24px 64px rgba(0,0,0,0.6);
    max-height:90vh; overflow-y:auto;
  }

  .sl-card::before,.sl-card::after,.sl-corner-bl,.sl-corner-tr{
    content:''; position:absolute; width:10px; height:10px;
    border-color:rgba(201,168,76,0.5); border-style:solid;
  }
  .sl-card::before{top:6px;left:6px;border-width:1px 0 0 1px}
  .sl-card::after {top:6px;right:6px;border-width:1px 1px 0 0}
  .sl-corner-bl   {bottom:6px;left:6px;border-width:0 0 1px 1px}
  .sl-corner-tr   {bottom:6px;right:6px;border-width:0 1px 1px 0}

  .sl-card-top {
    position:absolute; top:0; left:20%; right:20%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(0,255,200,0.5),transparent);
  }

  .sl-logo{text-align:center;margin-bottom:20px}
  .sl-logo-title {
    font-family:'Cinzel',serif; font-size:clamp(18px,4vw,24px);
    font-weight:700; letter-spacing:6px; color:#C9A84C;
    text-shadow:0 0 20px rgba(201,168,76,0.4);
  }
  .sl-logo-sub{font-size:9px;letter-spacing:3px;color:rgba(0,255,200,0.5);margin-top:4px}

  /* Tabs login/cadastro */
  .sl-tabs{display:flex;gap:0;margin-bottom:20px;border-bottom:1px solid rgba(201,168,76,0.15)}
  .sl-tab{
    flex:1; padding:10px; text-align:center;
    font-family:'Share Tech Mono',monospace;
    font-size:10px; letter-spacing:2px; cursor:pointer;
    color:rgba(201,168,76,0.4); border-bottom:2px solid transparent;
    transition:all 0.2s; background:none; border-top:none; border-left:none; border-right:none;
  }
  .sl-tab.active{color:#C9A84C;border-bottom-color:#C9A84C}

  .sl-label{display:block;font-size:9px;letter-spacing:2px;color:rgba(0,255,200,0.5);margin-bottom:5px}
  .sl-input{
    width:100%; background:rgba(6,8,16,0.7);
    border:1px solid rgba(255,255,255,0.07); border-radius:4px;
    padding:11px 14px; color:#E8DFC8;
    font-family:'Share Tech Mono',monospace; font-size:13px;
    outline:none; transition:border-color 0.2s; margin-bottom:12px;
  }
  .sl-input:focus{border-color:rgba(201,168,76,0.5)}
  .sl-input::placeholder{color:rgba(100,106,130,0.6);font-size:11px;letter-spacing:1px}

  .sl-submit{
    width:100%; padding:12px;
    background:rgba(201,168,76,0.12);
    border:1px solid rgba(201,168,76,0.4); border-radius:4px;
    color:#C9A84C; font-family:'Share Tech Mono',monospace;
    font-size:11px; letter-spacing:3px; cursor:pointer;
    transition:all 0.2s; margin-top:4px;
  }
  .sl-submit:hover{background:rgba(201,168,76,0.2);box-shadow:0 0 20px rgba(201,168,76,0.2)}
  .sl-submit:active{transform:scale(0.98)}
  .sl-submit:disabled{opacity:0.5;cursor:not-allowed}

  .sl-divider{display:flex;align-items:center;gap:10px;margin:14px 0}
  .sl-divider span{flex:1;height:1px;background:rgba(201,168,76,0.12)}
  .sl-divider p{font-size:9px;color:rgba(201,168,76,0.35);letter-spacing:1px}

  .sl-google{
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.1); border-radius:4px;
    padding:11px; color:#E8DFC8;
    font-family:'Share Tech Mono',monospace;
    font-size:10px; letter-spacing:1px; cursor:pointer;
    transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .sl-google:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)}

  .sl-error{
    background:rgba(255,76,106,0.1); border:1px solid rgba(255,76,106,0.3);
    border-radius:4px; padding:10px 12px; margin-bottom:12px;
    font-size:11px; color:#FF4C6A; letter-spacing:0.5px; text-align:center;
  }

  .sl-success{
    background:rgba(0,255,200,0.08); border:1px solid rgba(0,255,200,0.25);
    border-radius:4px; padding:10px 12px; margin-bottom:12px;
    font-size:11px; color:rgba(0,255,200,0.8); letter-spacing:0.5px; text-align:center;
  }

  .sl-forgot{
    text-align:center; margin-top:12px;
    font-size:9px; letter-spacing:1px; color:rgba(201,168,76,0.4);
    cursor:pointer; background:none; border:none; width:100%;
  }
  .sl-forgot:hover{color:#C9A84C}

  .sl-footer{text-align:center;margin-top:16px;font-size:9px;letter-spacing:2px;color:rgba(68,72,96,0.6)}

  .sl-spinner{
    width:16px;height:16px;border:2px solid rgba(201,168,76,0.2);
    border-top-color:#C9A84C;border-radius:50%;
    animation:spin 0.8s linear infinite;display:inline-block;margin-right:8px;vertical-align:middle;
  }
  @keyframes spin{to{transform:rotate(360deg)}}

  .g-icon{
    width:18px;height:18px;border-radius:50%;flex-shrink:0;
    background:conic-gradient(#4285F4 90deg,#EA4335 90deg 180deg,#FBBC05 180deg 270deg,#34A853 270deg);
  }

  @media(max-width:480px){
    .sl-glow{width:120px;height:120px}
    .sl-card{padding:24px 18px}
  }
`

export default function SplashLogin({ bgImage }) {
  const [phase,     setPhase]     = useState('splash') // splash | portal | login
  const [tab,       setTab]       = useState('login')  // login | register | forgot
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [busy,      setBusy]      = useState(false)
  const [success,   setSuccess]   = useState('')

  const { loginEmail, registerEmail, loginGoogle, resetPassword, error, setError } = useAuth()

  const bg = bgImage || ''

  const handlePortal = () => {
    setPhase('portal')
    setTimeout(() => setPhase('login'), 1500)
  }

  const clearMessages = () => { setError(''); setSuccess('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages()
    setBusy(true)
    await loginEmail(email, password)
    setBusy(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    clearMessages()
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    if (!name.trim()) { setError('Digite seu nome.'); return }
    setBusy(true)
    await registerEmail(email, password, name)
    setBusy(false)
  }

  const handleGoogle = async () => {
    clearMessages()
    setBusy(true)
    await loginGoogle()
    setBusy(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!email) { setError('Digite seu email acima.'); return }
    setBusy(true)
    const ok = await resetPassword(email)
    if (ok) setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
    setBusy(false)
  }

  const bgStyle = bg ? { '--penseira-bg': `url(${bg})` } : { '--penseira-bg': 'none' }

  return (
    <>
      <style>{styles}</style>
      <div className="sl-root" style={bgStyle}>

        {/* Fundo + overlay + glow */}
        {bg && <div className={`sl-bg ${phase === 'portal' ? 'portal' : 'idle'}`} />}
        {bg && <div className="sl-overlay" />}
        <div className="sl-glow" />

        {/* Splash */}
        <div className={`sl-splash ${phase !== 'splash' ? 'hidden' : ''}`}>
          <div className="sl-title">PENSEIRA</div>
          <div className="sl-subtitle">// SISTEMA DE GESTÃO PESSOAL</div>
          <button className="sl-btn" onClick={handlePortal}>◈ &nbsp; ACESSAR PORTAL</button>
        </div>

        {/* Login / Cadastro */}
        <div className={`sl-login ${phase === 'login' ? 'visible' : ''}`}>
          {bg && <div className="sl-login-bg" />}
          <div className="sl-card">
            <div className="sl-card-top" />
            <div className="sl-corner-bl" />
            <div className="sl-corner-tr" />

            <div className="sl-logo">
              <div className="sl-logo-title">PENSEIRA</div>
              <div className="sl-logo-sub">// AUTENTICAÇÃO REQUERIDA</div>
            </div>

            {/* Tabs */}
            <div className="sl-tabs">
              <button className={`sl-tab ${tab==='login'?'active':''}`}    onClick={()=>{setTab('login');clearMessages()}}>ENTRAR</button>
              <button className={`sl-tab ${tab==='register'?'active':''}`} onClick={()=>{setTab('register');clearMessages()}}>CADASTRAR</button>
            </div>

            {/* Mensagens */}
            {error   && <div className="sl-error">{error}</div>}
            {success && <div className="sl-success">{success}</div>}

            {/* ── LOGIN ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin}>
                <label className="sl-label">IDENTIFICAÇÃO</label>
                <input className="sl-input" type="email" placeholder="usuario@email.com"
                  value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/>
                <label className="sl-label">CHAVE DE ACESSO</label>
                <input className="sl-input" type="password" placeholder="••••••••"
                  value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/>
                <button className="sl-submit" type="submit" disabled={busy}>
                  {busy ? <><span className="sl-spinner"/>AUTENTICANDO...</> : 'INICIAR SESSÃO'}
                </button>
                <button type="button" className="sl-forgot" onClick={handleForgot}>
                  Esqueci minha senha
                </button>
              </form>
            )}

            {/* ── CADASTRO ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister}>
                <label className="sl-label">NOME</label>
                <input className="sl-input" type="text" placeholder="Seu nome"
                  value={name} onChange={e=>setName(e.target.value)} required/>
                <label className="sl-label">EMAIL</label>
                <input className="sl-input" type="email" placeholder="usuario@email.com"
                  value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/>
                <label className="sl-label">SENHA</label>
                <input className="sl-input" type="password" placeholder="Mínimo 6 caracteres"
                  value={password} onChange={e=>setPassword(e.target.value)} required/>
                <label className="sl-label">CONFIRMAR SENHA</label>
                <input className="sl-input" type="password" placeholder="Repita a senha"
                  value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
                <button className="sl-submit" type="submit" disabled={busy}>
                  {busy ? <><span className="sl-spinner"/>CRIANDO CONTA...</> : 'CRIAR CONTA'}
                </button>
              </form>
            )}

            {/* Google — disponível nas duas abas */}
            <div className="sl-divider"><span/><p>OU</p><span/></div>
            <button className="sl-google" onClick={handleGoogle} disabled={busy}>
              <span className="g-icon"/>
              Continuar com Google
            </button>

            <div className="sl-footer">PENSEIRA · v1.0 · FIREBASE AUTH</div>
          </div>
        </div>
      </div>
    </>
  )
}
