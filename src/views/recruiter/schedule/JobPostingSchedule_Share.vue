<template>
  <!-- 공고 공유 모달 (JobPostingSchedule용) -->
  <div v-if="showModal" class="fixed inset-0  backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Share2 class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">공고 공유</h2>
            <p class="text-sm text-gray-500">팀원들과 채용 공고를 공유하세요</p>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- 공유할 공고 선택 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-semibold text-gray-700">공유할 공고 선택</label>
            <div class="flex gap-2">
              <button @click="selectAllJobs" class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                전체 선택
              </button>
              <span class="text-gray-300">|</span>
              <button @click="selectUrgentJobs" class="text-xs text-orange-600 hover:text-orange-700 font-medium">
                긴급 공고만
              </button>
              <span class="text-gray-300">|</span>
              <button @click="clearAllJobs" class="text-xs text-gray-600 hover:text-gray-700 font-medium">
                선택 해제
              </button>
            </div>
          </div>
          <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
            <div 
              v-for="job in availableJobs" 
              :key="job.id" 
              class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition cursor-pointer" 
              @click="toggleJob(job.id)"
            >
              <input 
                type="checkbox" 
                :checked="selectedJobs.includes(job.id)" 
                class="w-4 h-4 text-blue-600 rounded" 
                @click.stop 
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-sm text-gray-900 truncate">{{ job.title }}</p>
                  <span 
                    v-if="job.isUrgent" 
                    class="px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded flex-shrink-0"
                  >
                    긴급
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span>{{ job.department }}</span>
                  <span>·</span>
                  <span>{{ job.experience }}</span>
                  <span>·</span>
                  <span :class="job.daysLeft <= 7 ? 'text-red-600 font-semibold' : ''">
                    마감 D-{{ job.daysLeft }}
                  </span>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs text-gray-500">지원자</p>
                <p class="text-sm font-bold text-blue-600">{{ job.applicants }}명</p>
              </div>
            </div>
            <p v-if="availableJobs.length === 0" class="text-center text-sm text-gray-500 py-4">
              공유 가능한 공고가 없습니다
            </p>
          </div>
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-gray-500">
              {{ selectedJobs.length }}개의 공고가 선택되었습니다
            </p>
            <p v-if="urgentJobsCount > 0" class="text-xs text-orange-600 font-medium">
              긴급 공고 {{ urgentJobsCount }}건 포함
            </p>
          </div>
        </div>

        <!-- 공유 대상 선택 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-semibold text-gray-700">공유 대상 선택</label>
            <div class="flex gap-2">
              <button @click="selectAllMembers" class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                전체 선택
              </button>
              <span class="text-gray-300">|</span>
              <button @click="clearAllMembers" class="text-xs text-gray-600 hover:text-gray-700 font-medium">
                선택 해제
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div 
              v-for="member in teamMembers" 
              :key="member.id" 
              class="flex items-center gap-3 p-3 border-2 rounded-lg transition cursor-pointer" 
              :class="selectedMembers.includes(member.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'" 
              @click="toggleMember(member.id)"
            >
              <input 
                type="checkbox" 
                :checked="selectedMembers.includes(member.id)" 
                class="w-4 h-4 text-blue-600 rounded" 
                @click.stop 
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900">{{ member.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ member.role }} · {{ member.department }}</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {{ selectedMembers.length }}명이 선택되었습니다
          </p>
        </div>

        <!-- 권한 설정 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">공유 권한</label>
          <div class="space-y-2">
            <label 
              class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition" 
              :class="shareSettings.permission === 'view' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <input 
                v-model="shareSettings.permission" 
                type="radio" 
                value="view" 
                class="w-4 h-4 text-blue-600" 
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">보기 전용</p>
                <p class="text-xs text-gray-500">공고 내용만 확인할 수 있습니다</p>
              </div>
              <Eye class="w-5 h-5 text-gray-400" />
            </label>
            <label 
              class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition" 
              :class="shareSettings.permission === 'edit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'"
            >
              <input 
                v-model="shareSettings.permission" 
                type="radio" 
                value="edit" 
                class="w-4 h-4 text-blue-600" 
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">편집 가능</p>
                <p class="text-xs text-gray-500">공고를 수정하고 지원자를 관리할 수 있습니다</p>
              </div>
              <Edit class="w-5 h-5 text-gray-400" />
            </label>
          </div>
        </div>

        <!-- 알림 설정 -->
        <div>
          <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input 
              v-model="shareSettings.sendNotification" 
              type="checkbox" 
              class="w-5 h-5 text-blue-600 rounded" 
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900">알림 보내기</p>
              <p class="text-sm text-gray-500">공유 대상에게 이메일 알림을 전송합니다</p>
            </div>
            <Mail class="w-5 h-5 text-gray-400" />
          </label>
        </div>

        <!-- 메시지 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            메시지 (선택사항)
          </label>
          <textarea 
            v-model="shareSettings.message" 
            rows="3" 
            placeholder="공고 공유와 함께 전달할 메시지를 입력하세요..." 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ shareSettings.message.length }}/500 자
          </p>
        </div>

        <!-- 공유 요약 -->
        <div v-if="selectedJobs.length > 0 && selectedMembers.length > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-900 mb-1">공유 요약</p>
              <p class="text-xs text-blue-700 leading-relaxed">
                <strong>{{ selectedJobs.length }}개</strong>의 공고를 
                <strong>{{ selectedMembers.length }}명</strong>에게 
                <strong>{{ shareSettings.permission === 'view' ? '보기 전용' : '편집 가능' }}</strong> 권한으로 공유합니다.
                <span v-if="urgentJobsCount > 0" class="block mt-1 text-orange-700 font-semibold">
                  ⚠️ 긴급 공고 {{ urgentJobsCount }}건이 포함되어 있습니다.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-xl">
        <button 
          @click="closeModal" 
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition"
        >
          취소
        </button>
        <button 
          @click="confirmShare" 
          :disabled="!canShare" 
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2',
            canShare ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          <Share2 class="w-4 h-4" />
          {{ selectedJobs.length }}건 공고를 {{ selectedMembers.length }}명에게 공유
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Share2, X, Mail, Eye, Edit, Info } from 'lucide-vue-next'

