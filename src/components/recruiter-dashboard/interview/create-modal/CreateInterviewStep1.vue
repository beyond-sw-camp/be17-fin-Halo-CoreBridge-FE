<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { InterviewCreateForm, InterviewCreateFormErrors, Interviewer, InterviewModalData } from '@/types/interview/interview';
import {
  User,
  Clipboard,
  Calendar,
  MapPin,
  Users,
  FileText
} from 'lucide-vue-next'
import interviewAPI from '@/api/interview';
import { useRoute } from 'vue-router';

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  openModal: Boolean
  interviewModalData: InterviewModalData
}>()

const formData = ref<InterviewCreateForm>({
  startDate: '',
  startTime: '',
  duration: '',
  description: '',
  location: '',
  interviewType: '',
  resumeId: props.interviewModalData.resumeId,
  recruiterProcessId: props.interviewModalData.stageId
})

const initialErrors = reactive<InterviewCreateFormErrors>({
  startDate: '',
  startTime: '',
  duration: '',
  description: '',
  location: '',
  interviewType: '',
  resumeId: '', // 빈 문자열로 초기화
  recruiterProcessId: '', // 빈 문자열로 초기화
  global: ''
})

const errors: InterviewCreateFormErrors = reactive({ ...initialErrors })

// 이메일 인증 관련

const validateForm = () => {

  Object.assign(errors, initialErrors) // 에러 초기화

  let valid: boolean = true

  if (!formData.value.startDate) {
    errors.startDate = '면접 날짜를 선택해주세요.'
    valid = false
  }

  if (!formData.value.startTime) {
    errors.startTime = '시작 시간을 선택해주세요.'
    valid = false
  }

  if (!formData.value.duration) {
    errors.duration = '소요 시간을 선택해주세요.'
    valid = false
  }

  if (!formData.value.location.trim()) {
    errors.location = '면접 장소를 입력해주세요.'
    valid = false
  }

  if (!formData.value.interviewType.trim()) {
    errors.interviewType = '면접 방식을 선택해주세요.'
    valid = false
  }

  // resumeId와 recruiterProcessId는 props에서 오므로, undefined 여부만 확인
  if (formData.value.resumeId === undefined) {
    errors.resumeId = '지원자 정보가 누락되었습니다.'
    valid = false
  }

  if (formData.value.recruiterProcessId === undefined) {
    errors.recruiterProcessId = '면접 단계 정보가 누락되었습니다.'
    valid = false
  }

  return valid
}

const route = useRoute()

const interviewDataForCreate = props.interviewModalData

/**
 * ===========================
 * 공고 데이터 불러오기
 * ===========================
 */

const loadInterviewers = async () => {
  // jobPostingId 대신 stageId 사용
  const stageId: number | undefined = props.interviewModalData.stageId
  if (stageId === undefined) {
    alert('면접 단계 정보가 없어 면접관을 불러올 수 없습니다.')
    return
  }

  const response = await interviewAPI.requestInterviewersForInterviewCreate(Number(route.params.id))

  if (response.success && response.results) {
    interviewers.value = response.results.interviewers
  } else {
    alert('면접관 정보를 불러오는데 실패하였습니다.')
  }
}

// 컴포넌트 마운트 시 공고 목록 불러오기
onMounted(async () => {

  if (props.openModal) {
    await loadInterviewers()
  }

})

// 모달 다시 열릴 때도 재조회
watch(() => props.openModal, async (newVal) => {
  initFormData()

  if (newVal) {
    await loadInterviewers()
  }

})

const initFormData = () => {
  formData.value = {
    startDate: '',
    startTime: '',
    duration: '',
    description: '',
    location: '',
    interviewType: '',
    resumeId: undefined,
    recruiterProcessId: undefined
  }
}

/**
 * =============================
 * 면접관 데이터 불러오기
 * =============================
 */
const interviewers = ref<Interviewer[]>()

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const handleSubmit = async () => {

  if (validateForm()) {
    const response = await interviewAPI.requestAddInterview(formData.value)
    if (response.success) {
      alert("면접 등록 완료")
      emit('close')
      return
    }

    alert(response.message)
  }

}

