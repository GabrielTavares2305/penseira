// Hook para sincronizar dados do usuário com o Firestore
// Cada usuário tem sua própria subcoleção isolada
import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useFirestoreData(uid, key, defaultValue) {
  const [data,    setData]    = useState(defaultValue)
  const [synced,  setSynced]  = useState(false)

  // Escuta mudanças em tempo real no Firestore
  useEffect(() => {
    if (!uid) return
    const ref  = doc(db, 'users', uid, 'data', key)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data().value ?? defaultValue)
      } else {
        setData(defaultValue)
      }
      setSynced(true)
    })
    return unsub
  }, [uid, key])

  // Salva no Firestore
  const save = useCallback(async (value) => {
    if (!uid) return
    const newValue = typeof value === 'function' ? value(data) : value
    setData(newValue) // atualiza local imediatamente
    try {
      const ref = doc(db, 'users', uid, 'data', key)
      await setDoc(ref, { value: newValue }, { merge: true })
    } catch (e) {
      console.error('Firestore save error:', e)
    }
  }, [uid, key, data])

  return [data, save, synced]
}
