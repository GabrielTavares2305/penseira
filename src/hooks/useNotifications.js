// Hook para gerenciar notificações de lembrete de estudo
// Usa a Web Notifications API com fallback seguro para iOS/Safari
import { useState } from 'react'

// Verifica se o navegador suporta notificações de forma segura
const isSupported = () => typeof window !== 'undefined' && 'Notification' in window

export function useNotifications() {
  const [permission, setPermission] = useState(() => {
    if (!isSupported()) return 'denied'
    return Notification.permission
  })

  const requestPermission = async () => {
    if (!isSupported()) return 'denied'
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch {
      return 'denied'
    }
  }

  const sendNotification = (title, body) => {
    if (!isSupported() || permission !== 'granted') return
    try {
      new Notification(title, { body, icon: '/penseira/favicon.ico' })
    } catch {
      // silencia erro no iOS
    }
  }

  const scheduleReminder = (reminders) => {
    if (!isSupported() || permission !== 'granted') return
    try {
      const now   = new Date()
      const hhmm  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      reminders.forEach(r => {
        if (r.active && r.time === hhmm) {
          sendNotification('⏰ Hora de estudar!', r.message || 'Sua sessão de estudos está te esperando na Penseira.')
        }
      })
    } catch {
      // silencia erro no iOS
    }
  }

  return { permission, requestPermission, sendNotification, scheduleReminder }
}