// Props
interface Job {
  id: number
  title: string
  department: string
  experience: string
  daysLeft: number
  applicants: number
  isUrgent?: boolean
}

interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

interface Props {
  showModal?: boolean
  availableJobs?: Job[]
  teamMembers?: TeamMember[]
  initialSelectedMembers?: number[] 
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  availableJobs: () => [],
  teamMembers: () => [],
  initialSelectedMembers: () => []
})

// Emits
const emit = defineEmits<{
  'close': []
  'confirm': [{
    members: number[]
    jobs: number[]
    settings: {
      permission: string
      sendNotification: boolean
      message: string
    }
  }]
}>()

// State
const selectedMembers = ref<number[]>([...props.initialSelectedMembers])
const selectedJobs = ref<number[]>([])
const shareSettings = ref({
  permission: 'view',
  sendNotification: true,
  message: ''
})

// Computed
const canShare = computed(() => {
  return selectedMembers.value.length > 0 && selectedJobs.value.length > 0
})

const urgentJobsCount = computed(() => {
  return props.availableJobs.filter(job => 
    job.isUrgent && selectedJobs.value.includes(job.id)
  ).length
})

// Methods
const toggleMember = (memberId: number) => {
  const index = selectedMembers.value.indexOf(memberId)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(memberId)
  }
}

const selectAllMembers = () => {
  selectedMembers.value = props.teamMembers.map(m => m.id)
}

const clearAllMembers = () => {
  selectedMembers.value = []
}

const toggleJob = (jobId: number) => {
  const index = selectedJobs.value.indexOf(jobId)
  if (index > -1) {
    selectedJobs.value.splice(index, 1)
  } else {
    selectedJobs.value.push(jobId)
  }
}

const selectAllJobs = () => {
  selectedJobs.value = props.availableJobs.map(j => j.id)
}

const selectUrgentJobs = () => {
  selectedJobs.value = props.availableJobs
    .filter(j => j.isUrgent)
    .map(j => j.id)
}

const clearAllJobs = () => {
  selectedJobs.value = []
}

const closeModal = () => {
  emit('close')
  resetState()
}

const confirmShare = () => {
  if (!canShare.value) return
  
  emit('confirm', {
    members: selectedMembers.value,
    jobs: selectedJobs.value,
    settings: { ...shareSettings.value }
  })
  
  resetState()
}

const resetState = () => {
  selectedMembers.value = []
  selectedJobs.value = []
  shareSettings.value = {
    permission: 'view',
    sendNotification: true,
    message: ''
  }
}

watch(
  () => props.initialSelectedMembers,
  (newVal) => {
    selectedMembers.value = [...newVal]  // ✅ 기존 공유된 사람 체크
  },
  { immediate: true } // 열리자마자 적용
)

</script>
