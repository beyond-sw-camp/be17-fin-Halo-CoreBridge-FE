<template>
  <!-- 공고 생성/수정 모달 (JobPostingSchedule용) -->
  <div v-if="showModal" class="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
            <Briefcase class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ editingId ? '공고 수정' : '새 공고 등록' }}
            </h2>
            <p class="text-sm text-gray-500">채용 공고 정보를 입력하세요</p>
          </div>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div v-if="formData.postedDate && formData.deadline" class="m-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center gap-2 text-sm text-blue-700">
          <CalendarDays class="w-4 h-4" />
          <span class="font-semibold">선택된 기간:</span>
          <span>{{ formData.postedDate }}</span>
          <span v-if="formData.postedDate !== formData.deadline">~ {{ formData.deadline }}</span>
          <span class="ml-2 px-2 py-0.5 bg-blue-200 rounded-full text-xs font-bold">{{ getDaysDifference() }}일</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 왼쪽 컬럼: 기본 정보 -->
          <div class="space-y-5">
            <!-- 공고 제목 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 제목 <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.title" 
                type="text" 
                placeholder="예: 프론트엔드 개발자 채용" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              />
            </div>

            <!-- 직무/포지션 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                직무 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.position" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">직무를 선택하세요</option>
                <option value="frontend">프론트엔드 개발자</option>
                <option value="backend">백엔드 개발자</option>
                <option value="fullstack">풀스택 개발자</option>
                <option value="mobile">모바일 개발자</option>
                <option value="devops">DevOps 엔지니어</option>
                <option value="designer">UI/UX 디자이너</option>
                <option value="pm">프로덕트 매니저</option>
                <option value="marketing">마케팅 매니저</option>
                <option value="sales">영업 담당자</option>
                <option value="hr">인사 담당자</option>
              </select>
            </div>

            <!-- 부서 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                부서 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.department" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">부서를 선택하세요</option>
                <option value="개발팀">개발팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="프로덕트팀">프로덕트팀</option>
                <option value="마케팅팀">마케팅팀</option>
                <option value="영업팀">영업팀</option>
                <option value="인사팀">인사팀</option>
                <option value="경영지원팀">경영지원팀</option>
              </select>
            </div>

            <!-- 경력 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                경력 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.experience" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">경력을 선택하세요</option>
                <option value="신입">신입</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5년 이상">5년 이상</option>
                <option value="경력무관">경력무관</option>
              </select>
            </div>

            <!-- 고용 형태 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                고용 형태 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.type" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">고용 형태를 선택하세요</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
                <option value="프리랜서">프리랜서</option>
              </select>
            </div>

            <!-- 담당자 선택 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                담당자 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="formData.assignedTo" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="">담당자를 선택하세요</option>
                <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                  {{ member.name }} ({{ member.department }})
                </option>
              </select>
            </div>

            <!-- 날짜 및 시간 정보 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 기간 <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">게시일</label>
                  <input 
                    v-model="formData.postedDate" 
                    type="date" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">마감일</label>
                  <input 
                    v-model="formData.deadline" 
                    type="date" 
                    :min="formData.postedDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  />
                </div>
              </div>
              
              <!-- 시간 선택 (30분 단위) -->
              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">시작 시간</label>
                  <select 
                    v-model="formData.startTime" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  >
                    <option v-for="time in timeOptions" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">종료 시간</label>
                  <select 
                    v-model="formData.endTime" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  >
                    <option v-for="time in timeOptions" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div v-if="daysLeft !== null" class="mt-2 flex items-center gap-2">
                <Clock class="w-4 h-4 text-gray-500" />
                <p :class="['text-xs font-medium', daysLeft <= 7 ? 'text-red-600' : 'text-gray-600']">
                  마감까지 {{ daysLeft }}일 남음
                  <span v-if="daysLeft <= 7" class="ml-1">(긴급)</span>
                </p>
              </div>
            </div>

            <!-- 상태 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">상태</label>
              <select 
                v-model="formData.status" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              >
                <option value="recruiting">채용중</option>
                <option value="screening">서류검토중</option>
                <option value="interviewing">면접진행중</option>
                <option value="closed">마감</option>
                <option value="paused">일시중단</option>
              </select>
            </div>
          </div>

          <!-- 오른쪽 컬럼: 상세 정보 -->
          <div class="space-y-5">
            <!-- 공고 설명 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                공고 설명
              </label>
              <textarea 
                v-model="formData.description" 
                rows="4" 
                placeholder="회사 및 포지션에 대한 소개를 입력하세요..." 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>

            <!-- 주요 업무 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                주요 업무
              </label>
              <textarea 
                v-model="formData.responsibilities" 
                rows="4" 
                placeholder="예:&#10;- React를 이용한 웹 애플리케이션 개발&#10;- UI/UX 개선 및 최적화&#10;- 팀원들과 협업하여 기능 구현" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>

            <!-- 자격 요건 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                자격 요건
              </label>
              <textarea 
                v-model="formData.requirements" 
                rows="4" 
                placeholder="예:&#10;- React 3년 이상 실무 경험&#10;- TypeScript 사용 가능자&#10;- Git을 이용한 협업 경험" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>

            <!-- 우대 사항 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                우대 사항 (선택사항)
              </label>
              <textarea 
                v-model="formData.preferences" 
                rows="3" 
                placeholder="예:&#10;- Next.js 프레임워크 경험자&#10;- 오픈소스 기여 경험&#10;- 스타트업 근무 경험" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>

            <!-- 복리후생 -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                복리후생 (선택사항)
              </label>
              <textarea 
                v-model="formData.benefits" 
                rows="3" 
                placeholder="예:&#10;- 4대보험 및 퇴직금&#10;- 점심 식대 지원&#10;- 자기계발비 지원" 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 옵션 -->
        <div class="mt-6 space-y-3">
          <!-- 긴급 공고 -->
          <label class="flex items-center gap-3 p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition">
            <input 
              v-model="formData.isUrgent" 
              type="checkbox" 
              class="w-5 h-5 text-orange-600 rounded" 
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900">긴급 공고로 표시</p>
              <p class="text-xs text-gray-500">목록에서 강조되어 표시됩니다</p>
            </div>
            <AlertCircle class="w-5 h-5 text-orange-500" />
          </label>
        </div>

        <!-- 유효성 검사 알림 -->
        <div v-if="!isFormValid && showValidation" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-red-900 mb-1">필수 항목을 입력해주세요</p>
              <ul class="text-xs text-red-700 space-y-1">
                <li v-if="!formData.title">• 공고 제목</li>
                <li v-if="!formData.position">• 직무</li>
                <li v-if="!formData.department">• 부서</li>
                <li v-if="!formData.experience">• 경력</li>
                <li v-if="!formData.type">• 고용 형태</li>
                <li v-if="!formData.assignedTo">• 담당자</li>
                <li v-if="!formData.postedDate">• 게시일</li>
                <li v-if="!formData.deadline">• 마감일</li>
              </ul>
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
          @click="saveJob" 
          :disabled="!isFormValid" 
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2',
            isFormValid ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          <Check class="w-4 h-4" />
          {{ editingId ? '수정하기' : '공고 등록' }}
        </button>

        <button
          v-if="props.editingId !== null"
          @click.stop="deleteSchedule(props.editingId)"
          class="px-4 py-2.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition"
        >
          삭제
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Briefcase, X, Check, Clock, AlertCircle, CalendarDays } from 'lucide-vue-next'