</script>

<template>
  <!-- Form Content -->
  <div class="px-8 py-6 overflow-y-auto flex-1">
    <form class="space-y-6" @submit.prevent="handleSubmit">

      <!-- 지원자 선택 및 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <User :size="16" class="mr-2" />
          지원자
        </h3>
        <div class="space-y-4">
          <div class="bg-white">
            <input v-model="interviewDataForCreate.userName" type="text"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none " readonly />
          </div>
        </div>
      </div>

      <!-- 면접 기본 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Clipboard :size="16" class="mr-2" />
          면접 기본 정보
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 유형 *</label>
              <input v-model="interviewDataForCreate.stageName" type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none " readonly />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 방식 *</label>
              <select v-model="formData.interviewType"
                :class="{ 'border-red-500 focus:ring-red-500': errors.interviewType }"
                class="hover:cursor-pointer w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option value="" disabled>면접 방식</option>
                <option value="OFFLINE">오프라인 면접</option>
                <option value="ONLINE">화상 면접</option>
              </select>
              <p v-if="errors.interviewType" class="text-red-500 text-xs mt-1">{{ errors.interviewType }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 일정 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Calendar :size="16" class="mr-2" />
          일정 정보
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">면접 날짜 *</label>
              <input v-model="formData.startDate" type="date"
                :class="{ 'border-red-500 focus:ring-red-500': errors.startDate }"
                class="hover:cursor-pointer w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600"
                required />
              <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">시작 시간 *</label>
              <input v-model="formData.startTime" type="time"
                :class="{ 'border-red-500 focus:ring-red-500': errors.startTime }"
                class="hover:cursor-pointer w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600"
                required />
              <p v-if="errors.startTime" class="text-red-500 text-xs mt-1">{{ errors.startTime }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">소요 시간 *</label>
              <select v-model="formData.duration" :class="{ 'border-red-500 focus:ring-red-500': errors.duration }"
                class="hover:cursor-pointer w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 bg-white">
                <option value="" disabled>소요 시간</option>
                <option value="30">30분</option>
                <option value="60">60분</option>
                <option value="90">90분</option>
                <option value="120">120분</option>
              </select>
              <p v-if="errors.duration" class="text-red-500 text-xs mt-1">{{ errors.duration }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 장소 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <MapPin :size="16" class="mr-2" />
          장소 정보
        </h3>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">면접 장소 *</label>
          <input v-model="formData.location" type="text"
            :class="{ 'border-red-500 focus:ring-red-500': errors.location }"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none " />
          <p v-if="errors.location" class="text-red-500 text-xs mt-1">{{ errors.location }}</p>
        </div>
      </div>

      <!-- 면접관 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <Users :size="16" class="mr-2" />
          해당 공고에 배정된 면접관
        </h3>
        <div class="space-y-3 overflow-y-auto max-h-60">
          <div v-for="interviewer, index in interviewers" :key="index"
            class="flex items-center gap-4 p-3 bg-white border border-slate-300 rounded-xl hover:border-slate-300 transition-all shadow-md">
            <div
              class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold">{{ getInitial(interviewer.name) }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ interviewer.name }}</p>
              <p class="text-xs text-slate-500">admin01@core-bridge.co.kr</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 추가 정보 -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <FileText :size="16" class="mr-2" />
          추가 정보
        </h3>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">메모 (선택)</label>
          <textarea v-model="formData.description" rows="4" placeholder="면접과 관련된 메모나 특이사항을 입력하세요..."
            :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none">
          </textarea>
          <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
        </div>
      </div>
    </form>
  </div>
  <footer class="px-8 py-6 border-t border-slate-300 bg-slate-50 rounded-b-2xl">
    <div class="flex justify-end gap-2">
      <button @click="handleSubmit" type="button"
        class="hover:cursor-pointer px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg transition-all">
        면접 등록
      </button>
    </div>
  </footer>
</template>

<style scoped></style>