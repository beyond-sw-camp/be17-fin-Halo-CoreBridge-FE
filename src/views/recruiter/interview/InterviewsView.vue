<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import InterviewDetailModal from '@/components/recruiter-dashboard/interview/detail-modal/InterviewDetailModal.vue'
import type { Interview, InterviewListResponse, InterviewParam, interviewType } from '@/types/interview/interview'
import interviewAPI from '@/api/interview'
import PaginationComp from '@/components/common/PaginationComp.vue'

const interviewsList = ref<InterviewListResponse>({
  interviews: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0
})

const getStatusColor = (status: string) => {
  const colors = {
    ONGOING: 'bg-green-500 text-white',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-slate-100 text-slate-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors]
}

const getStatusLabel = (status: string) => {
  const labels = {
    ongoing: '진행중',
    scheduled: '예정',
    completed: '완료',
    cancelled: '취소'
  }
  return labels[status as keyof typeof labels]
}

const getInitail = (name: String) => {
  return name.charAt(0).toUpperCase()
}

const isDetailModalOpen = ref(false)
const interviewId = ref(0)
const openDetailModal = (id: number) => {
  interviewId.value = id
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
}

const selectInterviewType = ref('')
const selectInterviewStatus = ref('')
const searchQuery = ref(undefined)

const interviewParam = ref<InterviewParam>({
  type: undefined,
  page: interviewsList.value.currentPage,
  search: searchQuery.value,
  status: undefined
})

const setInterviewsList = (data: InterviewListResponse) => {
  interviewsList.value.interviews = data.interviews
  interviewsList.value.currentPage = data.currentPage
  interviewsList.value.totalElements = data.totalElements
  interviewsList.value.totalPages = data.totalPages
}

const loadInterviews = async () => {
  const response = await interviewAPI.requestGetInterivews(interviewParam.value)
  if (response.success) {
    interviewsList.value.interviews = response.results.interviews
    interviewsList.value.currentPage = response.results.currentPage
    interviewsList.value.totalElements = response.results.totalElements
    interviewsList.value.totalPages = response.results.totalPages
  }
}

onMounted(async () => {
  const response = await interviewAPI.requestGetInterivews(interviewParam.value)
  if (response.success) {
    setInterviewsList(response.results)
  }

})

const setSelectInterviewStatus = () => {
  interviewParam.value.status = selectInterviewStatus.value === '' ? undefined : selectInterviewStatus.value
}

const handleSearch = async () => {

  setSelectInterviewStatus()
  interviewParam.value.search = searchQuery.value
  interviewParam.value.page = 0

  await loadInterviews()
}

const handleSelectStatus = async () => {

  setSelectInterviewStatus()

  interviewParam.value.search = searchQuery.value
  interviewParam.value.page = 0

  await loadInterviews()
}

const onUpdatePage = async (newPage: number) => {

  setSelectInterviewStatus()

  interviewParam.value.search = searchQuery.value
  interviewParam.value.page = newPage - 1

  const response = await interviewAPI.requestGetInterivews(interviewParam.value)

  if (response.success) {
    setInterviewsList(response.results)
  }
}

const getLocation = (interview: Interview) => {
  if (interview.interviewType.code === 'ONLINE') {
    return interview.interviewType.label
  }

  return interview.location
}
</script>
<template>
  <InterviewDetailModal @close="closeDetailModal" :open-modal="isDetailModalOpen" :interviewId="interviewId" />
  <div class="min-h-screen ">
    <!-- Header -->
    <header class="mb-3">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 mb-2">면접 목록</h1>
          <p class="text-sm text-slate-500 mt-1">전체 면접 일정을 관리하세요</p>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main>
      <!-- Filters -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
        <form class="flex flex-col gap-5" @submit.prevent="handleSearch">
          <div class="flex gap-5">
            <div class="relative flex-1">
              <Search :size="20" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="지원자명 검색" v-model="searchQuery"
                class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all" />
            </div>
            <button @click="handleSearch"
              class="hover:cursor-pointer px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">
              검색
            </button>
          </div>
          <select v-model="selectInterviewStatus" @change="handleSelectStatus"
            class="hover:cursor-pointer px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all">
            <option value="">전체 상태</option>
            <option value="SCHEDULED">예정</option>
            <option value="ONGOING">진행중</option>
            <option value="COMPLETED">완료</option>
            <option value="CANCELLED">취소</option>
          </select>
        </form>
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <p class="text-sm text-slate-600">
            총 <span class="font-bold text-slate-800">{{ interviewsList.totalElements }}</span>건의 면접
          </p>
        </div>
      </div>

      <!-- Interview Cards -->
      <div class="space-y-3 mb-5">
        <div v-for="interview in interviewsList.interviews" :key="interview.id"
          class="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:cursor-pointer overflow-hidden"
          :class="{ 'opacity-75': interview.interviewStatus.code === 'completed' || interview.interviewStatus.code === 'cancelled', 'opacity-60': interview.interviewStatus.code === 'cancelled' }">
          <div class="flex items-center justify-between" @click="openDetailModal(interview.id)">
            <div class="flex items-center space-x-6 flex-1">
              <!-- Date & Time -->
              <div class="text-center w-32">
                <p class="text-lg font-bold text-slate-800">{{ interview.startDateTime }}</p>
              </div>

              <div class="w-px h-12 bg-slate-200"></div>

              <!-- Applicant Info -->
              <div class="flex items-center space-x-4 w-72">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <span class="text-white font-semibold">{{ getInitail(interview.name) }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-800 mb-1">{{ interview.name }}</h3>
                </div>
              </div>

              <div class="w-px h-12 bg-slate-300"></div>

              <!-- Interview Info -->
              <div class="w-44">
                <p class="text-sm font-medium text-slate-800 mb-1">{{ interview.process }}</p>
                <p class="text-sm text-slate-500">{{ interview.duration }}분 · {{ getLocation(interview) }}</p>
              </div>

              <div class="w-px h-12 bg-slate-200"></div>

              <!-- Interviewers -->
              <div class="flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div v-for="(interviewer, idx) in interview.interviewers" :key="idx"
                    class="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                    {{ getInitail(interviewer.name) }}
                  </div>
                </div>
                <!-- <span v-if="interview.interviewers.length > 2" class="text-sm text-slate-500">
                  외 {{ interview.interviewers.length - 2 }}명
                </span> -->
              </div>
            </div>

            <!-- Status & Actions -->
            <div class="flex items-center space-x-3">
              <span class="px-4 py-2 text-sm font-medium rounded-xl"
                :class="getStatusColor(interview.interviewStatus.code)">
                {{ interview.interviewStatus.label }}
              </span>
              <!-- <button class="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <MoreVertical :size="20" class="text-slate-600" />
              </button> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <PaginationComp v-if="interviewsList.totalPages > 1" :total-pages="interviewsList.totalPages"
        :current-page="interviewsList.currentPage + 1" :group-size="10" @update:current-page="onUpdatePage" />
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}
</style>