// API
import { getJobPostingSchedules, deleteJobPostingSchedule } from '@/api/schedules/jobposting/jobposting'

// Props
interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
}

interface Props {
  showModal?: boolean
  editingId?: number | null
  initialData?: any
  teamMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
  editingId: null,
  initialData: null,
  teamMembers: () => []
})

// Emits
const emit = defineEmits<{
  'close': []
  'save': [data: any]
  'delete': [id: number]
}>()

const jobs = ref<any[]>([])  // ✅ 더미 데이터 삭제

const isLoading = ref(false)
const errorMessage = ref('')

// 30분 단위 시간 옵션 생성
const timeOptions = computed(() => {
  const options: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = String(hour).padStart(2, '0')
      const m = String(minute).padStart(2, '0')
      options.push(`${h}:${m}`)
    }
  }
  return options
})

// Form data
const formData = ref({
  title: '',
  position: '',
  department: '',
  experience: '',
  type: '',
  assignedTo: null as number | null,
  postedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  startTime: '09:00',
  endTime: '18:00',
  status: 'recruiting',
  description: '',
  responsibilities: '',
  requirements: '',
  preferences: '',
  benefits: '',
  isUrgent: false
})

const showValidation = ref(false)

// Computed
const daysLeft = computed(() => {
  if (!formData.value.deadline) return null
  const today = new Date()
  const deadline = new Date(formData.value.deadline)
  const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
})

