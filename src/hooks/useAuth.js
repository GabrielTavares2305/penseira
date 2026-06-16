// Hook central de autenticação Firebase
import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, provider } from '../firebase'

export function useAuth() {
  const [user,    setUser]    = useState(undefined) // undefined = carregando
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // Observa mudanças de autenticação em tempo real
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Busca perfil extra do Firestore
        const ref  = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        setUser({ ...firebaseUser, profile: snap.exists() ? snap.data() : null })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // Cria perfil do usuário no Firestore na primeira vez
  const createProfile = async (uid, data) => {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        theme: 'stark-gold', // padrão
      })
    }
  }

  // Login com email/senha
  const loginEmail = async (email, password) => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (e) {
      setError(friendlyError(e.code))
      return false
    }
  }

  // Cadastro com email/senha
  const registerEmail = async (email, password, name) => {
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      await createProfile(cred.user.uid, { name, email, onboardingDone: false })
      return true
    } catch (e) {
      setError(friendlyError(e.code))
      return false
    }
  }

  // Login com Google
  const loginGoogle = async () => {
    setError('')
    try {
      const cred = await signInWithPopup(auth, provider)
      await createProfile(cred.user.uid, {
        name:  cred.user.displayName,
        email: cred.user.email,
        photo: cred.user.photoURL,
        onboardingDone: false,
      })
      return true
    } catch (e) {
      setError(friendlyError(e.code))
      return false
    }
  }

  // Recuperar senha
  const resetPassword = async (email) => {
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (e) {
      setError(friendlyError(e.code))
      return false
    }
  }

  const logout = () => signOut(auth)

  return { user, loading, error, setError, loginEmail, registerEmail, loginGoogle, resetPassword, logout }
}

// Traduz códigos de erro do Firebase para português
function friendlyError(code) {
  const map = {
    'auth/user-not-found':       'Usuário não encontrado.',
    'auth/wrong-password':       'Senha incorreta.',
    'auth/invalid-credential':   'Email ou senha inválidos.',
    'auth/email-already-in-use': 'Este email já está cadastrado.',
    'auth/weak-password':        'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/invalid-email':        'Email inválido.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  }
  return map[code] || 'Erro ao autenticar. Tente novamente.'
}
