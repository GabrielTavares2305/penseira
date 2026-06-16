// Configuração e inicialização do Firebase
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyAYLb4Dzm4ZoSd12UVJpAlU06od3H3Tz48",
  authDomain:        "penseira-6b020.firebaseapp.com",
  projectId:         "penseira-6b020",
  storageBucket:     "penseira-6b020.firebasestorage.app",
  messagingSenderId: "843159988540",
  appId:             "1:843159988540:web:9f5483a8e22fa7d3a49639"
}

const app = initializeApp(firebaseConfig)

export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const provider = new GoogleAuthProvider()
