<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  X,
  FileText,
  ClipboardCheck,
} from 'lucide-vue-next';
import EvaluationForm from './EvaluationForm.vue';
import { useRouter, useRoute } from 'vue-router';
import ApplicantDetailView from '@/components/recruiter-dashboard/interview/interview-room/ApplicantDetail.vue';
import interviewAPI from '@/api/interview'
import type { Interview } from '@/types/interview/interview';

const route = useRoute()

const props = defineProps<{
  interviewId: string;
}>();

const router = useRouter();
const activeTab = ref<'resume' | 'evaluation'>('resume');
const showEndModal = ref(false);

const resumeLoadForData = ref({
  jobPostingId: '',
  resumeId: ''
})

// 데이터 (실제로는 API에서 가져옴)
const interview = ref<Interview>({
  id: 0,
  name: '',
  startDateTime: '',
  duration: '',
  process: '',
  interviewType: {
    code: '',
    label: ''
  },
  location: '',
  interviewStatus: {
    code: '',
    label: ''
  },
  description: '',
  interviewers: []
});

// Computed
const statusClasses = computed(() => {
  switch (interview.value.status) {
    case 'in_progress':
      return 'bg-green-50 text-green-700';
    case 'completed':
      return 'bg-slate-100 text-slate-700';
    case 'scheduled':
      return 'bg-blue-50 text-blue-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
});

// Methods
const formatDateTime = (dateTime: string) => {
  const start = new Date(dateTime);

  // durationMinutes를 숫자로 변환 (string 들어올 수도 있으니까)
  const duration = Number(interview.value.duration) || 0;

  // 종료 시간 = 시작 + duration(분)
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const format = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return { yyyy, mm, dd, hh, mi };
  };

  const s = format(start);
  const e = format(end);

  return `${s.yyyy}.${s.mm}.${s.dd} ${s.hh}:${s.mi} - ${e.hh}:${e.mi}`;
};

// const handleSendMessage = (content: string) => {
//   const message: ChatMessage = {
//     id: Date.now().toString(),
//     userId: currentUser.value.id,
//     userName: currentUser.value.name,
//     content,
//     timestamp: new Date().toISOString(),
//     type: 'user',
//   };

//   chatMessages.value.push(message);

//   // WebSocket으로 메시지 전송
//   wsSendMessage({
//     type: 'chat.message',
//     data: {
//       interviewId: interview.value.id,
//       message,
//     },
//   });
// };

onMounted(async () => {

  const response = await interviewAPI.requestInterivew(Number(route.params.interviewId))
  if (response.success) {
    interview.value = response.results
  }
})
</script>
<template>
  <div class="bg-slate-50 h-screen overflow-hidden flex flex-col">
    <!-- 상단 헤더 -->
    <div class="bg-white border-b border-slate-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-xl font-bold text-slate-800">
              <!-- {{ interview.jobTitle }} -  -->
              {{ interview.name }}
            </h1>
            <p class="text-sm text-slate-600">
              {{ interview.duration }}분 · {{ formatDateTime(interview.startDateTime) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg" :class="statusClasses">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse">
            </div>
            <span class="text-sm font-medium">진행 중</span>
          </div>
          <!-- <button v-if="canEndInterview" @click="handleEndInterview"
            class="hover:cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
            <X class="w-4 h-4" />
            면접 종료
          </button> -->
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex h-[calc(100vh-73px)]">
      <!-- 왼쪽 패널 - 이력서/평가지 -->
      <div class="flex-1 bg-white border-r border-slate-200 flex flex-col">
        <!-- 탭 -->
        <div class="flex border-b border-slate-200">
          <div
            class="flex-1 px-6 py-3 font-medium flex items-center justify-center gap-2 text-slate-600 border-b-2 border-slate-600">
            <FileText class="w-4 h-4" />
            이력서
          </div>
          <div @click="activeTab = 'evaluation'"
            class="flex-1 px-6 py-3 font-medium flex items-center justify-center gap-2 text-slate-600 border-b-2 border-slate-600">
            <ClipboardCheck class="w-4 h-4" />
            평가지
          </div>
        </div>

        <!-- 이력서 탭 -->
        <div class="flex gap-5 overflow-hidden mb-5 p-4">
          <ApplicantDetailView class="flex-1 overflow-y-auto" />

          <div class="w-0.5 bg-slate-500"></div>

          <EvaluationForm class="flex-1 p-2 overflow-y-auto" />
        </div>
      </div>
    </div>
  </div>
</template>
