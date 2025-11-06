// src/composables/notification/useNotificationSSE.ts
import { ref } from 'vue'
import type { NotificationItem } from '../../types/notification/notification'

// 설정
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const SSE_URL = `/api/notifications/subscribe`
const LS_KEY = 'halo_notifications'
const MAX_ITEMS = 30

// LocalStorage 유틸
function loadFromStorage(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const arr: NotificationItem[] = JSON.parse(raw)
    return Array.isArray(arr) ? arr.slice(0, MAX_ITEMS) : []
  } catch {
    return []
  }
}

function saveToStorage(list: NotificationItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
  } catch {
    // quota 등으로 실패하면 무시
  }
}

// SSE + 상태
let es: EventSource | null = null
let reconnectTimer: number | null = null
let retryDelay = 3000 // 3초부터 시작, 최대 30초

export function useNotificationSSE() {
  const isConnected = ref(false)
  const notifications = ref<NotificationItem[]>(loadFromStorage())

  function mapTypeToFrontend(type?: string): NotificationItem['type'] {
    const t = (type ?? '').toLowerCase()
    if (t.includes('system')) return 'system'
    if (t.includes('update')) return 'update'
    if (t.includes('interview')) return 'interview'
    if (t.includes('deadline')) return 'deadline'
    if (t.includes('application') || t.includes('applicant')) return 'application'
    if (t.includes('success') || t.includes('ok')) return 'success'
    return 'update'
  }

  function pushNotificationFromPayload(payload: any) {
    const noti: NotificationItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: mapTypeToFrontend(payload?.type),
      title: payload?.title ?? '알림',
      message: payload?.message ?? '',
      timestamp: payload?.timestamp ?? new Date().toISOString(),
      read: false,
      jobTitle: payload?.jobTitle,
      link: payload?.link,
      action: payload?.link ? { label: '바로가기', type: 'open_link' } : undefined
    }

    // 앞에 붙이고 → 중복 제거(제목/메시지/시간) → 30개 제한 → 최신순 정렬
    const keyOf = (n: NotificationItem) => `${n.title}__${n.message}__${n.timestamp}`
    const current = [noti, ...notifications.value]
    const seen = new Set<string>()
    const deduped: NotificationItem[] = []
    for (const n of current) {
      const k = keyOf(n)
      if (!seen.has(k)) {
        seen.add(k)
        deduped.push(n)
      }
      if (deduped.length >= MAX_ITEMS) break
    }
    deduped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    notifications.value = deduped
    saveToStorage(deduped)
  }

  function connect() {
    try {
      console.log('🔌 SSE 연결 시도:', SSE_URL)
      es = new (window as any).EventSource(SSE_URL, { withCredentials: true })

      es.onopen = () => {
        console.log('✅ SSE 연결 성공')
        isConnected.value = true
        retryDelay = 3000
      }

      es.onmessage = (e: MessageEvent) => {
        if (!e?.data) return
        try {
          const data = JSON.parse(e.data)
          pushNotificationFromPayload(data)
        } catch {
          pushNotificationFromPayload({ title: '알림', message: String(e.data), type: 'UPDATE' })
        }
      }

      es.addEventListener('notification', (e: MessageEvent) => {
        if (!e?.data) return
        try {
          const data = JSON.parse(e.data)
          pushNotificationFromPayload(data)
        } catch {
          pushNotificationFromPayload({ title: '알림', message: String(e.data), type: 'UPDATE' })
        }
      })

      es.onerror = () => {
        console.warn('⚠️ SSE 끊김 → 재연결 예정')
        isConnected.value = false
        close()
        scheduleReconnect()
      }
    } catch (err) {
      console.error('SSE 초기화 실패:', err)
      scheduleReconnect()
    }
  }

  function close() {
    if (es) {
      es.close()
      es = null
      console.log('🔌 SSE 연결 종료')
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function scheduleReconnect() {
    if (reconnectTimer) return
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null
      retryDelay = Math.min(retryDelay * 2, 30000) // 최대 30초
      connect()
    }, retryDelay)
  }

  return {
    // state
    isConnected,
    notifications,

    // methods
    connect,
    close,
  }
}
