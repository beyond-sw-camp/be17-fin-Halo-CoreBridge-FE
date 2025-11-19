<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { MessageSquare, Send } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import interviewAPI from '@/api/interview'

const route = useRoute()

// ==========================
// 내부 상태 (Props 제거)
// ==========================
const messages = ref<any[]>([])
const interviewers = ref<any[]>([])
const currentUser = ref<any>({ id: '', name: '' })

// 입력창
const messageInput = ref('')
const messageContainer = ref<HTMLElement | null>(null)

// WebSocket client
const client = ref<any>(null)

// ==========================
// 도우미 함수
// ==========================
// const getInitial = (name: string) => name.charAt(0)

// const getAvatarColor = (index: number) => {
//   const colors = ['bg-slate-400', 'bg-slate-500', 'bg-slate-600']
//   return colors[index % colors.length]
// }

// const getMessageAvatarColor = (userId: string) => {
//   if (userId === currentUser.value.id) return 'bg-slate-600'
//   const idx = interviewers.value.findIndex((i) => i.id === userId)
//   return getAvatarColor(idx)
// }

// const formatTime = (ts: string) => {
//   const d = new Date(ts)
//   return `${String(d.getHours()).padStart(2, '0')}:${String(
//     d.getMinutes()
//   ).padStart(2, '0')}`
// }

// const scrollToBottom = () => {
//   nextTick(() => {
//     if (messageContainer.value) {
//       messageContainer.value.scrollTop = messageContainer.value.scrollHeight
//     }
//   })
// }

// watch(() => messages.value.length, scrollToBottom)

// ==========================
// WebSocket 보내기
// ==========================
// const sendChatMessage = (content: string) => {
//   if (!client.value || !client.value.connected) {
//     console.warn('WebSocket 연결 안됨')
//     return
//   }

//   const msg = {
//     id: crypto.randomUUID(),
//     userId: currentUser.value.id,
//     userName: currentUser.value.name,
//     content,
//     timestamp: new Date().toISOString(),
//     type: 'user'
//   }

//   client.value.send(
//     `/app/chat/${route.params.interviewId}`,
//     {},
//     JSON.stringify(msg)
//   )

//   messages.value.push(msg)
// }

// ==========================
// 메시지 보내기 핸들러
// ==========================
// const handleSendMessage = (e?: KeyboardEvent) => {
//   if (e && e.shiftKey) return
//   if (e) e.preventDefault()

//   const content = messageInput.value.trim()
//   if (!content) return

//   sendChatMessage(content)
//   messageInput.value = ''
// }

// ==========================
// WebSocket 연결
// ==========================
// const connectWebSocket = () => {
//   const socket = new WebSocket('hws://localhost:8080/ws')
//   const stomp = Stomp.over(socket)
//   stomp.debug = () => { }

//   client.value = stomp

//   stomp.connect(
//     {},
//     () => {
//       stomp.subscribe(`/topic/chat/${route.params.interviewId}`, (msg: any) => {
//         messages.value.push(JSON.parse(msg.body))
//       })
//     },
//     (err: any) => {
//       console.error('WebSocket ERROR:', err)
//     }
//   )
// }

// ==========================
// 초기 데이터 로딩
// ==========================
// const loadInterviewData = async () => {
//   const interviewId = Number(route.params.interviewId)
//   const res = await interviewAPI.requestInterivew(interviewId)

//   if (res.success) {
//     // 면접관 목록
//     interviewers.value = res.results.interviewers.map((i: any) => ({
//       id: String(i.id),
//       name: i.name
//     }))

//     // 로그인 유저 정보
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
//     currentUser.value = {
//       id: String(userInfo.id),
//       name: userInfo.name
//     }
//   }
// }

// ==========================
// Mount / Unmount
// ==========================
// onMounted(async () => {
//   await loadInterviewData()
//   connectWebSocket()
// })

// onUnmounted(() => {
//   if (client.value) client.value.disconnect()
// })

// const chatMessages = ref<ChatMessage[]>([
//   {
//     id: '1',
//     userId: 'system',
//     userName: 'System',
//     content: '면접이 시작되었습니다',
//     timestamp: new Date().toISOString(),
//     type: 'system',
//   },
// ]);

// const interviewers = ref<Interviewer[]>([
//   { id: '1', name: '박민준' },
//   { id: '2', name: '이서연' },
//   { id: '3', name: '최현우' },
// ]);

// const currentUser = ref({
//   id: 'current',
//   name: '나',
// });

</script>
<template>
  <!-- <div class="flex flex-col h-full"> -->
  <!-- 헤더 -->
  <!-- <div class="px-4 py-3 border-b border-slate-200">
      <h3 class="font-semibold text-slate-800 flex items-center gap-2">
        <MessageSquare class="w-5 h-5" />
        면접관 채팅
      </h3>
      <p class="text-sm text-slate-600 mt-1">
        참여 면접관 {{ interviewers.length }}명
      </p>
    </div> -->

  <!-- 면접관 목록 -->
  <!-- <div class="px-4 py-3 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <div class="flex -space-x-2">
          <div v-for="(interviewer, index) in interviewers.slice(0, 3)" :key="interviewer.id"
            class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
            :class="getAvatarColor(index)">
            {{ getInitial(interviewer.name) }}
          </div>
        </div>
        <span class="text-sm text-slate-600">
          {{interviewers.map(i => i.name).join(', ')}}
        </span>
      </div>
    </div> -->

  <!-- 메시지 영역 -->
  <!-- <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="m in messages" :key="m.id">
        <div v-if="m.type === 'system'" class="text-center">
          <span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {{ m.content }}
          </span>
        </div>

        <div v-else class="flex items-start gap-2" :class="m.userId === currentUser.id ? 'flex-row-reverse' : ''">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
            :class="getMessageAvatarColor(m.userId)">
            {{ getInitial(m.userName) }}
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1" :class="m.userId === currentUser.id ? 'flex-row-reverse' : ''">
              <span class="text-sm font-medium text-slate-800">{{ m.userName }}</span>
              <span class="text-xs text-slate-500">{{ formatTime(m.timestamp) }}</span>
            </div>

            <div class="rounded-lg px-3 py-2 text-sm" :class="m.userId === currentUser.id
              ? 'bg-slate-600 text-white ml-auto max-w-fit'
              : 'bg-slate-100 text-slate-800'">
              {{ m.content }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

  <!-- 입력창 -->
  <!-- <div class="p-4 border-t border-slate-200">
      <div class="flex items-end gap-2">
        <textarea v-model="messageInput" @keydown.enter.exact="handleSendMessage" @keydown.enter.shift.prevent rows="2"
          class="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="메시지를 입력하세요..." />
        <button @click="handleSendMessage" :disabled="!messageInput.trim()"
          class="bg-slate-600 text-white p-2 rounded-lg disabled:bg-slate-300">
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div> -->
</template>