const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.position && 
         formData.value.department && 
         formData.value.experience && 
         formData.value.type && 
         formData.value.assignedTo &&
         formData.value.postedDate && 
         formData.value.deadline
})

const fetchJobPostings = async () => {
  try {
    isLoading.value = true

    const result = await getJobPostingSchedules()  // ✅ 배열 자체 반환됨
    console.log('📌 서버 응답:', result)

    jobs.value = Array.isArray(result) ? result : []

  } catch (error) {
    console.error('❌ 공고 목록 오류:', error)
    errorMessage.value = '공고 목록을 불러오는데 실패했습니다.'
    jobs.value = []
  } finally {
    isLoading.value = false
  }
}

const deleteSchedule = async (jobId: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await deleteJobPostingSchedule(jobId)
    alert('✅ 공고가 삭제되었습니다.')

    emit('delete', jobId)   // ✅ 부모에게 삭제 알림
    closeModal()            // ✅ 모달 닫기만 수행
  } catch (error) {
    console.error('❌ 삭제 실패:', error)
    alert('삭제 중 오류가 발생했습니다.')
  }
}


// Methods
const closeModal = () => {
  emit('close')
  resetForm()
}

const saveJob = () => {
  showValidation.value = true
  
  if (!isFormValid.value) {
    return
  }
  
  // Calculate days left and urgent status
  const calculatedDaysLeft = daysLeft.value || 0
  const isUrgent = formData.value.isUrgent || calculatedDaysLeft <= 7
  
  emit('save', {
    ...formData.value,
    id: props.editingId,
    daysLeft: calculatedDaysLeft,
    isUrgent,
    applicants: props.editingId ? undefined : 0, // 새 공고는 지원자 0명
    progress: props.editingId ? undefined : 0,
    screening: props.editingId ? undefined : 0,
    interview1: props.editingId ? undefined : 0,
    interview2: props.editingId ? undefined : 0,
    final: props.editingId ? undefined : 0
  })
  
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    position: '',
    department: '',
    experience: '',
    type: '',
    assignedTo: null,
    postedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    startTime: '09:00',
    endTime: '18:00',
    status: 'recruiting',
    description: '',
    responsibilities: '',
    requirements: '',
    preferences: '',
    benefits: '',
    isUrgent: false
  }
  showValidation.value = false
}

const getDaysDifference = () => {
  if (!formData.value.postedDate || !formData.value.deadline) return 1
  return calculateDaysDifference(formData.value.postedDate, formData.value.deadline)
}

const calculateDaysDifference = (postedDate: string, deadline: string): number => {
  const start = new Date(postedDate)
  const end = new Date(deadline)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

// Watch for initial data (edit mode)
watch(() => props.initialData, (data) => {
  if (data) {
    // 기존 데이터가 있으면 모든 필드 업데이트
    formData.value = { 
      ...formData.value,
      ...data 
    }
  }
}, { immediate: true, deep: true })

// Watch showModal to reset or apply initial data
watch(() => props.showModal, (isOpen) => {
  if (isOpen && props.initialData) {
    // 모달이 열릴 때 initial data 적용
    formData.value = { 
      ...formData.value,
      ...props.initialData 
    }
  }
})

// Validate deadline is after posted date
watch(() => formData.value.deadline, (newDeadline) => {
  if (newDeadline && formData.value.postedDate) {
    const posted = new Date(formData.value.postedDate)
    const deadline = new Date(newDeadline)
    
    if (deadline < posted) {
      alert('마감일은 게시일 이후여야 합니다.')
      formData.value.deadline = formData.value.postedDate
    }
  }
})
</script>
