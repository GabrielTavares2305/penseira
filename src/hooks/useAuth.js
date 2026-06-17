// Hook central de autenticação Firebase
import { useState, useEffect, useRef } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db, provider } from '../firebase'

export function useAuth() {
  const [user,    setUser]    = useState(undefined) // undefined = carregando
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const profileUnsubRef = useRef(null)

  // Observa mudanças de autenticação + perfil em TEMPO REAL
  // Isso garante que mudanças feitas em um dispositivo (ex: ativar Moodboard
  // no desktop) aparecem automaticamente em todos os outros (ex: celular),
  // sem precisar fazer logout/login de novo.
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Cancela qualquer listener de perfil anterior
      if (profileUnsubRef.current) {
        profileUnsubRef.current()
        profileUnsubRef.current = null
      }

      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        // onSnapshot escuta mudanças no documento em tempo real
        const unsubProfile = onSnapshot(ref, (snap) => {
          setUser(prev => ({
            ...firebaseUser,
            profile: snap.exists() ? snap.data() : null,
          }))
          setLoading(false)
        }, () => setLoading(false))
        profileUnsubRef.current = unsubProfile
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      unsubAuth()
      if (profileUnsubRef.current) profileUnsubRef.current()
    }
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
