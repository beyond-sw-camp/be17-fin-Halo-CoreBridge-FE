// src/composables/notification/useNotificationSSE.ts
import { ref, onUnmounted } from 'vue'
import type { NotificationItem } from '../../types/notification/notification'

// ========== 설정 ==========
const SSE_URL = `/api/notifications/subscribe`
const LS_KEY = 'halo_notifications'
const MAX_ITEMS = 30
const SSE_TIMEOUT = 30 * 60 * 1000 // 30분
const RECONNECT_DELAY_MIN = 1000 // 1초
const RECONNECT_DELAY_MAX = 30000 // 30초
const HEARTBEAT_TIMEOUT = 45000 // 45초로 연장 (백엔드 10초 + 여유 35초)

// ========== LocalStorage 유틸 ==========
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
  } catch (err) {
    console.warn('LocalStorage 저장 실패:', err)
  }
}

// ========== 싱글톤 SSE 관리 ==========
let es: EventSource | null = null
let reconnectTimer: number | null = null
let heartbeatTimer: number | null = null
let retryDelay = RECONNECT_DELAY_MIN
let isManualClose = false
let heartbeatCount = 0 // heartbeat 수신 카운트

export function useNotificationSSE() {
  const isConnected = ref(false)
  const notifications = ref<NotificationItem[]>(loadFromStorage())
  const lastHeartbeat = ref<Date | null>(null)

  // ========== 타입 매핑 ==========
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

  // ========== 알림 추가 ==========
  function pushNotificationFromPayload(payload: any) {
    console.log('📩 알림 수신:', payload)

    const noti: NotificationItem = {
      id: payload?.id ?? Date.now() + Math.floor(Math.random() * 1000),
      type: mapTypeToFrontend(payload?.type),
      title: payload?.title ?? '알림',
      message: payload?.message ?? '',
      timestamp: payload?.timestamp 
        ? new Date(payload.timestamp).toISOString() 
        : new Date().toISOString(),
      read: false,
      jobTitle: payload?.jobTitle,
      link: payload?.link,
      action: payload?.link ? { label: '바로가기', type: 'open_link' } : undefined
    }

    // 중복 제거 키 생성
    const keyOf = (n: NotificationItem) => `${n.title}__${n.message}__${n.timestamp}`
    
    // 새 알림을 맨 앞에 추가
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

    // 최신순 정렬
    deduped.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    notifications.value = deduped
    saveToStorage(deduped)

    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(noti.title, {
        body: noti.message,
        icon: '/favicon.ico'
      })
    }
  }

  // ========== Heartbeat 타이머 리셋 ==========
  function resetHeartbeatTimer() {
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer)
    }
    
    lastHeartbeat.value = new Date()
    heartbeatCount++
    
    console.log(`💓 Heartbeat 타이머 리셋 (수신 횟수: ${heartbeatCount})`)
    
    // 45초 동안 heartbeat 없으면 재연결
    heartbeatTimer = window.setTimeout(() => {
      const elapsed = lastHeartbeat.value 
        ? Math.floor((Date.now() - lastHeartbeat.value.getTime()) / 1000)
        : 0
      console.warn(`⚠️ Heartbeat 타임아웃 (${elapsed}초 경과) - 재연결 시작`)
      isConnected.value = false
      close()
      scheduleReconnect()
    }, HEARTBEAT_TIMEOUT)
  }

  // ========== SSE 연결 ==========
  function connect() {
    // 이미 연결되어 있으면 중복 연결 방지
    if (es && es.readyState === EventSource.OPEN) {
      console.log('⚠️ 이미 SSE 연결이 활성화되어 있습니다')
      return
    }

    isManualClose = false
    clearReconnectTimer()
    heartbeatCount = 0 // 카운트 초기화

    try {
      console.log('🔌 SSE 연결 시도:', SSE_URL)
      es = new EventSource(SSE_URL, { withCredentials: true })

      // ===== 연결 성공 =====
      es.onopen = () => {
        console.log('✅ SSE 연결 성공 (onopen)')
        isConnected.value = true
        retryDelay = RECONNECT_DELAY_MIN
        resetHeartbeatTimer()
      }

      // ===== 일반 메시지 (onmessage) =====
      es.onmessage = (e: MessageEvent) => {
        console.log('📨 SSE onmessage:', e.data, 'lastEventId:', e.lastEventId)
        
        if (!e?.data) return
        
        try {
          const data = JSON.parse(e.data)
          
          // 연결 확인 메시지는 무시
          if (data === 'ok' || e.lastEventId === 'connected') {
            console.log('🔗 SSE 연결 확인 메시지 (onmessage)')
            resetHeartbeatTimer()
            return
          }
          
          pushNotificationFromPayload(data)
          resetHeartbeatTimer()
        } catch (err) {
          console.warn('메시지 파싱 실패:', e.data, err)
        }
      }

      // ===== 'notification' 이벤트 =====
      es.addEventListener('notification', (e: MessageEvent) => {
        console.log('📬 notification 이벤트:', e.data)
        
        if (!e?.data) return
        
        try {
          const data = JSON.parse(e.data)
          pushNotificationFromPayload(data)
          resetHeartbeatTimer()
        } catch (err) {
          console.warn('notification 이벤트 파싱 실패:', e.data, err)
        }
      })

      // ===== 'heartbeat' 이벤트 =====
      es.addEventListener('heartbeat', (e: MessageEvent) => {
        console.log('💓 Heartbeat 수신:', e.data)
        resetHeartbeatTimer()
      })

      // ===== 'connected' 이벤트 =====
      es.addEventListener('connected', (e: MessageEvent) => {
        console.log('🔗 SSE 연결 확인 이벤트:', e.data)
        isConnected.value = true
        resetHeartbeatTimer()
      })

      // ===== 에러 처리 =====
      es.onerror = (err) => {
        console.error('❌ SSE 에러:', err)
        console.log('EventSource readyState:', es?.readyState)
        console.log('- CONNECTING (0):', EventSource.CONNECTING)
        console.log('- OPEN (1):', EventSource.OPEN)
        console.log('- CLOSED (2):', EventSource.CLOSED)
        
        isConnected.value = false
        
        // EventSource의 readyState 확인
        if (es) {
          if (es.readyState === EventSource.CLOSED) {
            console.log('🔴 SSE 연결 완전히 종료 - 재연결 예정')
            close()
            if (!isManualClose) {
              scheduleReconnect()
            }
          } else if (es.readyState === EventSource.CONNECTING) {
            console.log('🟡 SSE 재연결 시도 중...')
            // EventSource가 자동으로 재연결 시도 중
          }
        }
      }

    } catch (err) {
      console.error('❌ SSE 초기화 실패:', err)
      isConnected.value = false
      if (!isManualClose) {
        scheduleReconnect()
      }
    }
  }

  // ========== SSE 종료 ==========
  function close() {
    isManualClose = true
    
    if (es) {
      es.close()
      es = null
      console.log('🔌 SSE 연결 종료')
    }
    
    clearReconnectTimer()
    clearHeartbeatTimer()
    isConnected.value = false
  }

  // ========== 타이머 정리 ==========
  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function clearHeartbeatTimer() {
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // ========== 재연결 스케줄링 ==========
  function scheduleReconnect() {
    if (isManualClose) return
    if (reconnectTimer) return // 이미 재연결 예정

    console.log(`⏱️ ${retryDelay / 1000}초 후 재연결 시도... (총 수신 heartbeat: ${heartbeatCount}회)`)
    
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null
      retryDelay = Math.min(retryDelay * 2, RECONNECT_DELAY_MAX)
      connect()
    }, retryDelay)
  }

  // ========== 알림 권한 요청 ==========
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('알림 권한:', permission)
      })
    }
  }

  // ========== 수동 데이터 새로고침 ==========
  function refreshNotifications() {
    notifications.value = loadFromStorage()
  }

  // ========== 상태 조회 ==========
  function getDebugInfo() {
    return {
      isConnected: isConnected.value,
      readyState: es?.readyState,
      lastHeartbeat: lastHeartbeat.value,
      heartbeatCount,
      retryDelay,
      notificationCount: notifications.value.length
    }
  }

  // ========== 컴포넌트 언마운트 시 정리 ==========
  onUnmounted(() => {
    close()
  })

  return {
    // State
    isConnected,
    notifications,
    lastHeartbeat,

    // Methods
    connect,
    close,
    requestNotificationPermission,
    refreshNotifications,
    getDebugInfo,
  }
}
